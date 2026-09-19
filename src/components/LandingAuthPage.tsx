import React, { useState, useEffect } from "react";
import {
  UserProfile,
  UserRole,
  InstitutionType,
} from "../types";
import { DEMO_USERS } from "../data/mockData";
import {
  INSTITUTIONS,
  getLevelsForInstitutionType,
} from "../data/institutionsData";
import { authenticateWithFirebase, syncUserProfile, signInWithGoogle } from "../lib/firebase";
import {
  Sparkles,
  ArrowRight,
  Shield,
  GraduationCap,
  Megaphone,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sun,
  Moon,
  School,
  LogIn,
  UserPlus,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingAuthPageProps {
  onLogin: (user: UserProfile) => void;
  onExploreAsGuest: () => void;
  usersRoster?: UserProfile[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface AwakenQuote {
  id: string;
  quote: string;
  author: string;
  role: string;
  tag: string;
}

const AWAKEN_QUOTES: AwakenQuote[] = [
  {
    id: "sagan",
    quote: "We are a way for the cosmos to know itself. To study, wonder, and learn is matter waking up to its own existence.",
    author: "Carl Sagan",
    role: "Cosmologist & Astrophysicist",
    tag: "Origin of Mind",
  },
  {
    id: "jung",
    quote: "Until you make the unconscious conscious, it will direct your life and you will call it fate. Become lucid.",
    author: "Carl Jung",
    role: "Psychiatrist & Analytical Pioneer",
    tag: "The Lucid State",
  },
  {
    id: "galileo",
    quote: "Nature's great book is written in mathematical language. Doubting authority and testing reality is how the mind breaks free from darkness.",
    author: "Galileo Galilei",
    role: "Father of Observational Astronomy",
    tag: "Empirical Light",
  },
  {
    id: "aristotle",
    quote: "Knowing yourself is the beginning of all wisdom. Excellence is never an accident; it is the habit of deliberate awakening.",
    author: "Aristotle",
    role: "Polymath & Philosopher",
    tag: "Intellectual Rigor",
  },
  {
    id: "alhazen",
    quote: "The seeker after truth does not put trust in consensus, but subjects all dogma to proof, inquiry, and demonstration.",
    author: "Ibn al-Haytham (Alhazen)",
    role: "Pioneer of the Scientific Method",
    tag: "The Search for Truth",
  },
  {
    id: "da_vinci",
    quote: "Study without desire spoils the memory, and it retains nothing that it takes in. Awaken your curiosity, and knowledge lives forever.",
    author: "Leonardo da Vinci",
    role: "Renaissance Polymath & Artist",
    tag: "Eternal Curiosity",
  },
];

export function LandingAuthPage({
  onLogin,
  onExploreAsGuest,
  usersRoster = [],
  isDarkMode = false,
  onToggleDarkMode,
}: LandingAuthPageProps) {
  // Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);

  // Quotes slideshow state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);

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
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Available institutions for active type
  const availableInstitutions = INSTITUTIONS.filter((inst) => inst.type === institutionType);
  const currentInstitution = INSTITUTIONS.find((inst) => inst.id === selectedInstitutionId) || availableInstitutions[0];
  const availableDivisions = currentInstitution?.divisions || [];
  const currentDivision = availableDivisions.find((d) => d.name === facultyOrSchool) || availableDivisions[0];
  const availableDepartments = currentDivision?.departments || ["Computer Science"];
  const availableLevels = getLevelsForInstitutionType(institutionType);

  // Auto-advance slideshow quotes
  useEffect(() => {
    if (isSlideshowPaused) return;
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % AWAKEN_QUOTES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isSlideshowPaused]);

  // Dismiss modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen]);

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

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

  const activeQuote = AWAKEN_QUOTES[currentQuoteIndex];

  return (
    <div className="relative min-h-screen bg-[#faf9f6] dark:bg-[#070d18] text-neutral-900 dark:text-slate-100 flex flex-col selection:bg-teal-100 selection:text-[#006d64] transition-colors duration-200 overflow-x-hidden">
      {/* Landing Page Content: will blur smoothly when Auth Modal is open */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isAuthModalOpen ? "filter blur-md brightness-90 dark:brightness-60 pointer-events-none select-none" : ""
        }`}
      >
        {/* Top Minimalist Header */}
        <header className="border-b border-neutral-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#0e1627]/85 backdrop-blur-md sticky top-0 z-20 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#006d64] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                L
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#006d64] dark:text-teal-400">
                  Lucid
                </span>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase border border-purple-200/60 dark:border-purple-800/60">
                  BETA
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {onToggleDarkMode && (
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  aria-label="Toggle Theme"
                  className="w-11 h-6 rounded-full bg-neutral-200 dark:bg-slate-800 p-0.5 flex items-center transition-colors relative cursor-pointer border border-neutral-300 dark:border-slate-700"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 shadow-xs transform transition-transform flex items-center justify-center text-white text-[10px] ${
                      isDarkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    {isDarkMode ? <Moon size={10} /> : <Sun size={10} />}
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={onExploreAsGuest}
                className="hidden sm:inline-flex text-xs font-semibold text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                Explore as Guest
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="text-xs font-bold px-3.5 py-2 rounded-xl text-neutral-700 dark:text-slate-200 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800/80 border border-neutral-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-[#006d64] hover:bg-[#005851] text-white transition-all shadow-xs cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </header>

        {/* Central Awaken Showcase Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 max-w-4xl mx-auto w-full text-center">
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-800/60 text-xs font-bold text-[#006d64] dark:text-teal-300 mb-8 sm:mb-10 shadow-2xs">
            <Sparkles size={14} className="text-[#006d64] dark:text-teal-400" />
            <span>The Academic Consciousness & Mastery Space</span>
          </div>

          {/* Quotes Slideshow Container (Phasing In & Out) */}
          <div
            className="w-full relative min-h-[220px] sm:min-h-[200px] flex flex-col items-center justify-center"
            onMouseEnter={() => setIsSlideshowPaused(true)}
            onMouseLeave={() => setIsSlideshowPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuote.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-col items-center max-w-2xl px-2 sm:px-6"
              >
                {/* Quote Category Pill */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#006d64] dark:text-teal-400 mb-3">
                  <Quote size={12} className="rotate-180" />
                  <span>{activeQuote.tag}</span>
                </div>

                {/* Quote Text */}
                <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-neutral-800 dark:text-slate-100 leading-snug sm:leading-relaxed italic mb-4">
                  "{activeQuote.quote}"
                </blockquote>

                {/* Author Citation */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-slate-400">
                  <span className="font-bold text-neutral-800 dark:text-slate-200">{activeQuote.author}</span>
                  <span>•</span>
                  <span>{activeQuote.role}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Previous / Next Chevron Controls */}
            <button
              type="button"
              onClick={() =>
                setCurrentQuoteIndex((prev) => (prev === 0 ? AWAKEN_QUOTES.length - 1 : prev - 1))
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full text-neutral-400 dark:text-slate-500 hover:text-neutral-700 dark:hover:text-slate-200 hover:bg-neutral-200/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Previous Quote"
              aria-label="Previous Quote"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentQuoteIndex((prev) => (prev + 1) % AWAKEN_QUOTES.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full text-neutral-400 dark:text-slate-500 hover:text-neutral-700 dark:hover:text-slate-200 hover:bg-neutral-200/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Next Quote"
              aria-label="Next Quote"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slideshow Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-8">
            {AWAKEN_QUOTES.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQuoteIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentQuoteIndex
                    ? "w-7 bg-[#006d64] dark:bg-teal-400"
                    : "w-2 bg-neutral-300 dark:bg-slate-700 hover:bg-neutral-400 dark:hover:bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Cheeky Awakening Phrase */}
          <div className="mb-8 space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300 shadow-2xs">
              <Sparkles size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Log in or sign up to be lucid and awakened — or stay asleep.</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-slate-400">
              Active recall flashcards, authentic CBT exam simulations with German penalty scoring, and syllabus notes await.
            </p>
          </div>

          {/* Primary Action Buttons (Clicking blurs landing and opens login/signup modal) */}
          <div className="w-full max-w-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="w-full py-3 px-5 rounded-xl bg-[#006d64] hover:bg-[#005851] text-white font-bold text-sm shadow-md hover:shadow-teal-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <LogIn size={16} />
                <span>Sign In</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="w-full py-3 px-5 rounded-xl bg-white dark:bg-[#0f172a] hover:bg-neutral-50 dark:hover:bg-[#162035] text-neutral-800 dark:text-slate-100 font-bold text-sm border border-neutral-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <UserPlus size={16} className="text-[#006d64] dark:text-teal-400" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Quick Demo Logins & Guest links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-neutral-500 dark:text-slate-400 pt-2">
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="hover:text-[#006d64] dark:hover:text-teal-300 font-semibold underline decoration-dotted transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>⚡ 1-Click Cohort Quick Logins</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="hover:text-neutral-900 dark:hover:text-slate-200 font-semibold underline decoration-dotted transition-colors cursor-pointer"
              >
                Explore as Guest
              </button>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-neutral-200/80 dark:border-slate-800/80 py-6 px-4 text-center text-xs text-neutral-400 dark:text-slate-400">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>© 2026 Lucid Academic Centre • Centralized Academic Workspace</span>
            <span className="text-[11px]">
              FEDPONEK (Polytechnic ND/HND) & UNILAG (University 100L–500L) Curriculums Integrated
            </span>
          </div>
        </footer>
      </div>

      {/* Focused Auth Modal (Blurs the landing page when opened) */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAuthModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-xl my-6 bg-white dark:bg-[#0c1322] border border-neutral-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#006d64] to-[#004f49] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center font-black text-white text-base">
                  L
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight">Lucid Academic Access</h2>
                  <p className="text-xs text-teal-100/90">
                    {authMode === "signin"
                      ? "Sign in to enter your departmental cohort"
                      : "Create your student scholar account"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  title="Close (Esc)"
                  aria-label="Close modal"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Mode Switcher inside Modal: Sign In vs Create Account */}
            <div className="p-3 sm:p-4 bg-teal-900/10 dark:bg-slate-900/60 border-b border-neutral-200 dark:border-slate-800">
              <div className="grid grid-cols-2 p-1 rounded-xl bg-neutral-200/70 dark:bg-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === "signin"
                      ? "bg-white dark:bg-[#0e1627] text-[#006d64] dark:text-teal-300 shadow-xs"
                      : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200"
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
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === "signup"
                      ? "bg-white dark:bg-[#0e1627] text-[#006d64] dark:text-teal-300 shadow-xs"
                      : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Modal Body: Complete Auth Form */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Role Differentiation Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-700 dark:text-slate-300 uppercase tracking-wider">
                    Select Account Role
                  </label>
                  {authMode === "signup" && (
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                      <Lock size={10} />
                      Rep & Admin: Provisioned
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("student")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === "student"
                        ? "border-[#006d64] dark:border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-[#006d64]/20"
                        : "border-neutral-200 dark:border-slate-800 hover:border-neutral-300 dark:hover:border-slate-700 bg-neutral-50/50 dark:bg-[#0f172a]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        selectedRole === "student"
                          ? "bg-[#006d64] text-white"
                          : "bg-neutral-200 dark:bg-slate-700 text-neutral-600 dark:text-slate-300"
                      }`}
                    >
                      <GraduationCap size={15} />
                    </div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-slate-200">Scholar</span>
                    <span className="text-[10px] text-neutral-400 dark:text-slate-400">Open Register</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("courserep")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === "courserep"
                        ? "border-amber-500 dark:border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-500/20"
                        : "border-neutral-200 dark:border-slate-800 hover:border-neutral-300 dark:hover:border-slate-700 bg-neutral-50/50 dark:bg-[#0f172a]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        selectedRole === "courserep"
                          ? "bg-amber-600 text-white"
                          : "bg-neutral-200 dark:bg-slate-700 text-neutral-600 dark:text-slate-300"
                      }`}
                    >
                      <Megaphone size={14} />
                    </div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-slate-200">Course Rep</span>
                    <span className="text-[10px] text-neutral-400 dark:text-slate-400">Authorized</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === "admin"
                        ? "border-purple-600 dark:border-purple-400 bg-purple-50/60 dark:bg-purple-950/40 ring-2 ring-purple-600/20"
                        : "border-neutral-200 dark:border-slate-800 hover:border-neutral-300 dark:hover:border-slate-700 bg-neutral-50/50 dark:bg-[#0f172a]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        selectedRole === "admin"
                          ? "bg-purple-700 text-white"
                          : "bg-neutral-200 dark:bg-slate-700 text-neutral-600 dark:text-slate-300"
                      }`}
                    >
                      <Shield size={14} />
                    </div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-slate-200">Dept Admin</span>
                    <span className="text-[10px] text-neutral-400 dark:text-slate-400">Head of Dept</span>
                  </button>
                </div>
              </div>

              {/* Quick 1-Click Demo Login Banner */}
              <div className="p-3 rounded-2xl bg-neutral-50/90 dark:bg-[#0b1220] border border-neutral-200/90 dark:border-slate-800 flex flex-col gap-2.5 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                    <span>⚡ 1-Click Cohort & Role Test Logins</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-slate-400">Instant Access</span>
                </div>

                {/* Polytechnic Demos */}
                <div className="p-2 rounded-xl bg-white dark:bg-[#0f172a] border border-teal-200/70 dark:border-teal-900/40 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider">
                    <span className="flex items-center gap-1">🏛️ FEDPONEK (Polytechnic • ND/HND)</span>
                    <span className="text-[9px] font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded-sm">
                      SICT
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin("student", "polytechnic")}
                      className="py-1.5 px-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-[11px] font-bold text-[#006d64] dark:text-teal-300 transition-colors text-center truncate cursor-pointer"
                      title="FEDPONEK Student (HND 1)"
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin("courserep", "polytechnic")}
                      className="py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 text-[11px] font-bold text-amber-900 dark:text-amber-300 transition-colors text-center truncate shadow-2xs cursor-pointer"
                      title="FEDPONEK Course Rep (Note & Paper Uploads Authorized)"
                    >
                      📢 Course Rep ⭐
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin("admin", "polytechnic")}
                      className="py-1.5 px-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-800 dark:text-purple-300 transition-colors text-center truncate cursor-pointer"
                      title="FEDPONEK HOD Admin (Account Assignment)"
                    >
                      🛡️ HOD Admin
                    </button>
                  </div>
                </div>

                {/* University Demos */}
                <div className="p-2 rounded-xl bg-white dark:bg-[#0f172a] border border-blue-200/70 dark:border-blue-900/40 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                    <span className="flex items-center gap-1">🏛️ UNILAG (University • 100L–500L)</span>
                    <span className="text-[9px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-sm">
                      Sciences
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin("student", "university")}
                      className="py-1.5 px-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-800 dark:text-blue-300 transition-colors text-center truncate cursor-pointer"
                      title="UNILAG Student (300 Level Computer Sciences)"
                    >
                      🎓 Uni Student (300L)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin("courserep", "university")}
                      className="py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 text-[11px] font-bold text-amber-900 dark:text-amber-300 transition-colors text-center truncate shadow-2xs cursor-pointer"
                      title="UNILAG Course Rep (300L Class Rep - Uploads Authorized)"
                    >
                      📢 Uni Course Rep ⭐
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Institution & Level Segregation */}
                <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-[#0b1220] border border-neutral-200/80 dark:border-slate-800 space-y-2.5 transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <School size={14} className="text-[#006d64] dark:text-teal-400" />
                      <span>Institution & Level Segregation</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-slate-400">Curriculum Matching</span>
                  </div>

                  {/* Institution Type Selector */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-200/60 dark:bg-[#162032] rounded-xl border border-transparent dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleInstitutionTypeChange("polytechnic")}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        institutionType === "polytechnic"
                          ? "bg-white dark:bg-[#0e1627] text-teal-900 dark:text-teal-300 shadow-2xs border border-transparent dark:border-teal-500/30"
                          : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100"
                      }`}
                    >
                      🏛️ Polytechnic (ND / HND)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInstitutionTypeChange("university")}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        institutionType === "university"
                          ? "bg-white dark:bg-[#0e1627] text-blue-900 dark:text-blue-300 shadow-2xs border border-transparent dark:border-blue-500/30"
                          : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100"
                      }`}
                    >
                      🏛️ University (100L – 500L)
                    </button>
                  </div>

                  {/* Institution Dropdown */}
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-slate-300 mb-1">
                      {institutionType === "polytechnic" ? "Polytechnic" : "University"}
                    </label>
                    <select
                      value={selectedInstitutionId}
                      onChange={(e) => handleInstitutionChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 focus:border-[#006d64] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 dark:text-slate-100 outline-hidden transition-all bg-white dark:bg-[#0f172a]"
                    >
                      {availableInstitutions.map((inst) => (
                        <option key={inst.id} value={inst.id} className="bg-white dark:bg-[#0f172a] text-neutral-900 dark:text-slate-100">
                          {inst.name} ({inst.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Division & Department Cascading */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 dark:text-slate-300 mb-1">
                        {institutionType === "polytechnic" ? "School / Faculty" : "College / Faculty"}
                      </label>
                      <select
                        value={facultyOrSchool}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 focus:border-[#006d64] dark:focus:border-teal-400 text-xs text-neutral-900 dark:text-slate-100 outline-hidden bg-white dark:bg-[#0f172a] truncate"
                      >
                        {availableDivisions.map((div) => (
                          <option key={div.name} value={div.name} className="bg-white dark:bg-[#0f172a] text-neutral-900 dark:text-slate-100">
                            {div.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 dark:text-slate-300 mb-1">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 focus:border-[#006d64] dark:focus:border-teal-400 text-xs text-neutral-900 dark:text-slate-100 outline-hidden bg-white dark:bg-[#0f172a] truncate"
                      >
                        {availableDepartments.map((dept) => (
                          <option key={dept} value={dept} className="bg-white dark:bg-[#0f172a] text-neutral-900 dark:text-slate-100">
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Academic Level */}
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-slate-300 mb-1">
                      {institutionType === "polytechnic"
                        ? "Academic Level (Polytechnic ND / HND)"
                        : "Academic Level (University 100L – 500L)"}
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 focus:border-[#006d64] dark:focus:border-teal-400 text-xs text-neutral-900 dark:text-slate-100 outline-hidden bg-white dark:bg-[#0f172a]"
                    >
                      {availableLevels.map((lvl) => (
                        <option key={lvl.value} value={lvl.value} className="bg-white dark:bg-[#0f172a] text-neutral-900 dark:text-slate-100">
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name field (for Signup) */}
                {authMode === "signup" && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1.5">
                      Full Legal / Student Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="e.g. Chukwu Kingsley Emeka"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#006d64] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 dark:text-slate-100 outline-hidden transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Identifier: Matric No / Staff ID */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1.5">
                    {selectedRole === "admin"
                      ? "Staff Identity Code / Academic Portal ID"
                      : selectedRole === "courserep"
                      ? "Matriculation / Rep Authorization No"
                      : "Matriculation / Scholar Portal Number"}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder={
                        selectedRole === "admin"
                          ? "HOD/SICT/2022/01"
                          : selectedRole === "courserep"
                          ? institutionType === "polytechnic"
                            ? "FPN/HND/SWD/22/004"
                            : "210407082"
                          : institutionType === "polytechnic"
                          ? "FPN/HND/SWD/22/089"
                          : "210407045"
                      }
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#006d64] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 dark:text-slate-100 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300 mb-1.5">
                    Institutional or Personal Email *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      placeholder="student@fpno.edu.ng or user@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#006d64] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 dark:text-slate-100 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-slate-300">
                      Password (min 6 characters)
                    </label>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#006d64] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#006d64]/20 text-xs text-neutral-900 dark:text-slate-100 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {authError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                    {authError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
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
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[11px]">
                    <span className="bg-white dark:bg-[#0c1322] px-2 text-neutral-400 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] hover:bg-neutral-50 dark:hover:bg-[#162035] text-neutral-800 dark:text-slate-200 text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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

              {/* Guest Explore link */}
              <div className="pt-2 text-center border-t border-neutral-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    onExploreAsGuest();
                  }}
                  className="text-xs text-neutral-500 hover:text-[#006d64] dark:hover:text-teal-400 font-medium transition-colors cursor-pointer"
                >
                  Want to test drive first?{" "}
                  <span className="font-bold underline">Explore as Guest Scholar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
