import React, { useState } from "react";
import {
  UserProfile,
  UserRole,
  Course,
} from "../types";
import { DEMO_USERS, COURSES } from "../data/mockData";
import {
  Sparkles,
  ArrowRight,
  Shield,
  GraduationCap,
  Megaphone,
  BookOpen,
  FileText,
  Clock,
  Camera,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building,
  Award,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
} from "lucide-react";

interface LandingAuthPageProps {
  onLogin: (user: UserProfile) => void;
  onExploreAsGuest: () => void;
  usersRoster?: UserProfile[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function LandingAuthPage({
  onLogin,
  onExploreAsGuest,
  usersRoster = [],
  isDarkMode = false,
  onToggleDarkMode,
}: LandingAuthPageProps) {
  // Auth state
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState(""); // Matric No or Staff ID
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Software & Web Development");
  const [level, setLevel] = useState("HND 1 • 300 Level");
  const [repCourse, setRepCourse] = useState("SWD 311 (Operating System)");
  const [adminStaffTitle, setAdminStaffTitle] = useState("Head of Department & Academic Coordinator");
  const [authError, setAuthError] = useState<string | null>(null);

  // Handle Quick Demo Login for instant role testing
  const handleQuickDemoLogin = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    onLogin(demo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMode === "signin") {
      const targetEmail = email.trim().toLowerCase();
      const targetId = identifier.trim().toLowerCase();

      // Search roster first, then demo users
      const pool = [...usersRoster, ...Object.values(DEMO_USERS)];
      let matchedUser = pool.find(
        (u) =>
          u.role === selectedRole &&
          ((targetEmail && u.email.toLowerCase() === targetEmail) ||
            (targetId && u.matricNo.toLowerCase() === targetId))
      );

      // If user typed demo credentials or left blank
      if (!matchedUser) {
        const demo = DEMO_USERS[selectedRole];
        if (!targetEmail && !targetId) {
          matchedUser = demo;
        } else if (
          targetEmail.includes("demo") ||
          demo.email.toLowerCase() === targetEmail ||
          demo.matricNo.toLowerCase() === targetId
        ) {
          matchedUser = demo;
        }
      }

      if (matchedUser) {
        onLogin({ ...matchedUser, isLoggedIn: true });
        return;
      }

      // For privileged roles (Course Rep / Admin), require matching an assigned account
      if (selectedRole !== "student") {
        setAuthError(
          `No registered ${
            selectedRole === "admin" ? "Department Administrator" : "Course Representative"
          } found matching "${identifier || email}". Per academic policy, this account must first be assigned and provisioned by an Administrator.`
        );
        return;
      }

      // For Student, allow dynamic login if identifier was entered
      const generatedUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim() || "Scholar Student",
        matricNo: identifier || "SWD/2023/1042",
        email: email || "scholar@lucid.edu",
        department,
        level,
        avatarInitials: "SC",
        isLoggedIn: true,
        role: "student",
      };
      onLogin(generatedUser);
    } else {
      // Sign Up validation: Strict role check
      if (selectedRole !== "student") {
        setAuthError(
          "Course Representative and Administrator accounts cannot be self-registered. They must be officially assigned and provisioned by the Department Administrator."
        );
        return;
      }

      if (!name.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setAuthError("Please enter a valid academic or personal email.");
        return;
      }

      const initials =
        name
          .trim()
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "SC";

      const newUser: UserProfile = {
        id: `usr-reg-${Date.now()}`,
        name: name.trim(),
        matricNo: identifier.trim() || "SWD/2024/001",
        email: email.trim(),
        department,
        level,
        avatarInitials: initials,
        isLoggedIn: true,
        role: "student",
      };

      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0a0f1d] text-neutral-900 dark:text-slate-100 flex flex-col selection:bg-teal-100 selection:text-[#006d64] transition-colors duration-200">
      {/* Top Navbar */}
      <header className="border-b border-neutral-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0e1627]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#006d64] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              L
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#006d64]">
                Lucid
              </span>
              <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f0ebff] dark:bg-purple-950/60 text-[#7952eb] dark:text-purple-300 uppercase">
                BETA
              </span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                aria-label="Toggle Theme"
                className="w-12 h-6 rounded-full bg-neutral-200 dark:bg-slate-700 p-0.5 flex items-center transition-colors relative cursor-pointer"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 shadow-xs transform transition-transform flex items-center justify-center text-white text-[10px] ${
                    isDarkMode ? "translate-x-6" : "translate-x-0"
                  }`}
                >
                  {isDarkMode ? <Moon size={10} /> : <Sun size={10} />}
                </div>
              </button>
            )}

            <button
              onClick={onExploreAsGuest}
              className="text-xs font-semibold text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
            >
              Explore as Guest
            </button>
            <button
              onClick={() => {
                setAuthMode(authMode === "signin" ? "signup" : "signin");
                const authEl = document.getElementById("auth-section");
                authEl?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-[#006d64] hover:bg-[#005851] text-white transition-all shadow-xs"
            >
              {authMode === "signin" ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Section */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-10 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Value Proposition & Feature Highlights */}
            <div className="lg:col-span-6 space-y-6 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-xs font-bold text-[#006d64]">
                <Sparkles size={14} className="text-[#006d64]" />
                <span>Departmental Academic Hub & CBT Simulator</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 leading-[1.15]">
                Master Your Courses,{" "}
                <span className="text-[#006d64]">Excel in CBT</span> & Transcribe Notes.
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
                Lucid is the centralized academic workspace for higher education cohorts. Convert handwritten notebook scans into active-recall flashcards, train in authentic CBT exams with German penalty scoring, and access accredited departmental lab reports.
              </p>

              {/* 3 User Roles Highlight Pills */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Role-Differentiated Access
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#006d64] mb-1">
                      <GraduationCap size={15} />
                      <span>Scholar Student</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-tight">
                      Active recall flashcards, German CBT simulation, and OCR note conversion.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                      <Megaphone size={15} />
                      <span>Course Rep</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-tight">
                      Broadcast class notices, upload syllabus notes, and manage past questions.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 mb-1">
                      <Shield size={15} />
                      <span>Dept Admin</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-tight">
                      Full moderation, course directory units, exam rules & cohort analytics.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-neutral-200/70">
                  <div className="p-2 rounded-lg bg-teal-50 text-[#006d64] shrink-0">
                    <Camera size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Handwriting OCR</h4>
                    <p className="text-[11px] text-neutral-500">Scan notebook pages with camera into flashcards</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-neutral-200/70">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">CBT Exam Modes</h4>
                    <p className="text-[11px] text-neutral-500">Objective, German (-0.5 pts), & Theory marking</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-neutral-200/70">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Lab Practicals</h4>
                    <p className="text-[11px] text-neutral-500">Accredited apparatus, steps & observations</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-neutral-200/70">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-700 shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Past Papers</h4>
                    <p className="text-[11px] text-neutral-500">Searchable repository across academic sessions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive All-in-One Auth Card */}
            <div id="auth-section" className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden">
                {/* Auth Card Header */}
                <div className="bg-[#006d64] p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm">
                        L
                      </div>
                      <div>
                        <h2 className="text-base font-bold tracking-tight">Lucid Academic Access</h2>
                        <p className="text-xs text-teal-100/90">Sign in or register to enter your departmental hub</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-teal-100">
                      SECURE
                    </span>
                  </div>

                  {/* Mode Selector: Sign In vs Sign Up */}
                  <div className="grid grid-cols-2 p-1 rounded-xl bg-white/10 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signin");
                        setAuthError(null);
                      }}
                      className={`py-2 rounded-lg transition-all ${
                        authMode === "signin"
                          ? "bg-white text-[#006d64] shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setAuthError(null);
                      }}
                      className={`py-2 rounded-lg transition-all ${
                        authMode === "signup"
                          ? "bg-white text-[#006d64] shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Role Differentiation Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Select Account Role
                      </label>
                      {authMode === "signup" && (
                        <span className="text-[10px] text-amber-800 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Lock size={10} />
                          Rep & Admin: HOD Provisioned
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("student")}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          selectedRole === "student"
                            ? "border-[#006d64] bg-teal-50/60 ring-2 ring-[#006d64]/20"
                            : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/50"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            selectedRole === "student"
                              ? "bg-[#006d64] text-white"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          <GraduationCap size={15} />
                        </div>
                        <span className="text-xs font-bold text-neutral-800">Scholar</span>
                        <span className="text-[10px] text-neutral-400">Open Register</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("courserep")}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          selectedRole === "courserep"
                            ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20"
                            : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/50"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            selectedRole === "courserep"
                              ? "bg-amber-600 text-white"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          <Megaphone size={15} />
                        </div>
                        <span className="text-xs font-bold text-neutral-800">Course Rep</span>
                        <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                          {authMode === "signup" && <Lock size={9} />}
                          Admin Assigned
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("admin")}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          selectedRole === "admin"
                            ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20"
                            : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/50"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            selectedRole === "admin"
                              ? "bg-purple-600 text-white"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          <Shield size={15} />
                        </div>
                        <span className="text-xs font-bold text-neutral-800">Admin</span>
                        <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-0.5">
                          {authMode === "signup" && <Lock size={9} />}
                          Admin Assigned
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Quick 1-Click Demo Login Banner */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/90 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">
                        ⚡ Quick 1-Click Role Login
                      </span>
                      <span className="text-[10px] text-neutral-400">Instant Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin("student")}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold text-[#006d64] transition-colors text-center truncate"
                      >
                        🎓 Student Demo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin("courserep")}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold text-amber-800 transition-colors text-center truncate"
                      >
                        📢 Course Rep Demo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin("admin")}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[11px] font-bold text-purple-800 transition-colors text-center truncate"
                      >
                        🛡️ Admin Demo
                      </button>
                    </div>
                  </div>

                  {/* Signup Policy Check: Course Rep & Admin must be assigned by an Admin */}
                  {authMode === "signup" && selectedRole !== "student" ? (
                    <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-neutral-800 space-y-3 animate-scale-in">
                      <div className="flex items-center gap-2.5 text-amber-950 font-bold text-sm">
                        <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                          <Lock size={16} />
                        </div>
                        <div>
                          <h4>Official Department Authorization Required</h4>
                          <span className="text-[10px] text-amber-800 font-normal">
                            Institutional Access Control Policy
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-700 leading-relaxed">
                        <strong>
                          {selectedRole === "admin" ? "Department Administrator" : "Course Representative"}
                        </strong>{" "}
                        accounts cannot be self-registered publicly. Per faculty regulations, these accounts
                        must be officially registered and provisioned by the{" "}
                        <strong>Department Administrator (HOD / Exam Officer)</strong>.
                      </p>

                      <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs space-y-2">
                        <p className="font-bold text-neutral-900">Already have your assigned credentials?</p>
                        <p className="text-neutral-600 text-[11px]">
                          Switch to <strong>Sign In</strong> and enter your portal using your assigned Staff ID or
                          Matric Number.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signin");
                            setAuthError(null);
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-colors"
                        >
                          Switch to Sign In
                        </button>
                      </div>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedRole("student")}
                          className="text-xs font-semibold text-[#006d64] hover:underline"
                        >
                          ← Or create a regular Scholar (Student) account
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Sign Up: Full Name */}
                    {authMode === "signup" && (
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Kelechi Okafor"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 placeholder:text-neutral-400 outline-hidden transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Role Specific Identifier: Matric No or Staff ID */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {selectedRole === "admin"
                          ? "Departmental Staff ID / Key"
                          : selectedRole === "courserep"
                          ? "Course Rep Matriculation Number"
                          : "Student Matriculation Number"}
                      </label>
                      <div className="relative">
                        <Award size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          required
                          placeholder={
                            selectedRole === "admin"
                              ? "STAFF/ENG/049"
                              : selectedRole === "courserep"
                              ? "SWD/2023/0018"
                              : "SWD/2023/1042"
                          }
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 placeholder:text-neutral-400 outline-hidden transition-all uppercase"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {selectedRole === "admin" ? "Faculty Email" : "Institutional Email"}
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="email"
                          required
                          placeholder={
                            selectedRole === "admin"
                              ? "admin.hod@lucid.edu"
                              : selectedRole === "courserep"
                              ? "rep.blessing@lucid.edu"
                              : "scholar@lucid.edu"
                          }
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 placeholder:text-neutral-400 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Course Rep specific: Course Represented */}
                    {selectedRole === "courserep" && authMode === "signup" && (
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Class / Course Represented
                        </label>
                        <select
                          value={repCourse}
                          onChange={(e) => setRepCourse(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 text-xs text-neutral-900 outline-hidden transition-all"
                        >
                          {COURSES.map((c) => (
                            <option key={c.code} value={`${c.code} (${c.title})`}>
                              {c.code} — {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Department */}
                    {authMode === "signup" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Department
                          </label>
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 outline-hidden transition-all"
                          >
                            <option value="Software & Web Development">Software & Web Dev</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="General Studies">General Studies</option>
                            <option value="Mathematics">Mathematics</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            {selectedRole === "admin" ? "Faculty Office" : "Academic Level"}
                          </label>
                          <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 outline-hidden transition-all"
                          >
                            <option value="HND 1 • 300 Level">HND 1 (300L)</option>
                            <option value="HND 2 • 400 Level">HND 2 (400L)</option>
                            <option value="ND 1 • 100 Level">ND 1 (100L)</option>
                            <option value="ND 2 • 200 Level">ND 2 (200L)</option>
                            {selectedRole === "admin" && (
                              <option value="Faculty Board">Faculty Board / HOD</option>
                            )}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-neutral-700">
                          {selectedRole === "admin" ? "Security Admin Passkey" : "Password"}
                        </label>
                        {authMode === "signin" && (
                          <span className="text-[11px] text-neutral-400">
                            (Any password accepted for testing)
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 outline-hidden transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Error message */}
                    {authError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                        {authError}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                        selectedRole === "admin"
                          ? "bg-purple-700 hover:bg-purple-800"
                          : selectedRole === "courserep"
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-[#006d64] hover:bg-[#005851]"
                      }`}
                    >
                      <span>
                        {authMode === "signin"
                          ? `Sign In as ${
                              selectedRole === "admin"
                                ? "Department Admin"
                                : selectedRole === "courserep"
                                ? "Course Rep"
                                : "Scholar Student"
                            }`
                          : `Create ${
                              selectedRole === "admin"
                                ? "Admin"
                                : selectedRole === "courserep"
                                ? "Course Rep"
                                : "Scholar"
                            } Account`}
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                  )}

                  {/* Guest Explore link */}
                  <div className="pt-2 text-center border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={onExploreAsGuest}
                      className="text-xs text-neutral-500 hover:text-[#006d64] font-medium transition-colors"
                    >
                      Want to test drive first?{" "}
                      <span className="font-bold underline">Explore as Guest Scholar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accredited Courses Carousel / Showcase */}
        <section className="py-10 bg-white border-t border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Accredited Departmental Curriculum
                </h3>
                <p className="text-xs text-neutral-500">
                  First Semester HND 1 syllabus modules with instant flashcard decks and past papers
                </p>
              </div>
              <div className="text-xs text-neutral-400 font-medium">
                {COURSES.length} Active Courses Available
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {COURSES.slice(0, 6).map((c) => (
                <div
                  key={c.code}
                  className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#006d64]">
                      {c.code}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                      {c.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium pt-2 border-t border-neutral-200/60">
                    <span>{c.units || 3} Units</span>
                    <span className="text-emerald-600 font-semibold">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 py-8 bg-[#faf9f6] text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#006d64]">Lucid</span>
            <span>•</span>
            <span>Departmental Course Hub, Handwritten OCR & CBT Exam Simulation</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>© 2026 Lucid Academic Centre</span>
            <span>•</span>
            <button onClick={onExploreAsGuest} className="hover:text-neutral-800 transition-colors">
              Guest View
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
