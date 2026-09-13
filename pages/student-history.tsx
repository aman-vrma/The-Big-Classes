import { useState } from "react";
import { getCandidateHistory, ExamCandidate } from "../lib/room-store";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { History, Mail, Award, AlertTriangle, CheckCircle2, XCircle, Clock3, Loader2 } from "lucide-react";

type HistoryRecord = ExamCandidate & { topic?: string; subject?: string };

export function StudentHistoryPage() {
  const [emailInput, setEmailInput] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const email = emailInput.trim();
    setSearchedEmail(email);
    setLoading(true);
    try {
      const data = await getCandidateHistory(email);
      setRecords(data);
    } catch (err) {
      console.error("Failed to load history:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
        </span>
      );
    }
    if (status === "disqualified") {
      return (
        <span className="inline-flex items-center gap-1 text-red-400 bg-red-950/40 border border-red-800/60 px-2.5 py-1 rounded-lg text-xs font-bold">
          <XCircle className="w-3.5 h-3.5" /> Disqualified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-lg text-xs font-bold">
        <Clock3 className="w-3.5 h-3.5" /> In Progress
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
          <History className="w-7 h-7 text-blue-400" />
          My Exam History
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Enter the email you used to take exams, and see every attempt and score.
        </p>
      </header>

      <Card className="p-6 border-slate-800 bg-slate-900/90 shadow-xl rounded-2xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
            <Input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. student@thebigclasses.edu"
              className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 h-11 pl-10"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 h-11 rounded-xl shadow-lg shadow-blue-600/30 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "View History"}
          </Button>
        </form>
      </Card>

      {!loading && searchedEmail && records.length === 0 && (
        <Card className="p-8 border-slate-800 bg-slate-900/90 rounded-2xl text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="text-slate-300 text-sm font-semibold">
            No exam attempts found for <span className="text-white">{searchedEmail}</span>
          </p>
          <p className="text-slate-500 text-xs">
            Make sure you're using the exact same email you entered while taking the exam.
          </p>
        </Card>
      )}

      {records.length > 0 && (
        <div className="space-y-4">
          {records.map((r, idx) => (
            <Card
              key={idx}
              className="p-5 border-slate-800 bg-slate-900/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-white font-bold text-sm">
                  {r.topic || "Untitled Exam"} <span className="text-slate-500 font-normal">• Room #{r.roomCode}</span>
                </p>
                <p className="text-slate-400 text-xs">
                  {r.subject ? `${r.subject} • ` : ""}
                  {new Date(r.updatedAt).toLocaleString()}
                </p>
                {statusBadge(r.status)}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Score</p>
                  <p className="text-lg font-black text-blue-400 font-mono flex items-center gap-1 justify-center">
                    <Award className="w-4 h-4" />
                    {r.score ?? 0}/{r.total ?? 0}
                  </p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Accuracy</p>
                  <p className="text-lg font-black text-emerald-400 font-mono">{r.percentage ?? 0}%</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
