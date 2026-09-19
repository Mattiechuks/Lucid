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
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingAuthPageProps {
  onLogin: (user: UserProfile) => void;
  onExploreAsGuest: () => void;
  usersRoster?: UserProfile[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface SlideItem {
  quote: string;
  author: string;
  role: string;
  theme: string;
  image: string;
}

const STITCH_SLIDES: SlideItem[] = [
  {
    quote: "Nature’s great book is written in mathematical language. Doubting authority and testing reality is how the mind breaks free from darkness.",
    author: "Galileo Galilei",
    role: "Father of Observational Astronomy",
    theme: "🏛️ Classical Astronomy & Inquest",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1XSVOvpwElVkwZAVg4zV-NietCAzp2ZwoC8ZhQ12_pwm4tDSat6bu6zP2QNgo0nAdJVlxYi9KJ8TQzfOGylDPywPTKAjzxZyjyaUoUbmo76EDLzFvkQFvLB7v55ct2dDQoRtyKIKKVULWF4k0RavXNbEB_XrgwD5q0Odm1DDhWmiRnSYhZkrk1t0aDYSDYP1bUF3ugnuSjzxwyyz8tQiEkDz9MjFuKTRPSQih1huy1CF1jUduQoc_Od3C9W",
  },
  {
    quote: "Wisdom begins when curiosity overcomes fear. Master the principles, and the complex resolves into clarity.",
    author: "Athena & Classical Dialectic",
    role: "Patroness of Discernment & Strategy",
    theme: "🏛️ Dialectic Illumination",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1WB1oS3laMSY4ErkXuuGEZYrMMA8X6PX2M0kdvPeqOHVTn54ba7n6mJIQGo4Cu1MFZfoi1DY9OTclQ7ynuOOXWyZHC_rMpnov5iDxffU-lXI9MxHByGFBR8B3DTd8baOzOc5altRhcW6fPwgpbpl3Zw4L5Z3DPOAcpgRCL9BWRj6g2xCuLuj5nzDJQt8vYyL2WIpKNTTUqbiUcn_dwPJE5szU7m_DW5JnDSxT3s0VNN-WNGKoJd6cByjLxS",
  },
  {
    quote: "Education is the kindling of a flame, not the filling of a vessel. To understand first principles is to awaken your true potential.",
    author: "Socrates",
    role: "Architect of Dialectic Inquest",
    theme: "🏛️ The Socratic Agora",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC56i8OUGc2GGDHDhrIdK55QensTAolD3VTT8UknscYcEdvKPWZe-49iIa8P8YMjjhc4CwU1I66K3hmKj33TrLz2PZJ0fgS-tB-MNGo5IgIUlzcDlLAgyNP244vkn1nE2S1lM79lCAWtkNPX6LU2KS3ltihNsuuJLPoxbQYSCjHpMEovyNtth_RWigETFk16sfSOun--lK1WV3pal7JyNZQ3FFgoLlKJPisqtrOkYbz3ZbR44iFqYe8iw",
  },
  {
    quote: "We are what we repeatedly do. Excellence, therefore, is not an act, but an enduring habit of deliberate practice.",
    author: "Aristotle",
    role: "Systematic Polymath & Peripatetic Founder",
    theme: "🏛️ Deliberate Mastery",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFDles7-xv_WMpLo8A3z9ls6HBXBj5Xz1_xVZMEMK5PDVkxu8WPb5wnwD2uWln8jNvR8F8fqUDYuY0XG4xaf1mOtnuxxUkwcUpJSK9VM_RcX5zexSOaaPVS1aQaiztsh7eyHkPevnbqLiQH4Up2mJUIxjnpN0tCFcH4hpdOMHHW557eXOAPrqw89cSY2ID5Z8UGz8NKn7PWUgtMSN6j6WI2X258D2k76ddT05FpyKEAprHnva_KQ1N1A",
  },
  {
    quote: "Reserve your right to think, for even to think wrongly is better than not to think at all.",
    author: "Hypatia of Alexandria",
    role: "Mathematician, Astronomer & Neoplatonist",
    theme: "🏛️ Independent Reason",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1Wpf3ep8jsb8TYGwy8kel6Qkvbfe-cJG4nM8IQAn1g4KjjEgomXY8HhCuh0B7kn58RgU_Dq7_SwVniPblZTddSGt9k9nU0pokIHBNzB7n5sEg7yKgP1ndHYLwOtD1LOXbScfYjyhj7fSaGQH7pRLzKT7ar_OWb1ak0L-GdqJEUvxEEpkfnwgjB8Zj2k7lrhGCEDz5OnjkSJ5TOPPntqleuCn7RA_AK-JaJ0J8rg1YeqaaiHeAauKBTxMxmo",
  },
  {
    quote: "Study without desire spoils the memory, and it retains nothing that it takes in. Learn with relentless passion.",
    author: "Leonardo da Vinci",
    role: "High Renaissance Polymath & Anatomist",
    theme: "🏛️ Relentless Curiosity",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1XSVOvpwElVkwZAVg4zV-NietCAzp2ZwoC8ZhQ12_pwm4tDSat6bu6zP2QNgo0nAdJVlxYi9KJ8TQzfOGylDPywPTKAjzxZyjyaUoUbmo76EDLzFvkQFvLB7v55ct2dDQoRtyKIKKVULWF4k0RavXNbEB_XrgwD5q0Odm1DDhWmiRnSYhZkrk1t0aDYSDYP1bUF3ugnuSjzxwyyz8tQiEkDz9MjFuKTRPSQih1huy1CF1jUduQoc_Od3C9W",
  },
  {
    quote: "The soul becomes dyed with the color of its thoughts. Train your intellect to perceive truth with composure.",
    author: "Marcus Aurelius",
    role: "Philosopher-Emperor & Stoic Master",
    theme: "🏛️ Stoic Intellect",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC56i8OUGc2GGDHDhrIdK55QensTAolD3VTT8UknscYcEdvKPWZe-49iIa8P8YMjjhc4CwU1I66K3hmKj33TrLz2PZJ0fgS-tB-MNGo5IgIUlzcDlLAgyNP244vkn1nE2S1lM79lCAWtkNPX6LU2KS3ltihNsuuJLPoxbQYSCjHpMEovyNtth_RWigETFk16sfSOun--lK1WV3pal7JyNZQ3FFgoLlKJPisqtrOkYbz3ZbR44iFqYe8iw",
  },
  {
    quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    role: "Pioneering Physicist & Nobel Polymath",
    theme: "🏛️ Fearless Inquiry",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1WB1oS3laMSY4ErkXuuGEZYrMMA8X6PX2M0kdvPeqOHVTn54ba7n6mJIQGo4Cu1MFZfoi1DY9OTclQ7ynuOOXWyZHC_rMpnov5iDxffU-lXI9MxHByGFBR8B3DTd8baOzOc5altRhcW6fPwgpbpl3Zw4L5Z3DPOAcpgRCL9BWRj6g2xCuLuj5nzDJQt8vYyL2WIpKNTTUqbiUcn_dwPJE5szU7m_DW5JnDSxT3s0VNN-WNGKoJd6cByjLxS",
  },
  {
    quote: "Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.",
    author: "Isaac Newton",
    role: "Formulator of Universal Natural Laws",
    theme: "🏛️ Elegant Simplicity",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFDles7-xv_WMpLo8A3z9ls6HBXBj5Xz1_xVZMEMK5PDVkxu8WPb5wnwD2uWln8jNvR8F8fqUDYuY0XG4xaf1mOtnuxxUkwcUpJSK9VM_RcX5zexSOaaPVS1aQaiztsh7eyHkPevnbqLiQH4Up2mJUIxjnpN0tCFcH4hpdOMHHW557eXOAPrqw89cSY2ID5Z8UGz8NKn7PWUgtMSN6j6WI2X258D2k76ddT05FpyKEAprHnva_KQ1N1A",
  },
  {
    quote: "Music is the pleasure the human mind experiences from counting without being aware that it is counting. Every science is harmony.",
    author: "Gottfried Wilhelm Leibniz",
    role: "Universal Polymath & Calculus Co-Inventor",
    theme: "🏛️ Harmonic Science",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1Wpf3ep8jsb8TYGwy8kel6Qkvbfe-cJG4nM8IQAn1g4KjjEgomXY8HhCuh0B7kn58RgU_Dq7_SwVniPblZTddSGt9k9nU0pokIHBNzB7n5sEg7yKgP1ndHYLwOtD1LOXbScfYjyhj7fSaGQH7pRLzKT7ar_OWb1ak0L-GdqJEUvxEEpkfnwgjB8Zj2k7lrhGCEDz5OnjkSJ5TOPPntqleuCn7RA_AK-JaJ0J8rg1YeqaaiHeAauKBTxMxmo",
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Institution & Cohort Segregation States
  const [institutionType, setInstitutionType] = useState<InstitutionType>("polytechnic");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("FEDPONEK");
  const [facultyOrSchool, setFacultyOrSchool] = useState("School of Information & Communication Technology (SICT)");
  const [department, setDepartment] = useState("Software & Web Development");
  const [level, setLevel] = useState("HND 1");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Institutions mapping
  const availableInstitutions = INSTITUTIONS.filter((inst) => inst.type === institutionType);
  const currentInstitution = INSTITUTIONS.find((inst) => inst.id === selectedInstitutionId) || availableInstitutions[0];
  const availableDivisions = currentInstitution?.divisions || [];
  const currentDivision = availableDivisions.find((d) => d.name === facultyOrSchool) || availableDivisions[0];
  const availableDepartments = currentDivision?.departments || ["Computer Science"];
  const availableLevels = getLevelsForInstitutionType(institutionType);

  // Slideshow auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STITCH_SLIDES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [isPaused]);

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

  const handleDivisionChange = (divName: string) => {
    setFacultyOrSchool(divName);
    const div = availableDivisions.find((d) => d.name === divName);
    if (div && div.departments.length > 0) {
      setDepartment(div.departments[0]);
    }
  };

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

      const existing = usersRoster.find(
        (u) => u.email.toLowerCase() === (firebaseUser.email || "").toLowerCase()
      );

      if (existing) {
        const updated = { ...existing, isLoggedIn: true };
        syncUserProfile(updated);
        onLogin(updated);
        return;
      }

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

        if (targetEmail && password.length >= 6) {
          try {
            await authenticateWithFirebase(targetEmail, password);
          } catch (fbErr) {
            console.warn("Firebase Auth sign-in warning:", fbErr);
          }
        }

        const pool = [...usersRoster, ...Object.values(DEMO_USERS)];
        let matchedUser = pool.find(
          (u) =>
            u.role === selectedRole &&
            ((targetEmail && u.email.toLowerCase() === targetEmail) ||
              (targetId && u.matricNo.toLowerCase() === targetId))
        );

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

        if (selectedRole !== "student") {
          setAuthError(
            `No registered ${
              selectedRole === "admin" ? "Department Administrator" : "Course Representative"
            } found matching "${identifier || email}". Per academic policy, this account must first be provisioned by an Administrator.`
          );
          return;
        }

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
        if (selectedRole !== "student") {
          setAuthError(
            "Course Representative and Administrator accounts cannot be self-registered. They must be officially provisioned by the Department Administrator to maintain syllabus material authorization."
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

  const currentSlide = STITCH_SLIDES[currentIndex];
  const formattedCounter = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;

  return (
    <div className="bg-[#f7f9fb] dark:bg-[#070d18] text-[#0f172a] dark:text-slate-100 font-sans min-h-screen relative overflow-x-hidden antialiased selection:bg-[#ccfbf1] selection:text-[#134e4a] transition-colors duration-200">
      {/* Subtle Architectural Canvas Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 greek-meander-pattern opacity-40 dark:opacity-20"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/80 via-transparent to-[#f7f9fb]/90 dark:from-[#070d18]/90 dark:via-transparent dark:to-[#070d18]/95"></div>

      {/* Main Viewport Wrapper: blurs when Auth Modal is open */}
      <div
        className={`relative z-10 flex flex-col min-h-screen transition-all duration-300 ${
          isAuthModalOpen ? "filter blur-md brightness-90 dark:brightness-60 pointer-events-none select-none" : ""
        }`}
      >
        {/* TopNavigation (Academic Modernism - Clean White & High Contrast) */}
        <header className="w-full bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Left: Monogram & Brand Logo */}
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#115e59] shadow-md shadow-teal-700/20 text-white">
                <span className="font-display font-black text-xl tracking-wider">L</span>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-300 ring-2 ring-white dark:ring-[#0c1322]"></div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-display tracking-[0.18em] text-2xl font-bold text-[#0f172a] dark:text-slate-100">
                  LUCID
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] tracking-widest font-bold uppercase bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300">
                  BETA
                </span>
              </div>
            </div>

            {/* Center: Sacred Space Status (Desktop) */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 text-xs font-serif tracking-widest text-[#475569] dark:text-slate-400 uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0d9488] dark:bg-teal-400 animate-pulse"></span>
              Sanctuary of Cognitive Illumination
            </div>

            {/* Right: Action Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Dialectic Theme Switcher */}
              {onToggleDarkMode && (
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  aria-label="Toggle theme aesthetics"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#162035] hover:border-slate-300 dark:hover:border-slate-600 transition-colors text-[#334155] dark:text-slate-300 flex items-center justify-center shadow-xs cursor-pointer"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
              )}

              {/* Explore As Guest Link */}
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="hidden md:inline-flex text-xs font-semibold tracking-wide uppercase px-3.5 py-2 text-[#475569] dark:text-slate-400 hover:text-[#0f766e] dark:hover:text-teal-300 transition-colors duration-150 cursor-pointer"
              >
                Explore as Guest
              </button>

              {/* Log In Button (Opens Auth Modal in Sign In mode) */}
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg text-[#1e293b] dark:text-slate-200 hover:text-[#0f172a] dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#162035] transition-all duration-150 shadow-xs cursor-pointer"
              >
                Log In
              </button>

              {/* Primary CTA Button (Opens Auth Modal in Sign Up mode) */}
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="px-4 sm:px-5 py-2 text-xs uppercase tracking-wider font-bold rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-xs shadow-teal-700/30 transition-all duration-150 transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started Free</span>
              </button>
            </div>
          </div>
        </header>

        {/* Grand Expansive Hero Section with Faded Classical Background & 10 Epigraphs */}
        <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 lg:py-20 relative overflow-hidden">
          {/* Seamless Faded Classical Artwork Backdrop */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#f7f9fb] dark:from-[#070d18] via-transparent to-[#f7f9fb] dark:to-[#070d18] z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9fb] dark:from-[#070d18] via-transparent to-[#f7f9fb] dark:to-[#070d18] z-10"></div>
            <div className="w-full h-full max-w-7xl max-h-[820px] mx-auto hero-bg-fade opacity-[0.22] dark:opacity-[0.14] transition-opacity duration-700 flex items-center justify-center">
              <img
                alt="Classical sculpture backdrop"
                src={currentSlide.image}
                className="w-full h-full object-cover object-center filter grayscale-[30%] contrast-[108%] brightness-[102%] slide-fade"
              />
            </div>
          </div>

          <div
            className="max-w-5xl w-full mx-auto flex flex-col items-center relative z-20 text-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Pill Badge: Consciousness Domain */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50/90 dark:bg-teal-950/60 backdrop-blur-sm text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold tracking-wide mb-5 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#0d9488] dark:text-teal-400" />
              <span>The Academic Consciousness &amp; Mastery Space</span>
            </div>

            {/* Section Epigraph Subtitle */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 sm:w-16 bg-slate-300 dark:bg-slate-700"></div>
              <span className="font-display text-xs sm:text-sm tracking-[0.28em] font-bold text-teal-700 dark:text-teal-300 uppercase flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#c59b27] inline" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path>
                </svg>
                Empirical Dialectic &amp; Classical Wisdom
              </span>
              <div className="h-px w-10 sm:w-16 bg-slate-300 dark:bg-slate-700"></div>
            </div>

            {/* Grand Intellectual Epigraph Carousel Area (Open & Borderless, breathing into canvas) */}
            <div className="w-full py-6 sm:py-10 px-4 sm:px-8 relative flex flex-col items-center">
              {/* Carousel Tag & Counter */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-white/90 dark:bg-[#0c1322]/90 border border-slate-200/90 dark:border-slate-800 text-teal-800 dark:text-teal-300 shadow-xs backdrop-blur-md">
                  {currentSlide.theme}
                </span>
                <span className="text-xs font-mono font-bold text-[#64748b] dark:text-slate-400 bg-white/80 dark:bg-[#0f172a]/80 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-800 shadow-xs">
                  {formattedCounter} / 10
                </span>
              </div>

              {/* Main Expansive Quote */}
              <div className="min-h-[140px] sm:min-h-[170px] lg:min-h-[190px] flex items-center justify-center max-w-4xl px-2">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight sm:leading-snug lg:leading-snug text-[#0f172a] dark:text-slate-100 select-none font-medium"
                  >
                    “{currentSlide.quote}”
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              {/* Author Attribution */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`meta-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2.5 text-base sm:text-lg"
                >
                  <cite className="not-italic font-display font-bold text-teal-800 dark:text-teal-300 tracking-wide text-lg sm:text-xl">
                    {currentSlide.author}
                  </cite>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[#475569] dark:text-slate-400 font-serif italic text-base sm:text-lg">
                    {currentSlide.role}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Navigation: 10 Dots & Chevrons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-xl">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev - 1 + STITCH_SLIDES.length) % STITCH_SLIDES.length)
                  }
                  aria-label="Previous quote"
                  className="w-10 h-10 rounded-full border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-[#0f172a]/90 hover:bg-white dark:hover:bg-[#162035] text-[#334155] dark:text-slate-200 hover:text-[#0d9488] dark:hover:text-teal-300 hover:border-teal-500 transition-all focus:outline-hidden shadow-xs flex items-center justify-center transform hover:scale-105 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* 10 Indicator Dots / Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full bg-white/85 dark:bg-[#0f172a]/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs">
                  {STITCH_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`carousel-dot h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? "bg-[#0d9488] dark:bg-teal-400 w-7"
                          : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 w-2.5"
                      }`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % STITCH_SLIDES.length)}
                  aria-label="Next quote"
                  className="w-10 h-10 rounded-full border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-[#0f172a]/90 hover:bg-white dark:hover:bg-[#162035] text-[#334155] dark:text-slate-200 hover:text-[#0d9488] dark:hover:text-teal-300 hover:border-teal-500 transition-all focus:outline-hidden shadow-xs flex items-center justify-center transform hover:scale-105 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Awakening Prompt & Callout Box */}
            <div className="w-full max-w-2xl px-6 py-3.5 rounded-2xl bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 mt-2 mb-6 shadow-xs flex items-center justify-center text-center">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#334155] dark:text-slate-300">
                <span className="text-[#c59b27] text-base">⚡</span>
                <span>
                  Log in or sign up to be lucid and awakened —{" "}
                  <span className="italic text-[#64748b] dark:text-slate-400 font-serif">
                    or stay asleep in uncalibrated assumption.
                  </span>
                </span>
              </div>
            </div>

            {/* Microcopy Features Line */}
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 max-w-xl text-center mb-8 leading-relaxed font-normal">
              Active recall flashcards, authentic CBT exam simulations with German penalty scoring, and syllabus mastery notes await.
            </p>

            {/* Primary Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
              {/* Start Studying Free / Sign In (Triggers Modal in Sign Up mode) */}
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="w-full sm:w-auto min-w-[190px] px-8 py-3.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-md shadow-teal-700/25 transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer active:scale-[0.99]"
              >
                <span>Start Studying Free</span>
                <span className="text-teal-200 font-bold">→</span>
              </button>

              {/* Explore Demo Exam / Clean elevated button */}
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="w-full sm:w-auto min-w-[190px] px-8 py-3.5 rounded-xl bg-white/90 dark:bg-[#0f172a]/90 hover:bg-white dark:hover:bg-[#162035] text-[#1e293b] dark:text-slate-200 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-150 shadow-xs transform hover:-translate-y-0.5 backdrop-blur-sm cursor-pointer active:scale-[0.99]"
              >
                <svg className="w-4 h-4 text-[#0d9488] dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                </svg>
                <span>Explore Demo Exam</span>
              </button>
            </div>

            {/* Quick Links & Uplifting Cohort Stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#64748b] dark:text-slate-400 font-medium">
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors font-semibold cursor-pointer underline decoration-dotted"
              >
                <span>⚡ 1-Click Cohort Quick Logins</span>
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="hover:text-[#0f172a] dark:hover:text-white transition-colors cursor-pointer"
              >
                Explore as Guest Mode
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 text-[#475569] dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                1,420+ Polymath Scholars Active
              </span>
            </div>
          </div>
        </main>

        {/* PolymathPillars (Clean Academic Modernism Cards) */}
        <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
          {/* Section Divider */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700"></div>
            <div className="w-2 h-2 rotate-45 border border-teal-500 bg-teal-50 dark:bg-teal-950/60"></div>
            <span className="font-display tracking-[0.25em] text-xs uppercase font-bold text-[#334155] dark:text-slate-300">
              Pillars of Awakening
            </span>
            <div className="w-2 h-2 rotate-45 border border-teal-500 bg-teal-50 dark:bg-teal-950/60"></div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700"></div>
          </div>

          {/* 3 Academic Modernism Discipline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Polymath Synthesis */}
            <article
              onClick={() => openAuthModal("signup")}
              className="bg-white dark:bg-[#0c1322] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-teal-100 dark:border-teal-900 shadow-xs">
                    <img
                      alt="Classical marble relief emblem of polymath philosopher"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida/AEtjO1XSVOvpwElVkwZAVg4zV-NietCAzp2ZwoC8ZhQ12_pwm4tDSat6bu6zP2QNgo0nAdJVlxYi9KJ8TQzfOGylDPywPTKAjzxZyjyaUoUbmo76EDLzFvkQFvLB7v55ct2dDQoRtyKIKKVULWF4k0RavXNbEB_XrgwD5q0Odm1DDhWmiRnSYhZkrk1t0aDYSDYP1bUF3ugnuSjzxwyyz8tQiEkDz9MjFuKTRPSQih1huy1CF1jUduQoc_Od3C9W"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-display uppercase tracking-widest font-bold text-teal-700 dark:text-teal-400">
                      Pillar I
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0f172a] dark:text-slate-100 mt-0.5">
                      Polymath Synthesis
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-[#475569] dark:text-slate-400 font-normal leading-relaxed">
                  Unite natural sciences, dialectic reasoning, and algorithmic problem-solving into an integrated mental palace of first principles.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-300 group-hover:text-teal-800 dark:group-hover:text-teal-200">
                <span>Syllabus Cross-Mapping</span>
                <span className="text-[#0d9488] dark:text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </article>

            {/* Card 2: CBT Crucible */}
            <article
              onClick={() => openAuthModal("signin")}
              className="bg-white dark:bg-[#0c1322] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0 text-teal-700 dark:text-teal-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-display uppercase tracking-widest font-bold text-teal-700 dark:text-teal-400">
                      Pillar II
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0f172a] dark:text-slate-100 mt-0.5">
                      CBT Crucible
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-[#475569] dark:text-slate-400 font-normal leading-relaxed">
                  German penalty-calibrated testing environments that punish illusions of competence and harden conceptual precision under time stress.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-300 group-hover:text-teal-800 dark:group-hover:text-teal-200">
                <span>Rigorous Exam Calibration</span>
                <span className="text-[#0d9488] dark:text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </article>

            {/* Card 3: Mnemosyne Recall */}
            <article
              onClick={() => openAuthModal("signin")}
              className="bg-white dark:bg-[#0c1322] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300">
                    <svg className="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-display uppercase tracking-widest font-bold text-amber-700 dark:text-amber-300">
                      Pillar III
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0f172a] dark:text-slate-100 mt-0.5">
                      Mnemosyne Recall
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-[#475569] dark:text-slate-400 font-normal leading-relaxed">
                  Spaced neurological retrieval schedules mapped to forgetting curves, converting fleeting comprehension into enduring crystallized knowledge.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-300 group-hover:text-teal-800 dark:group-hover:text-teal-200">
                <span>Algorithmic Retention Engine</span>
                <span className="text-[#0d9488] dark:text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </article>
          </div>
        </section>

        {/* Academic Modernism Footer */}
        <footer className="w-full bg-white dark:bg-[#0c1322] border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-[#64748b] dark:text-slate-400 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 font-display">
              <span className="text-teal-700 dark:text-teal-400 font-bold tracking-wider">LUCID</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-[#475569] dark:text-slate-400 font-sans">
                © 2026 The Academic Consciousness &amp; Mastery Space.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-serif italic text-[#475569] dark:text-slate-400">
              <span>Veritas per Investigationem</span>
              <span className="text-slate-300 dark:text-slate-700 not-italic font-sans">•</span>
              <span className="not-italic font-sans">FEDPONEK (Polytechnic ND/HND) &amp; UNILAG (University 100L–500L) Curriculums Integrated</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Focused Auth Modal (Blurs landing page when opened) */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAuthModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-xl my-6 bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header with Teal Modernist Gradient */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0d9488] to-[#115e59] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-display font-bold text-white text-lg shadow-xs">
                  L
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight font-display">Lucid Academic Access</h2>
                  <p className="text-xs text-teal-100/90 font-sans">
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
            <div className="p-3 sm:p-4 bg-teal-900/5 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === "signin"
                      ? "bg-white dark:bg-[#0e1627] text-[#0f766e] dark:text-teal-300 shadow-xs"
                      : "text-[#475569] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-slate-200"
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
                      ? "bg-white dark:bg-[#0e1627] text-[#0f766e] dark:text-teal-300 shadow-xs"
                      : "text-[#475569] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-slate-200"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Modal Body: Complete Auth Form */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Role Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#334155] dark:text-slate-300 uppercase tracking-wider">
                    Select Account Role
                  </label>
                  {authMode === "signup" && (
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                      <Lock size={10} />
                      Rep &amp; Admin: Provisioned
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("student")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === "student"
                        ? "border-[#0d9488] dark:border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-[#0d9488]/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#0f172a]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        selectedRole === "student"
                          ? "bg-[#0d9488] text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-[#475569] dark:text-slate-300"
                      }`}
                    >
                      <GraduationCap size={15} />
                    </div>
                    <span className="text-xs font-bold text-[#0f172a] dark:text-slate-200">Scholar</span>
                    <span className="text-[10px] text-[#64748b] dark:text-slate-400">Open Register</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("courserep")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === "courserep"
                        ? "border-amber-500 dark:border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#0f172a]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        selectedRole === "courserep"
                          ? "bg-amber-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-[#475569] dark:text-slate-300"
                      }`}
                    >
                      <Megaphone size={14} />
                    </div>
                    <span className="text-xs font-bold text-[#0f172a] dark:text-slate-200">Course Rep</span>
                    <span className="text-[10px] text-[#64748b] dark:text-slate-400">Authorized</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === "admin"
                        ? "border-purple-600 dark:border-purple-400 bg-purple-50/60 dark:bg-purple-950/40 ring-2 ring-purple-600/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#0f172a]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        selectedRole === "admin"
                          ? "bg-purple-700 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-[#475569] dark:text-slate-300"
                      }`}
                    >
                      <Shield size={14} />
                    </div>
                    <span className="text-xs font-bold text-[#0f172a] dark:text-slate-200">Dept Admin</span>
                    <span className="text-[10px] text-[#64748b] dark:text-slate-400">Head of Dept</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Cohort Quick Logins */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0b1220] border border-slate-200/90 dark:border-slate-800 flex flex-col gap-2.5 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0f172a] dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                    <span>⚡ 1-Click Cohort &amp; Role Test Logins</span>
                  </span>
                  <span className="text-[10px] text-[#64748b] dark:text-slate-400">Instant Access</span>
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
                      className="py-1.5 px-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-[11px] font-bold text-[#0d9488] dark:text-teal-300 transition-colors text-center truncate cursor-pointer"
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
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1220] border border-slate-200/80 dark:border-slate-800 space-y-2.5 transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#334155] dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <School size={14} className="text-[#0d9488] dark:text-teal-400" />
                      <span>Institution &amp; Level Segregation</span>
                    </span>
                    <span className="text-[10px] text-[#64748b] dark:text-slate-400">Curriculum Matching</span>
                  </div>

                  {/* Institution Type Selector */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/60 dark:bg-[#162032] rounded-xl border border-transparent dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleInstitutionTypeChange("polytechnic")}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        institutionType === "polytechnic"
                          ? "bg-white dark:bg-[#0e1627] text-teal-900 dark:text-teal-300 shadow-2xs border border-transparent dark:border-teal-500/30"
                          : "text-[#475569] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-slate-100"
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
                          : "text-[#475569] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-slate-100"
                      }`}
                    >
                      🏛️ University (100L – 500L)
                    </button>
                  </div>

                  {/* Institution Dropdown */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#475569] dark:text-slate-300 mb-1">
                      {institutionType === "polytechnic" ? "Polytechnic" : "University"}
                    </label>
                    <select
                      value={selectedInstitutionId}
                      onChange={(e) => handleInstitutionChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0d9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden transition-all bg-white dark:bg-[#0f172a]"
                    >
                      {availableInstitutions.map((inst) => (
                        <option key={inst.id} value={inst.id} className="bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-slate-100">
                          {inst.name} ({inst.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Division & Department Cascading */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-[#475569] dark:text-slate-300 mb-1">
                        {institutionType === "polytechnic" ? "School / Faculty" : "College / Faculty"}
                      </label>
                      <select
                        value={facultyOrSchool}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0d9488] dark:focus:border-teal-400 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden bg-white dark:bg-[#0f172a] truncate"
                      >
                        {availableDivisions.map((div) => (
                          <option key={div.name} value={div.name} className="bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-slate-100">
                            {div.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#475569] dark:text-slate-300 mb-1">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0d9488] dark:focus:border-teal-400 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden bg-white dark:bg-[#0f172a] truncate"
                      >
                        {availableDepartments.map((dept) => (
                          <option key={dept} value={dept} className="bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-slate-100">
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Academic Level */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#475569] dark:text-slate-300 mb-1">
                      {institutionType === "polytechnic"
                        ? "Academic Level (Polytechnic ND / HND)"
                        : "Academic Level (University 100L – 500L)"}
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0d9488] dark:focus:border-teal-400 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden bg-white dark:bg-[#0f172a]"
                    >
                      {availableLevels.map((lvl) => (
                        <option key={lvl.value} value={lvl.value} className="bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-slate-100">
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name field (for Signup) */}
                {authMode === "signup" && (
                  <div>
                    <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-1.5">
                      Full Legal / Student Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Chukwu Kingsley Emeka"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#0d9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Identifier: Matric No / Staff ID */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-1.5">
                    {selectedRole === "admin"
                      ? "Staff Identity Code / Academic Portal ID"
                      : selectedRole === "courserep"
                      ? "Matriculation / Rep Authorization No"
                      : "Matriculation / Scholar Portal Number"}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#0d9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-1.5">
                    Institutional or Personal Email *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="student@fpno.edu.ng or user@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#0d9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#334155] dark:text-slate-300">
                      Password (min 6 characters)
                    </label>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] focus:border-[#0d9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-xs text-[#0f172a] dark:text-slate-100 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
                      : "bg-[#0d9488] hover:bg-[#0f766e]"
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
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[11px]">
                    <span className="bg-white dark:bg-[#0c1322] px-2 text-slate-400 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-[#162035] text-[#1e293b] dark:text-slate-200 text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
              <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    onExploreAsGuest();
                  }}
                  className="text-xs text-[#64748b] hover:text-[#0d9488] dark:hover:text-teal-400 font-medium transition-colors cursor-pointer"
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
