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
}

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

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
    const demo = DEMO_USERS[r];
    setSignInIdentifier(demo.matricNo);
  };

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    const demo = DEMO_USERS[selectedRole];
    if (
      signInIdentifier.toLowerCase().includes(demo.matricNo.toLowerCase()) ||
      signInIdentifier.toLowerCase().includes(demo.email.toLowerCase())
    ) {
      onAuthSuccess({ ...demo, isLoggedIn: true });
    } else {
      // Dynamic user with chosen role
      const initials = (signInIdentifier.split("/")[0] || "SC").slice(0, 2).toUpperCase();
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name:
          selectedRole === "admin"
            ? "Department Admin"
            : selectedRole === "courserep"
            ? "Course Rep Officer"
            : "Scholar Student",
        matricNo: signInIdentifier || demo.matricNo,
        email: `${selectedRole}@lucid.edu`,
        department: demo.department,
        level: demo.level,
        avatarInitials: initials,
        isLoggedIn: true,
        role: selectedRole,
        repCourseCode: selectedRole === "courserep" ? repCourse : undefined,
      };
      onAuthSuccess(user);
    }
    onClose();
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
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
      matricNo: matricNo.trim() || (selectedRole === "admin" ? "STAFF/01" : "SWD/2024/001"),
      email: email.trim() || `${selectedRole}@student.edu`,
      department,
      level: selectedRole === "admin" ? "Faculty Board" : level,
      avatarInitials: initials,
      isLoggedIn: true,
      role: selectedRole,
      repCourseCode: selectedRole === "courserep" ? repCourse : undefined,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Brand */}
        <div className="bg-[#006d64] px-6 py-5 text-white flex items-center justify-between">
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
          <div className="flex rounded-xl bg-neutral-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-white text-neutral-900 shadow-2xs font-bold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white text-neutral-900 shadow-2xs font-bold"
                  : "text-neutral-500 hover:text-neutral-900"
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
                  ? "border-[#006d64] bg-teal-50 text-[#006d64] ring-1 ring-[#006d64]"
                  : "border-neutral-200 text-neutral-600 bg-neutral-50/50"
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
                  ? "border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600"
                  : "border-neutral-200 text-neutral-600 bg-neutral-50/50"
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
                  ? "border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600"
                  : "border-neutral-200 text-neutral-600 bg-neutral-50/50"
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
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {selectedRole === "admin"
                  ? "Staff ID or Admin Email"
                  : selectedRole === "courserep"
                  ? "Course Rep Matric No"
                  : "Matriculation Number or Email"}
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
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
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
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
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">⚡ 1-Click Fast Login:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("student")}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#006d64]"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("courserep")}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800"
                >
                  Rep
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin")}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800"
                >
                  Admin
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="p-6 pt-3 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kelechi Okafor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {selectedRole === "admin" ? "Staff ID" : "Matriculation Number"}
              </label>
              <input
                type="text"
                required
                placeholder={selectedRole === "admin" ? "STAFF/01" : "SWD/2024/001"}
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64] uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="email@lucid.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
              />
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
              <span>Create {selectedRole} Account</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
