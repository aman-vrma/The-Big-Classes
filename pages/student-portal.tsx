import { useState, useEffect } from "react";
import { findExamRoom, ExamCandidate } from "../lib/room-store";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Download, 
  Award, 
  Mail,
  User,
  Hash
} from "lucide-react";

interface QuestionItem {
  id?: number | string;
  question: string;
  options: string[];
  correctAnswer?: string | number;
}

export function StudentPortal() {
  const [examPin, setExamPin] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [pinError, setPinError] = useState("");

  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>([]);
  const [quizTitle, setQuizTitle] = useState("Proctored Examination");

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [strikes, setStrikes] = useState(0);
  const [score, setScore] = useState(0);

  // Helper to persist candidate updates into room-store storage for Teacher's view
  const syncCandidateToRoomStore = (status: "in-progress" | "completed" | "disqualified", finalScore?: number) => {
    const cleanPin = examPin.trim().toUpperCase();
    if (!cleanPin || !studentName.trim()) return;

    try {
      const candidatesKey = `ai_classroom_candidates_${cleanPin}`;
      const existing: ExamCandidate[] = JSON.parse(localStorage.getItem(candidatesKey) || "[]");
      
      const currentScore = finalScore !== undefined ? finalScore : score;
      const totalQ = activeQuestions.length || 1;
      const pct = Math.round((currentScore / totalQ) * 100);

      const candidateRecord: ExamCandidate = {
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim() || undefined,
        roomCode: cleanPin,
        score: currentScore,
        total: totalQ,
        percentage: pct,
        status: status,
        violations: strikes,
        updatedAt: new Date().toISOString(),
      };

      const existingIndex = existing.findIndex(
        (c) => c.studentName.toLowerCase() === studentName.trim().toLowerCase()
      );

      if (existingIndex >= 0) {
        existing[existingIndex] = candidateRecord;
      } else {
        existing.push(candidateRecord);
      }

      localStorage.setItem(candidatesKey, JSON.stringify(existing));
    } catch (e) {
      console.error("Failed to sync candidate state:", e);
    }
  };

  // Tab switch anti-cheating detection
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setStrikes((prev) => {
          const nextVal = prev + 1;
          if (nextVal >= 3) {
            triggerFinalSubmit(selectedAnswers, activeQuestions, nextVal);
          } else {
            syncCandidateToRoomStore("in-progress");
          }
          return nextVal;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [examStarted, examSubmitted, selectedAnswers, activeQuestions, strikes]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerFinalSubmit(selectedAnswers, activeQuestions, strikes);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, selectedAnswers, activeQuestions, strikes]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");

    const cleanPin = examPin.trim().toUpperCase();

    if (!studentName.trim() || !studentEmail.trim() || !cleanPin) {
      setPinError("Please enter your name, email, and the 6-digit room PIN.");
      return;
    }

    // 1. Direct query from room-store (used by teacher's saveExamRoom)
    const room = findExamRoom(cleanPin);

    if (!room) {
      setPinError(`Room PIN "${cleanPin}" not found. Please verify with faculty.`);
      return;
    }

    if (room.status === "closed") {
      setPinError(`Room PIN "${cleanPin}" has already been closed by faculty.`);
      return;
    }

    if (!room.questions || room.questions.length === 0) {
      setPinError("This exam room contains no active questions.");
      return;
    }

    setActiveQuestions(room.questions);
    setQuizTitle(room.topic || "Proctored Examination");
    setTimeLeft((room.durationMinutes || 10) * 60);
    setExamStarted(true);
    setExamSubmitted(false);
    setStrikes(0);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});

    // Notify teacher dashboard candidate joined
    setTimeout(() => syncCandidateToRoomStore("in-progress"), 100);
  };

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const triggerFinalSubmit = (
    answers: { [key: number]: number },
    questions: QuestionItem[],
    currentStrikes = strikes
  ) => {
    let finalScore = 0;

    questions.forEach((q, idx) => {
      const selectedIdx = answers[idx];
      if (selectedIdx === undefined) return;

      const selectedOptionText = q.options?.[selectedIdx];

      if (typeof q.correctAnswer === "string") {
        if (selectedOptionText === q.correctAnswer) finalScore += 1;
      } else if (typeof q.correctAnswer === "number") {
        if (selectedIdx === q.correctAnswer) finalScore += 1;
      }
    });

    setScore(finalScore);
    setExamSubmitted(true);

    const finalStatus = currentStrikes >= 3 ? "disqualified" : "completed";
    syncCandidateToRoomStore(finalStatus, finalScore);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDownloadPDF = () => {
    const percentage = activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0;
    const issueDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Scorecard - ${studentName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #0f172a; }
            .cert-container { border: 8px solid #1e293b; padding: 40px; max-width: 700px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: 800; color: #1e3a8a; margin: 0; }
            .content { margin: 30px 0; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #cbd5e1; }
            .score-box { text-align: center; background: #f8fafc; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .score-number { font-size: 38px; font-weight: 900; color: #2563eb; }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <div class="header">
              <h1 class="title">THE BIG CLASSES</h1>
              <p>OFFICIAL PROCTORED EXAMINATION SCORECARD</p>
            </div>
            <div class="content">
              <div class="row"><span>Candidate Name</span><b>${studentName}</b></div>
              <div class="row"><span>Candidate Email</span><b>${studentEmail}</b></div>
              <div class="row"><span>Session Room PIN</span><b>${examPin}</b></div>
              <div class="row"><span>Exam Title</span><b>${quizTitle}</b></div>
              <div class="row"><span>Evaluation Date</span><b>${issueDate}</b></div>
              <div class="row"><span>Proctor Status</span><b>${strikes >= 3 ? "Violated Strikes (Disqualified)" : "Verified Clear"}</b></div>
            </div>
            <div class="score-box">
              <div>ACQUIRED SCORE</div>
              <div class="score-number">${score} / ${activeQuestions.length}</div>
              <b>${percentage}% Accuracy</b>
            </div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. ROOM ACCESS ENTRY */}
      {!examStarted && !examSubmitted && (
        <div className="space-y-6">
          <header className="border-b border-slate-800 pb-5">
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Student Assessment Arena
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Enter your verified details and active faculty PIN to load your test.
            </p>
          </header>

          <Card className="p-8 border-slate-800 bg-slate-900/90 shadow-xl rounded-2xl max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Enter Exam Desk</h2>
                <p className="text-xs text-slate-400">Proctored session verification</p>
              </div>
            </div>

            <form onSubmit={handleStartExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Candidate Full Name
                </label>
                <Input
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aman Verma"
                  className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Candidate Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. student@thebigclasses.edu"
                  className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-400" />
                  6-Digit Exam Room PIN
                </label>
                <Input
                  required
                  maxLength={6}
                  value={examPin}
                  onChange={(e) => setExamPin(e.target.value.toUpperCase())}
                  placeholder="e.g. 849201"
                  className="bg-slate-950 border-slate-700 text-white font-mono text-center tracking-widest text-lg font-bold placeholder:tracking-normal placeholder:text-sm placeholder:font-normal h-11"
                />
              </div>

              {pinError && (
                <p className="text-xs text-red-400 font-semibold bg-red-950/40 border border-red-800/60 p-2.5 rounded-lg">
                  {pinError}
                </p>
              )}

              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-blue-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
                  Anti-Cheating Regulations:
                </p>
                <p>• Navigating out of the active window triggers an automatic strike.</p>
                <p>• 3 strikes immediately submits your test session.</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all"
              >
                Authenticate & Load Faculty Exam
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* 2. ACTIVE EXAM ROOM */}
      {examStarted && !examSubmitted && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {quizTitle} • Room #{examPin}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-mono text-sm font-bold">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Strikes: {strikes} / 3</span>
              </div>
            </div>
          </div>

          <Card className="p-8 border-slate-800 bg-slate-900/90 shadow-2xl rounded-2xl">
            <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
              <span>Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
              <span className="text-blue-400 font-semibold">{studentName} ({studentEmail})</span>
            </div>

            <h2 className="text-lg font-bold text-white mb-6 leading-relaxed">
              {activeQuestions[currentQuestionIdx]?.question}
            </h2>

            <div className="space-y-3 mb-8">
              {activeQuestions[currentQuestionIdx]?.options?.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <span>{option}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-blue-400 bg-blue-600 text-white" : "border-slate-700"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <Button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
              >
                Previous
              </Button>

              {currentQuestionIdx < activeQuestions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  onClick={() => triggerFinalSubmit(selectedAnswers, activeQuestions)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 shadow-lg shadow-emerald-600/20"
                >
                  Submit Final Assessment
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 3. SUBMITTED VIEW */}
      {examSubmitted && (
        <div className="space-y-6">
          <Card className="p-8 border-slate-800 bg-slate-900/90 shadow-2xl rounded-2xl text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Assessment Submitted
              </h2>
              <p className="text-slate-400 text-xs">
                Candidate: <b className="text-slate-200">{studentName}</b> ({studentEmail}) • Room: <b className="text-slate-200">#{examPin}</b>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 max-w-xs mx-auto">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Final Score</p>
              <p className="text-4xl font-black text-blue-400 font-mono">
                {score} / {activeQuestions.length}
              </p>
              <p className="text-xs font-semibold text-emerald-400">
                {activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0}% Accuracy
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleDownloadPDF}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Scorecard (PDF)</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}