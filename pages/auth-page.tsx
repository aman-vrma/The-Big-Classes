import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../lib/auth-context";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  CheckCircle2
} from "lucide-react";

export function AuthPage() {
  const [, setLocation] = useLocation();
  const { loginAs } = useAuth();

  const [activeStep, setActiveStep] = useState<"select" | "login">("select");
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student">("teacher");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectRole = (role: "teacher" | "student") => {
    setSelectedRole(role);
    setErrorMsg("");
    if (role === "teacher") {
      setEmail("faculty@thebigclasses.edu");
      setPassword("faculty123");
    } else {
      setEmail("student@thebigclasses.edu");
      setPassword("student123");
    }
    setActiveStep("login");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const displayName = selectedRole === "teacher" ? "Faculty Admin" : "Registered Student";
    loginAs(selectedRole, displayName, email.trim());

    if (selectedRole === "teacher") {
      setLocation("/");
    } else {
      setLocation("/student");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center p-4 selection:bg-blue-600">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> THE BIG CLASSES PORTAL ACCESS
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-white drop-shadow-md">
            {activeStep === "select" ? "Select Your Classroom Workspace" : `${selectedRole === "teacher" ? "Faculty" : "Student"} Secure Portal Login`}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {activeStep === "select" 
              ? "Access AI-proctored examination halls, candidate ledgers, or real-time assessment desks."
              : `Enter your credentials to authenticate into the ${selectedRole === "teacher" ? "Educator & Proctor" : "Candidate"} Arena.`}
          </p>
        </div>

        {/* STEP 1: DUAL ROLE SELECTOR - PERFECT EQUAL HEIGHT & LEVEL BUTTONS */}
        {activeStep === "select" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Educator Card */}
            <Card 
              onClick={() => handleSelectRole("teacher")}
              className="p-7 rounded-2xl cursor-pointer transition-all duration-300 border border-slate-800 bg-slate-900/90 hover:border-blue-500 hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-500/20 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full font-bold bg-blue-900/60 text-blue-200 border border-blue-500/40">
                    FACULTY DESK
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
                  Educator & Proctor
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Create AI-generated exams, broadcast 6-digit room PINs, view live cheating strike logs, and review conducted archives.
                </p>

                {/* Bright Pure White Bullet Text */}
                <ul className="space-y-3 text-xs mb-8 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span style={{ color: "#ffffff" }} className="text-white font-medium">
                      Live Candidate Monitor & 3-Strike Rule
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span style={{ color: "#ffffff" }} className="text-white font-medium">
                      Automated AI Question Formulation
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span style={{ color: "#ffffff" }} className="text-white font-medium">
                      Complete Student Performance Ledger
                    </span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole("teacher");
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all mt-auto"
              >
                Enter as Faculty <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Candidate Card */}
            <Card 
              onClick={() => handleSelectRole("student")}
              className="p-7 rounded-2xl cursor-pointer transition-all duration-300 border border-slate-800 bg-slate-900/90 hover:border-indigo-500 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/20 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full font-bold bg-indigo-900/60 text-indigo-200 border border-indigo-500/40">
                    CANDIDATE DESK
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
                  Student & Examinee
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Join active exam rooms via room code, attempt timed tests with instant verified results, and clear doubts with AI.
                </p>

                {/* Bright Pure White Bullet Text */}
                <ul className="space-y-3 text-xs mb-8 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span style={{ color: "#ffffff" }} className="text-white font-medium">
                      Enter 6-Digit Room PIN to start test
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span style={{ color: "#ffffff" }} className="text-white font-medium">
                      Download Official Verified Scorecard (PDF)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span style={{ color: "#ffffff" }} className="text-white font-medium">
                      AI Concept Flashcards & Doubt Engine
                    </span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole("student");
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all mt-auto"
              >
                Enter as Student <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

          </div>
        )}

        {/* STEP 2: EMAIL & PASSWORD LOGIN INTERFACE */}
        {activeStep === "login" && (
          <div className="max-w-md mx-auto w-full">
            <Card className="p-8 rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setActiveStep("select")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Role Select
                </button>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-500/30">
                  {selectedRole === "teacher" ? "Faculty Auth" : "Candidate Auth"}
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@thebigclasses.edu"
                      className="pl-10 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11 text-sm rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11 text-sm rounded-xl"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 font-semibold bg-red-950/40 border border-red-800/60 p-2.5 rounded-lg">
                    {errorMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  className={`w-full py-3 h-11 font-bold text-sm rounded-xl shadow-lg transition-all ${
                    selectedRole === "teacher"
                      ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                  }`}
                >
                  Confirm & Launch Desk <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-400">
                  Preloaded with verified test credentials. Click button to enter directly.
                </p>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
