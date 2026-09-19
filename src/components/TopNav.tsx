import { useState } from "react";
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  Plus,
  Sun,
  Moon,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Megaphone,
} from "lucide-react";
import { ActiveTab, UserProfile, UserRole } from "../types";

interface TopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  notesCount: number;
  papersCount: number;
  coursesCount: number;
  onUploadNoteClick: () => void;
  onUploadPaperClick: () => void;
  onOpenHandwrittenConverter: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile;
  onSignOut: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  hasGeminiKey?: boolean;
}

export function TopNav({
  activeTab,
  setActiveTab,
  notesCount,
  papersCount,
  coursesCount,
  onUploadNoteClick,
  onUploadPaperClick,
  onOpenHandwrittenConverter,
  onOpenAuth,
  currentUser,
  onSignOut,
  isDarkMode,
  onToggleDarkMode,
  hasGeminiKey = false,
}: TopNavProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Role display helpers
  const roleBadge = () => {
    switch (currentUser.role) {
      case "admin":
        return {
          label: "Admin",
          bg: "bg-purple-50 text-purple-800 border-purple-200/80",
          icon: <Shield size={12} className="text-purple-600" />,
        };
      case "courserep":
        return {
          label: "Course Rep",
          bg: "bg-amber-50 text-amber-800 border-amber-200/80",
          icon: <Megaphone size={12} className="text-amber-600" />,
        };
      default:
        return {
          label: "Scholar",
          bg: "bg-teal-50 text-[#006d64] border-teal-200/80",
          icon: <GraduationCap size={12} className="text-[#006d64]" />,
        };
    }
  };

  const badge = roleBadge();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0e1627]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand: Lucid with rounded teal 'L' and BETA pill */}
        <div className="flex items-center gap-5">
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {/* Lucid rounded icon */}
            <div className="w-8 h-8 rounded-xl bg-[#006d64] text-white flex items-center justify-center font-black text-base shadow-xs transition-transform group-hover:scale-105">
              <span className="leading-none text-white font-bold text-sm">
                L
              </span>
            </div>
            
            {/* Brand Title */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#006d64] font-sans">
                Lucid
              </span>
              <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f0ebff] dark:bg-purple-950/60 text-[#7952eb] dark:text-purple-300 uppercase">
                BETA
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-neutral-100/90 dark:bg-slate-900/90 rounded-xl border border-neutral-200/70 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-white dark:bg-slate-800 text-neutral-950 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100"
              }`}
            >
              <span>Course Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "notes"
                  ? "bg-white dark:bg-slate-800 text-neutral-950 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100"
              }`}
            >
              <Sparkles size={13} className={activeTab === "notes" ? "text-[#006d64]" : "text-neutral-500 dark:text-slate-400"} />
              <span>Notes & Flashcards</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300">
                {notesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "past"
                  ? "bg-white dark:bg-slate-800 text-neutral-950 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100"
              }`}
            >
              <GraduationCap size={14} className={activeTab === "past" ? "text-[#006d64]" : "text-neutral-500 dark:text-slate-400"} />
              <span>Past Questions</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300">
                {papersCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "courses"
                  ? "bg-white dark:bg-slate-800 text-neutral-950 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-100"
              }`}
            >
              <BookOpen size={13} className={activeTab === "courses" ? "text-[#006d64]" : "text-neutral-500 dark:text-slate-400"} />
              <span>Course Catalog</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300">
                {coursesCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Right side controls: Cohort Pill + Role Badge + Theme Switch + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Institution & Cohort Pill */}
          {currentUser.institutionId && (
            <div
              onClick={onOpenAuth}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900 text-[11px] font-semibold text-neutral-700 dark:text-slate-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
              title={`${currentUser.institutionName || currentUser.institutionId} • ${currentUser.department} • ${currentUser.level}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#006d64]" />
              <span className="font-bold text-neutral-900 dark:text-white">{currentUser.institutionId}</span>
              <span className="text-neutral-400 dark:text-slate-500">•</span>
              <span className="text-[#006d64] dark:text-teal-400 font-medium">{currentUser.level || "HND 1"}</span>
            </div>
          )}

          {/* Active Role Indicator Badge */}
          <div
            onClick={onOpenAuth}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold cursor-pointer transition-all hover:opacity-90 ${badge.bg}`}
            title={`Signed in as ${currentUser.name} (${badge.label}) - Click to switch role`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>

          {/* Quick Handwritten Upload Pill */}
          <button
            onClick={onOpenHandwrittenConverter}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200/80 hover:bg-teal-100/80 text-[#006d64] text-xs font-bold transition-all"
            title="Upload photo of handwritten notes or scanned notebook PDF"
          >
            <span>✍️</span>
            <span>Handwritten OCR</span>
          </button>

          {/* Theme Toggle Pill */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle Theme"
            className="w-12 h-6 rounded-full bg-neutral-200 p-0.5 flex items-center transition-colors relative cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 shadow-xs transform transition-transform flex items-center justify-center text-white text-[10px] ${
                isDarkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {isDarkMode ? <Moon size={10} /> : <Sun size={10} />}
            </div>
          </button>

          {/* User Profile Avatar Bubble */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center border transition-transform active:scale-95 cursor-pointer shadow-xs ${
                currentUser.role === "admin"
                  ? "bg-purple-100 text-purple-800 border-purple-300"
                  : currentUser.role === "courserep"
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-[#d5f5ee] text-[#006d64] border-[#006d64]/20 hover:bg-[#c2efe5]"
              }`}
              title="Scholar Account Menu (Click to switch role or sign out)"
            >
              {currentUser.avatarInitials || "OL"}
            </button>

            {/* Profile dropdown menu */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200/90 dark:border-slate-800 shadow-xl p-3 z-50 animate-scale-in text-neutral-900 dark:text-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-2 border-b border-neutral-150 dark:border-slate-800 mb-2">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{currentUser.name}</p>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-slate-400 font-mono">{currentUser.matricNo}</p>
                  
                  {/* Institution and Department information */}
                  <div className="mt-2 p-2 rounded-xl bg-neutral-50 dark:bg-slate-800/80 border border-neutral-200/70 dark:border-slate-700/80 space-y-1 text-[10px]">
                    <div className="font-semibold text-neutral-800 dark:text-slate-200 truncate">
                      🏛️ {currentUser.institutionName || (currentUser.institutionType === "polytechnic" ? "Federal Polytechnic Nekede" : "University of Lagos")}
                    </div>
                    {currentUser.facultyOrSchool && (
                      <div className="text-neutral-500 dark:text-slate-400 truncate">
                        {currentUser.facultyOrSchool}
                      </div>
                    )}
                    <div className="text-[#006d64] dark:text-teal-400 font-medium flex items-center justify-between">
                      <span className="truncate">{currentUser.department}</span>
                      <span className="font-bold shrink-0 ml-1 px-1.5 py-0.2 rounded bg-neutral-200/60 dark:bg-slate-700 text-neutral-700 dark:text-slate-200">{currentUser.level || "HND 1"}</span>
                    </div>
                  </div>

                  {currentUser.role === "student" && (
                    <div className="mt-1.5 px-2 py-1 rounded bg-neutral-150 dark:bg-slate-800 text-[10px] text-neutral-600 dark:text-slate-300 flex items-center gap-1">
                      <span>🔒</span>
                      <span>Uploads restricted to Course Rep</span>
                    </div>
                  )}

                  {currentUser.repCourseCode && (
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold mt-1.5 bg-amber-50 dark:bg-amber-950/50 p-1.5 rounded border border-amber-200 dark:border-amber-800">
                      📢 Rep: {currentUser.repCourseCode}
                    </p>
                  )}
                  {currentUser.staffTitle && (
                    <p className="text-[10px] text-purple-800 dark:text-purple-300 font-semibold mt-1.5 bg-purple-50 dark:bg-purple-950/50 p-1.5 rounded border border-purple-200 dark:border-purple-800">
                      🛡️ {currentUser.staffTitle}
                    </p>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-700 dark:text-slate-300 flex items-center gap-2 font-medium transition-colors"
                  >
                    <User size={14} className="text-neutral-500 dark:text-slate-400" />
                    <span>Switch Role / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenHandwrittenConverter();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 text-[#006d64] dark:text-teal-400 flex items-center gap-2 font-medium transition-colors"
                  >
                    <span>✍️</span>
                    <span>Convert Handwritten Note</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign Out to Landing Page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sub-bar navigation */}
      <div className="flex lg:hidden border-t border-neutral-200/60 dark:border-slate-800 px-4 py-2 bg-neutral-50 dark:bg-slate-900 gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === "dashboard" ? "bg-[#006d64] text-white font-bold" : "text-neutral-600 dark:text-slate-400"
          }`}
        >
          Course Hub
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === "notes" ? "bg-[#006d64] text-white font-bold" : "text-neutral-600 dark:text-slate-400"
          }`}
        >
          Notes ({notesCount})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === "past" ? "bg-[#006d64] text-white font-bold" : "text-neutral-600 dark:text-slate-400"
          }`}
        >
          Past Questions ({papersCount})
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === "courses" ? "bg-[#006d64] text-white font-bold" : "text-neutral-600 dark:text-slate-400"
          }`}
        >
          Catalog ({coursesCount})
        </button>
      </div>
    </header>
  );
}

