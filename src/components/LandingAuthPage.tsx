import React, { useState } from "react";
import {
  UserProfile,
  UserRole,
  Course,
  InstitutionType,
} from "../types";
import { DEMO_USERS, COURSES } from "../data/mockData";
import {
  INSTITUTIONS,
  POLYTECHNIC_LEVELS,
  UNIVERSITY_LEVELS,
  getLevelsForInstitutionType,
} from "../data/institutionsData";
import { authenticateWithFirebase, syncUserProfile, signInWithGoogle } from "../lib/firebase";
import { ConsciousnessOdysseySection } from "./ConsciousnessOdysseySection";
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
  School,
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

  // Institution & Cohort Segregation States
  const [institutionType, setInstitutionType] = useState<InstitutionType>("polytechnic");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("FEDPONEK");
  const [facultyOrSchool, setFacultyOrSchool] = useState("School of Information & Communication Technology (SICT)");
  const [department, setDepartment] = useState("Software & Web Development");
  const [level, setLevel] = useState("HND 1");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState(""); // Matric No or Staff ID
  const [password, setPassword] = useState("");
  const [repCourse, setRepCourse] = useState("SWD 311 (Operating System)");
  const [adminStaffTitle, setAdminStaffTitle] = useState("Head of Department & Academic Coordinator");
  const [authError, setAuthError] = useState<string | null>(null);

  // Available institutions for active type
  const availableInstitutions = INSTITUTIONS.filter((inst) => inst.type === institutionType);
  const currentInstitution = INSTITUTIONS.find((inst) => inst.id === selectedInstitutionId) || availableInstitutions[0];
  const availableDivisions = currentInstitution?.divisions || [];
  const currentDivision = availableDivisions.find((d) => d.name === facultyOrSchool) || availableDivisions[0];
  const availableDepartments = currentDivision?.departments || ["Computer Science"];
  const availableLevels = getLevelsForInstitutionType(institutionType);

  // Handle switching institution type
  const handleInstitutionTypeChange = (newType: InstitutionType) => {
    setInstitutionType(newType);
    const firstInst = INSTITUTIONS.find((i) => i.type === newType);
    if (firstInst) {
      setSelectedInstitutionId(firstInst.id);
      const firstDiv = firstInst.divisions[0];
      setFacultyOrSchool(firstDiv ? firstDiv.name : "");
      setDepartment(firstDiv?.departments[0] || "");
      setLevel(newType === "polytechnic" ? "HND 1" : "300 Level");
    }
  };

  // Handle switching institution
  const handleInstitutionChange = (instId: string) => {
    setSelectedInstitutionId(instId);
    const inst = INSTITUTIONS.find((i) => i.id === instId);
    if (inst) {
      const firstDiv = inst.divisions[0];
      setFacultyOrSchool(firstDiv ? firstDiv.name : "");
      setDepartment(firstDiv?.departments[0] || "");
      setLevel(inst.type === "polytechnic" ? "HND 1" : "300 Level");
    }
  };

  // Handle switching division / school / faculty
  const handleDivisionChange = (divName: string) => {
    setFacultyOrSchool(divName);
    const div = availableDivisions.find((d) => d.name === divName);
    if (div && div.departments.length > 0) {
      setDepartment(div.departments[0]);
    }
  };

  // Handle Quick Demo Login for instant role testing across both structures
  const handleQuickDemoLogin = (role: UserRole, type: InstitutionType = "polytechnic") => {
    if (type === "university") {
      if (role === "courserep") {
        onLogin(DEMO_USERS.uni_courserep);
      } else {
        onLogin(DEMO_USERS.uni_student);
      }
    } else {
      const demo = DEMO_USERS[role];
      onLogin(demo);
    }
  };

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);
    try {
      const authResult = await signInWithGoogle();
      if (!authResult) {
        setIsGoogleLoading(false);
        return;
      }

      const { firebaseUser, profileDraft, isExisting } = authResult;

      if (isExisting && profileDraft && profileDraft.id) {
        const fullProfile = profileDraft as UserProfile;
        syncUserProfile({ ...fullProfile, isLoggedIn: true });
        onLogin({ ...fullProfile, isLoggedIn: true });
        return;
      }

      // Check if user already exists in usersRoster
      const existing = usersRoster.find(
        (u) => u.email.toLowerCase() === (firebaseUser.email || "").toLowerCase()
      );

      if (existing) {
        const updated = { ...existing, isLoggedIn: true };
        syncUserProfile(updated);
        onLogin(updated);
        return;
      }

      // Build authenticated profile with Google metadata
      const displayName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Scholar";
      const initials = displayName
        .split(" ")
        .map((p: string) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "SC";

      const newUser: UserProfile = {
        id: firebaseUser.uid || `usr-g-${Date.now()}`,
        name: displayName,
        matricNo: (institutionType === "polytechnic" ? "SWD/2024/" : "220407") + Math.floor(100 + Math.random() * 899),
        email: firebaseUser.email || `${firebaseUser.uid}@gmail.com`,
        institutionType,
        institutionId: selectedInstitutionId,
        institutionName: currentInstitution?.name || "Academic Institution",
        facultyOrSchool,
        department,
        level,
        avatarInitials: initials,
        isLoggedIn: true,
        role: "student",
      };

      syncUserProfile(newUser);
      onLogin(newUser);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setAuthError(err?.message || "Failed to sign in with Google account. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      if (authMode === "signin") {
        const targetEmail = email.trim().toLowerCase();
        const targetId = identifier.trim().toLowerCase();

        // If credentials provided, attempt Firebase Auth authentication
        if (targetEmail && password.length >= 6) {
          try {
            await authenticateWithFirebase(targetEmail, password);
          } catch (fbErr) {
            console.warn("Firebase Auth sign-in warning:", fbErr);
          }
        }

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
          const demo = institutionType === "university"
            ? (selectedRole === "courserep" ? DEMO_USERS.uni_courserep : DEMO_USERS.uni_student)
            : DEMO_USERS[selectedRole];

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
          const authenticatedUser = { ...matchedUser, isLoggedIn: true };
          syncUserProfile(authenticatedUser);
          onLogin(authenticatedUser);
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
          matricNo: identifier || (institutionType === "polytechnic" ? "SWD/2023/1042" : "210407082"),
          email: email || "scholar@lucid.edu",
          institutionType,
          institutionId: selectedInstitutionId,
          institutionName: currentInstitution?.name || "Federal Polytechnic Nekede, Owerri",
          facultyOrSchool,
          department,
          level,
          avatarInitials: "SC",
          isLoggedIn: true,
          role: "student",
        };
        syncUserProfile(generatedUser);
        onLogin(generatedUser);
      } else {
        // Sign Up validation: Strict role check
        if (selectedRole !== "student") {
          setAuthError(
            "Course Representative and Administrator accounts cannot be self-registered. They must be officially assigned and provisioned by the Department Administrator to maintain syllabus material authorization."
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

        if (password.length >= 6) {
          try {
            await authenticateWithFirebase(email.trim(), password);
          } catch (fbErr) {
            console.warn("Firebase Auth registration warning:", fbErr);
          }
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
          matricNo: identifier.trim() || (institutionType === "polytechnic" ? "SWD/2024/001" : "220407001"),
          email: email.trim(),
          institutionType,
          institutionId: selectedInstitutionId,
          institutionName: currentInstitution?.name || "Academic Institution",
          facultyOrSchool,
          department,
          level,
          avatarInitials: initials,
          isLoggedIn: true,
          role: "student",
        };

        syncUserProfile(newUser);
        onLogin(newUser);
      }
    } finally {
      setIsAuthenticating(false);
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
            <button
              onClick={() => document.getElementById('consciousness-odyssey')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-850 px-3 py-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
              <span>Awakening Odyssey</span>
            </button>

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

                  {/* Quick 1-Click Demo Login Banner with Polytechnic vs University separation */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
                        <span>⚡ 1-Click Cohort & Role Test Logins</span>
                      </span>
                      <span className="text-[10px] text-neutral-400">Instant Access</span>
                    </div>

                    {/* Polytechnic (ND/HND) Demos */}
                    <div className="p-2 rounded-xl bg-white border border-teal-200/70 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-teal-900 uppercase tracking-wider">
                        <span className="flex items-center gap-1">🏛️ FEDPONEK (Polytechnic • ND/HND)</span>
                        <span className="text-[9px] font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-sm">SICT Dept</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin("student", "polytechnic")}
                          className="py-1.5 px-2 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold text-[#006d64] transition-colors text-center truncate"
                          title="FEDPONEK Student (HND 1)"
                        >
                          🎓 Student
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin("courserep", "polytechnic")}
                          className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-amber-900 transition-colors text-center truncate shadow-2xs"
                          title="FEDPONEK Course Rep (Note & Paper Uploads Authorized)"
                        >
                          📢 Course Rep ⭐
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin("admin", "polytechnic")}
                          className="py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[11px] font-bold text-purple-800 transition-colors text-center truncate"
                          title="FEDPONEK HOD Admin (Account Assignment)"
                        >
                          🛡️ HOD Admin
                        </button>
                      </div>
                    </div>

                    {/* University (100L-500L) Demos */}
                    <div className="p-2 rounded-xl bg-white border border-blue-200/70 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                        <span className="flex items-center gap-1">🏛️ UNILAG (University • 100L–500L)</span>
                        <span className="text-[9px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm">Faculty of Science</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin("student", "university")}
                          className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold text-blue-800 transition-colors text-center truncate"
                          title="UNILAG Student (300 Level Computer Sciences)"
                        >
                          🎓 Uni Student (300L)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin("courserep", "university")}
                          className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-amber-900 transition-colors text-center truncate shadow-2xs"
                          title="UNILAG Course Rep (300L Class Rep - Uploads Authorized)"
                        >
                          📢 Uni Course Rep ⭐
                        </button>
                      </div>
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
                    {/* Institution Segregation Selector (Type & School/Polytechnic) */}
                    <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span className="flex items-center gap-1.5">
                          <School size={14} className="text-[#006d64]" />
                          <span>Institution & Level Segregation</span>
                        </span>
                        <span className="text-[10px] text-neutral-400">Strict Curriculum Matching</span>
                      </div>

                      {/* Institution Type Selector */}
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-200/60 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleInstitutionTypeChange("polytechnic")}
                          className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                            institutionType === "polytechnic"
                              ? "bg-white text-teal-900 shadow-2xs"
                              : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          🏛️ Polytechnic (ND / HND)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInstitutionTypeChange("university")}
                          className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                            institutionType === "university"
                              ? "bg-white text-blue-900 shadow-2xs"
                              : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          🏛️ University (100L – 500L)
                        </button>
                      </div>

                      {/* Institution Dropdown */}
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                          {institutionType === "polytechnic" ? "Polytechnic" : "University"}
                        </label>
                        <select
                          value={selectedInstitutionId}
                          onChange={(e) => handleInstitutionChange(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#006d64] focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 outline-hidden transition-all bg-white"
                        >
                          {availableInstitutions.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.name} ({inst.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Division & Department Cascading */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            {institutionType === "polytechnic" ? "School / Faculty" : "College / Faculty"}
                          </label>
                          <select
                            value={facultyOrSchool}
                            onChange={(e) => handleDivisionChange(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 focus:border-[#006d64] text-xs text-neutral-900 outline-hidden bg-white truncate"
                          >
                            {availableDivisions.map((div) => (
                              <option key={div.name} value={div.name}>
                                {div.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Department
                          </label>
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 focus:border-[#006d64] text-xs text-neutral-900 outline-hidden bg-white truncate"
                          >
                            {availableDepartments.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Academic Level strictly matching type */}
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                          {institutionType === "polytechnic"
                            ? "Academic Level (Polytechnic ND / HND)"
                            : "Academic Level (University 100L – 500L)"}
                        </label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#006d64] text-xs text-neutral-900 outline-hidden bg-white"
                        >
                          {availableLevels.map((lvl) => (
                            <option key={lvl.value} value={lvl.value}>
                              {lvl.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

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
                              ? (institutionType === "polytechnic" ? "SWD/2023/0018" : "210407015")
                              : (institutionType === "polytechnic" ? "SWD/2023/1042" : "210407082")
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
                      disabled={isAuthenticating}
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

                    {/* Google Authentication Divider & Button */}
                    <div className="relative my-2.5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200 dark:border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center text-[11px]">
                        <span className="bg-white dark:bg-[#0e1627] px-2 text-neutral-400 font-medium">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-800 text-neutral-800 dark:text-slate-200 text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.18 0 9.98 0 12s.45 3.82 1.24 5.41l4.04-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.94 6.72-4.94z"/>
                      </svg>
                      <span>
                        {isGoogleLoading
                          ? "Connecting Google Account..."
                          : `${authMode === "signup" ? "Sign Up" : "Sign In"} with Google`}
                      </span>
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

        {/* The Awakening of Human Consciousness, Science, Art & History Odyssey */}
        <div id="consciousness-odyssey" className="bg-[#fcfbf9] dark:bg-[#0d1322] border-t border-neutral-200/80 dark:border-slate-800">
          <ConsciousnessOdysseySection />
        </div>

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
