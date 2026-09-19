import { useState, FormEvent } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Megaphone,
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { DEMO_USERS, COURSES } from "../data/mockData";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: "signin" | "signup";
  usersRoster?: UserProfile[];
}

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "signin",
  usersRoster = [],
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign In state
  const [signInIdentifier, setSignInIdentifier] = useState("SWD/2023/1042");
  const [signInPassword, setSignInPassword] = useState("••••••••");

  // Sign Up state
  const [fullName, setFullName] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Software & Web Development");
  const [level, setLevel] = useState("HND 1 • 300 Level");
  const [repCourse, setRepCourse] = useState("SWD 311 (Operating System)");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleRoleChange = (r: UserRole) => {
    setSelectedRole(r);
    setAuthError(null);
    const demo = DEMO_USERS[r];
    setSignInIdentifier(demo.matricNo);
  };

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const target = signInIdentifier.trim().toLowerCase();

    // Check roster and demo users
    const pool = [...usersRoster, ...Object.values(DEMO_USERS)];
    const matched = pool.find(
      (u) =>
        u.role === selectedRole &&
        (u.matricNo.toLowerCase() === target || u.email.toLowerCase() === target)
    );

    if (matched) {
      onAuthSuccess({ ...matched, isLoggedIn: true });
      onClose();
      return;
    }

    // Check demo fallback
    const demo = DEMO_USERS[selectedRole];
    if (
      target === demo.matricNo.toLowerCase() ||
      target === demo.email.toLowerCase() ||
      target === ""
    ) {
      onAuthSuccess({ ...demo, isLoggedIn: true });
      onClose();
      return;
    }

    if (selectedRole !== "student") {
      setAuthError(
        `No authorized ${
          selectedRole === "admin" ? "Admin" : "Course Rep"
        } account found with ID "${signInIdentifier}". Privileged accounts must be assigned by an Admin.`
      );
      return;
    }

    // Dynamic user with student role
    const initials = (signInIdentifier.split("/")[0] || "SC").slice(0, 2).toUpperCase();
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: "Scholar Student",
      matricNo: signInIdentifier || demo.matricNo,
      email: `${selectedRole}@lucid.edu`,
      department: demo.department,
      level: demo.level,
      avatarInitials: initials,
      isLoggedIn: true,
      role: "student",
    };
    onAuthSuccess(user);
    onClose();
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (selectedRole !== "student") {
      setAuthError(
        "Course Rep and Admin accounts cannot be self-registered. They must be provisioned by the Department Admin."
      );
      return;
    }
    if (!fullName.trim()) return;

    const initials =
      fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "SC";

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: fullName.trim(),
      matricNo: matricNo.trim() || "SWD/2024/001",
      email: email.trim() || "scholar@lucid.edu",
      department,
      level,
      avatarInitials: initials,
      isLoggedIn: true,
      role: "student",
    };
    onAuthSuccess(user);
    onClose();
  };

  const fillDemoAccount = (r: UserRole) => {
    handleRoleChange(r);
    const demo = DEMO_USERS[r];
    onAuthSuccess(demo);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Brand */}
        <div className="bg-[#006d64] dark:bg-teal-900/90 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm">
              L
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight">Lucid</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-teal-100">
                  Portal Login
                </span>
              </div>
              <p className="text-[11px] text-teal-100/80">
                {mode === "signin"
                  ? "Select your role to access your academic dashboard"
                  : "Register as a scholar, course rep, or admin"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="px-6 pt-4 space-y-3">
          <div className="flex rounded-xl bg-neutral-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-white dark:bg-slate-700 text-neutral-900 dark:text-white shadow-2xs font-bold"
                  : "text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white dark:bg-slate-700 text-neutral-900 dark:text-white shadow-2xs font-bold"
                  : "text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`p-2 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === "student"
                  ? "border-[#006d64] dark:border-teal-400 bg-teal-50 dark:bg-teal-950/60 text-[#006d64] dark:text-teal-300 ring-1 ring-[#006d64] dark:ring-teal-400"
                  : "border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 bg-neutral-50/50 dark:bg-slate-800/50"
              }`}
            >
              <GraduationCap size={14} />
              <span>Scholar</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("courserep")}
              className={`p-2 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === "courserep"
                  ? "border-amber-600 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 ring-1 ring-amber-600 dark:ring-amber-500"
                  : "border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 bg-neutral-50/50 dark:bg-slate-800/50"
              }`}
            >
              <Megaphone size={14} />
              <span>Course Rep</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`p-2 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === "admin"
                  ? "border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 ring-1 ring-purple-600 dark:ring-purple-500"
                  : "border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 bg-neutral-50/50 dark:bg-slate-800/50"
              }`}
            >
              <Shield size={14} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="p-6 pt-3 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                {selectedRole === "admin"
                  ? "Staff ID or Admin Email"
                  : selectedRole === "courserep"
                  ? "Course Rep Matric No"
                  : "Matriculation Number or Email"}
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500" />
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
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500" />
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                selectedRole === "admin"
                  ? "bg-purple-700 hover:bg-purple-800"
                  : selectedRole === "courserep"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-[#006d64] hover:bg-[#005851]"
              }`}
            >
              <span>
                Sign In as{" "}
                {selectedRole === "admin"
                  ? "Admin"
                  : selectedRole === "courserep"
                  ? "Course Rep"
                  : "Scholar"}
              </span>
              <ArrowRight size={14} />
            </button>

            {/* Instant Demo Switcher */}
            <div className="pt-2 border-t border-neutral-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 dark:text-slate-500">⚡ 1-Click Fast Login:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("student")}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-[#006d64] dark:text-teal-300"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("courserep")}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                >
                  Rep
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin")}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300"
                >
                  Admin
                </button>
              </div>
            </div>
          </form>
        ) : selectedRole !== "student" ? (
          <div className="p-6 pt-4 space-y-3">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-neutral-800 dark:text-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                <Lock size={14} className="text-amber-700 dark:text-amber-400" />
                <span>Admin Provisioning Required</span>
              </div>
              <p className="text-[11px] text-neutral-700 dark:text-slate-300 leading-relaxed">
                <strong>{selectedRole === "admin" ? "Administrator" : "Course Representative"}</strong> accounts
                cannot be created publicly. By departmental rules, they must be officially assigned and
                provisioned by the <strong>Department Administrator (HOD / Exam Officer)</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setAuthError(null);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Switch to Sign In</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className="w-full py-2 text-center text-xs font-semibold text-[#006d64] dark:text-teal-400 hover:underline"
            >
              ← Or register as a Student Scholar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="p-6 pt-3 space-y-3">
            {authError && (
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kelechi Okafor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                Matriculation Number
              </label>
              <input
                type="text"
                required
                placeholder="SWD/2024/001"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64] uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="email@lucid.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-[#006d64] hover:bg-[#005851]"
            >
              <span>Create Scholar Account</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
