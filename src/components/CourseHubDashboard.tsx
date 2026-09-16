import { useState, FormEvent } from "react";
import {
  Search,
  BookOpen,
  Award,
  Layers,
  FileText,
  Microscope,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  Shield,
  Megaphone,
  GraduationCap,
  Plus,
  X,
  Pin,
  UserPlus,
} from "lucide-react";
import { Course, CBTMode, CourseNote, UserProfile, Announcement } from "../types";

interface CourseHubDashboardProps {
  courses: Course[];
  activeCourse: Course;
  onSelectCourse: (course: Course) => void;
  onStartStudy: (courseCode: string) => void;
  onOpenCBTQuiz: (course: Course, mode: CBTMode) => void;
  onOpenPracticalReports: (course: Course) => void;
  onOpenHandwrittenConverter: () => void;
  onUploadNoteClick: () => void;
  notes: CourseNote[];
  currentUser?: UserProfile;
  announcements?: Announcement[];
  onAddAnnouncement?: (announcement: Announcement) => void;
  onOpenUserProvisioning?: () => void;
}

// Color badges for each course code
const COURSE_COLORS: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  "AIT 311": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", bar: "bg-amber-500" },
  "SWD 311": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300", bar: "bg-orange-500" },
  "SWD 312": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", bar: "bg-blue-500" },
  "SWD 313": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", bar: "bg-emerald-500" },
  "SWD 314": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", bar: "bg-purple-500" },
  "SWD 315": { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-300", bar: "bg-teal-500" },
  "GNS 311": { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300", bar: "bg-rose-500" },
  "EED 313": { bg: "bg-slate-200", text: "text-slate-800", border: "border-slate-300", bar: "bg-slate-600" },
};

export function CourseHubDashboard({
  courses,
  activeCourse,
  onSelectCourse,
  onStartStudy,
  onOpenCBTQuiz,
  onOpenPracticalReports,
  onOpenHandwrittenConverter,
  onUploadNoteClick,
  notes,
  currentUser,
  announcements = [],
  onAddAnnouncement,
  onOpenUserProvisioning,
}: CourseHubDashboardProps) {
  const [courseSearch, setCourseSearch] = useState("");
  const [showOutlineModal, setShowOutlineModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [newNoticePinned, setNewNoticePinned] = useState(true);

  const canPostNotice = currentUser?.role === "admin" || currentUser?.role === "courserep";

  const handlePostNotice = (e: FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim() || !onAddAnnouncement) return;

    const notice: Announcement = {
      id: `ann-${Date.now()}`,
      authorName: currentUser?.name || "Academic Representative",
      authorRole: currentUser?.role || "courserep",
      title: newNoticeTitle.trim(),
      content: newNoticeContent.trim(),
      courseCode: activeCourse.code,
      date: "Just now",
      pinned: newNoticePinned,
    };

    onAddAnnouncement(notice);
    setNewNoticeTitle("");
    setNewNoticeContent("");
    setShowAnnouncementModal(false);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const courseNotes = notes.filter((n) => n.course === activeCourse.code);
  const totalCards = courseNotes.reduce((acc, curr) => acc + (curr.cardCount || 0), 0) || (activeCourse.flashcardCount || 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* 2-Column Layout: Left Courses Sidebar + Right Main Course View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: 4 cols */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Search courses input */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64] shadow-2xs"
            />
          </div>

          {/* Courses List */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden p-2 space-y-1">
            {filteredCourses.map((c) => {
              const isSelected = c.code === activeCourse.code;
              const color = COURSE_COLORS[c.code] || {
                bg: "bg-neutral-100",
                text: "text-neutral-800",
                border: "border-neutral-300",
                bar: "bg-neutral-400",
              };

              return (
                <button
                  key={c.code}
                  onClick={() => onSelectCourse(c)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-[#006d64]/8 border border-[#006d64]/25 shadow-2xs"
                      : "hover:bg-neutral-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Course Code Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono shrink-0 border ${color.bg} ${color.text} ${color.border}`}
                    >
                      {c.code}
                    </span>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isSelected ? "text-[#006d64] font-bold" : "text-neutral-700"
                      }`}
                    >
                      {c.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span className="text-[10px] text-neutral-400 font-medium">{c.units || 3}U</span>
                    <ChevronRight
                      size={14}
                      className={`text-neutral-400 transition-transform ${
                        isSelected ? "text-[#006d64] translate-x-0.5" : "group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Semester Summary Card matching screenshot */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              <span>First Semester</span>
              <span>HND 1 / Year 3</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
              <span className="text-xs text-neutral-600 font-medium">8 Courses Registered</span>
              <span className="text-xs font-bold text-neutral-900">24 Total Credit Units</span>
            </div>
          </div>
        </aside>

        {/* Right Main Course View: 8 cols */}
        <main className="lg:col-span-8 space-y-6">
          {/* Role-Differentiated Workspace Top Banner */}
          {currentUser && (
            <div
              className={`p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                currentUser.role === "admin"
                  ? "bg-purple-50/80 border-purple-200/80 text-purple-950"
                  : currentUser.role === "courserep"
                  ? "bg-amber-50/80 border-amber-200/80 text-amber-950"
                  : "bg-teal-50/80 border-teal-200/80 text-teal-950"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    currentUser.role === "admin"
                      ? "bg-purple-700 text-white"
                      : currentUser.role === "courserep"
                      ? "bg-amber-600 text-white"
                      : "bg-[#006d64] text-white"
                  }`}
                >
                  {currentUser.role === "admin" ? (
                    <Shield size={20} />
                  ) : currentUser.role === "courserep" ? (
                    <Megaphone size={20} />
                  ) : (
                    <GraduationCap size={20} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider">
                      {currentUser.role === "admin"
                        ? "Department Administrator Console"
                        : currentUser.role === "courserep"
                        ? "Class Representative Workspace"
                        : "Scholar Study Dashboard"}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        currentUser.role === "admin"
                          ? "bg-purple-200/70 text-purple-900"
                          : currentUser.role === "courserep"
                          ? "bg-amber-200/70 text-amber-900"
                          : "bg-teal-200/70 text-teal-900"
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {currentUser.role === "admin"
                      ? `${currentUser.name} (${currentUser.staffTitle || "Exam Officer"}) — Faculty Moderation Active`
                      : currentUser.role === "courserep"
                      ? `${currentUser.name} — ${currentUser.repCourseCode || "HND 1 Course Representative"}`
                      : `${currentUser.name} (${currentUser.matricNo}) • ${currentUser.department}`}
                  </p>
                </div>
              </div>

              {/* Role-specific quick actions */}
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                {currentUser.role === "admin" && onOpenUserProvisioning && (
                  <button
                    onClick={onOpenUserProvisioning}
                    className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-950 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
                    title="Assign & Register Department Admins and Course Reps"
                  >
                    <UserPlus size={13} className="text-purple-700" />
                    <span>Assign Accounts</span>
                  </button>
                )}
                {canPostNotice && (
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className={`px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 ${
                      currentUser.role === "admin"
                        ? "bg-purple-700 hover:bg-purple-800"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    <Plus size={13} />
                    <span>Broadcast Notice</span>
                  </button>
                )}
                {currentUser.role === "courserep" && (
                  <button
                    onClick={onUploadNoteClick}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <Upload size={13} />
                    <span>Upload Rep Note</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Department & Cohort Announcements Card */}
          {announcements.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#006d64] flex items-center justify-center font-bold text-xs">
                    <Pin size={13} />
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                    Official Department & Cohort Notices
                  </h3>
                </div>
                {canPostNotice && (
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="text-[11px] font-bold text-[#006d64] hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Post Notice</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/70 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            ann.authorRole === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {ann.authorRole === "admin" ? "HOD / Admin" : "Course Rep"}
                        </span>
                        <h4 className="text-xs font-bold text-neutral-900">{ann.title}</h4>
                      </div>
                      <span className="text-[10px] text-neutral-400 shrink-0">{ann.date}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed pl-1">
                      {ann.content}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1.5 mt-1.5 border-t border-neutral-200/50">
                      <span>By: {ann.authorName}</span>
                      {ann.courseCode && (
                        <span className="font-semibold text-neutral-500 font-mono">
                          Re: {ann.courseCode}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Hero Banner */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-6 space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span>{activeCourse.semester || "HND 1 - First Semester"}</span>
              <span>&gt;</span>
              <span className="font-bold text-[#006d64]">{activeCourse.code}</span>
            </div>

            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-black text-neutral-900 font-sans tracking-tight">
                  {activeCourse.code}
                </span>
                <span className="text-sm font-semibold text-neutral-500">—</span>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {activeCourse.title}
                </h1>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                {activeCourse.description || "Core syllabus modules, laboratory exercises, active recall flashcards and CBT testing."}
              </p>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
                {activeCourse.units || 3} Units
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {activeCourse.isCompulsory !== false ? "Compulsory" : "Elective"}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                {totalCards} Flashcard Decks
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {activeCourse.practicalCount || 0} Practical Labs
              </span>
            </div>

            {/* Quick Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-neutral-100">
              <button
                onClick={() => onOpenCBTQuiz(activeCourse, "objective")}
                className="px-4 py-2 rounded-xl bg-[#006d64] hover:bg-[#005851] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Award size={14} />
                <span>Practice CBT Test</span>
              </button>

              <button
                onClick={() => onStartStudy(activeCourse.code)}
                className="px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Layers size={14} className="text-[#006d64]" />
                <span>Study Flashcards</span>
              </button>

              <button
                onClick={() => onOpenPracticalReports(activeCourse)}
                className="px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Microscope size={14} className="text-indigo-600" />
                <span>Practical Reports</span>
              </button>

              <button
                onClick={onOpenHandwrittenConverter}
                className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span>✍️</span>
                <span>Convert Handwritten Note</span>
              </button>
            </div>
          </div>

          {/* 2x2 Bento Grid from Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: CBT Practice Centre */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-[#006d64]/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7952eb] flex items-center justify-center font-bold">
                      <Award size={18} />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">CBT Practice Centre</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f0ebff] text-[#7952eb]">
                    Exam Simulation
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Three test modes — Objective (MCQ), German-style (true/false with penalty), and full Theory. Timed. Scored. Reviewed.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => onOpenCBTQuiz(activeCourse, "objective")}
                  className="flex-1 py-1.5 rounded-lg bg-neutral-100 hover:bg-[#006d64] hover:text-white text-neutral-800 text-[11px] font-bold transition-colors text-center"
                >
                  Objective
                </button>
                <button
                  onClick={() => onOpenCBTQuiz(activeCourse, "german")}
                  className="flex-1 py-1.5 rounded-lg bg-neutral-100 hover:bg-amber-600 hover:text-white text-neutral-800 text-[11px] font-bold transition-colors text-center"
                >
                  German
                </button>
                <button
                  onClick={() => onOpenCBTQuiz(activeCourse, "theory")}
                  className="flex-1 py-1.5 rounded-lg bg-neutral-100 hover:bg-indigo-600 hover:text-white text-neutral-800 text-[11px] font-bold transition-colors text-center"
                >
                  Theory
                </button>
              </div>
            </div>

            {/* Card 2: Flashcards */}
            <div
              onClick={() => onStartStudy(activeCourse.code)}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-[#006d64]/40 transition-colors cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006d64] flex items-center justify-center font-bold">
                      <Layers size={18} />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">Flashcards</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#006d64]">
                    Active recall
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Spaced-repetition cards covering key concepts, definitions, formulas and mechanisms.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs font-bold text-[#006d64] group-hover:underline">
                <span>Study {totalCards} cards</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 3: Practical Reports */}
            <div
              onClick={() => onOpenPracticalReports(activeCourse)}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-[#006d64]/40 transition-colors cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Microscope size={18} />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">Practical Reports</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Lab work
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Lab write-ups with aims, procedures, observations and conclusions.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs font-bold text-[#006d64] group-hover:underline">
                <span>View reports</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 4: Course Outline */}
            <div
              onClick={() => setShowOutlineModal(true)}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-[#006d64]/40 transition-colors cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                      <BookOpen size={18} />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">Course Outline</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    Syllabus
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Full syllabus breakdown covering all topics, contact hours and learning objectives.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs font-bold text-[#006d64] group-hover:underline">
                <span>Read outline</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Course Outline Drawer / Modal */}
      {showOutlineModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowOutlineModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#006d64] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200">
                  {activeCourse.code} • SYLLABUS
                </span>
                <h3 className="text-lg font-bold">{activeCourse.title}</h3>
              </div>
              <button
                onClick={() => setShowOutlineModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Weekly Lecture & Laboratory Schedule
              </h4>

              <div className="space-y-2.5 text-xs">
                {(activeCourse.topics || [
                  "Foundational Architecture Concepts & Von Neumann Architecture",
                  "Instruction Set Principles, Register Transfers & Micro-operations",
                  "Memory Subsystems, Cache Mapping & AMAT Calculations",
                  "Pipelining, Hazards, Branch Prediction & Super-scalar Processing",
                ]).map((topic, i) => (
                  <div key={i} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#006d64] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-neutral-900">{topic}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Theoretical foundations, hardware representations, and weekly assessment questions.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-right">
              <button
                onClick={() => setShowOutlineModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold"
              >
                Close Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Announcement Creation Modal */}
      {showAnnouncementModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowAnnouncementModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-6 py-4 text-white flex items-center justify-between ${
                currentUser?.role === "admin" ? "bg-purple-700" : "bg-amber-600"
              }`}
            >
              <div className="flex items-center gap-2">
                {currentUser?.role === "admin" ? <Shield size={18} /> : <Megaphone size={18} />}
                <div>
                  <h3 className="font-bold text-sm">
                    {currentUser?.role === "admin"
                      ? "Broadcast Department Announcement"
                      : "Post Class Notice (Course Rep)"}
                  </h3>
                  <p className="text-[11px] opacity-90">
                    Will be pinned to all students registered in this cohort
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Notice Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Lab Practical / CBT Test Time"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Announcement Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide explicit instructions, venue, or syllabus areas to prepare for..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#006d64]/20 focus:border-[#006d64]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNoticePinned}
                    onChange={(e) => setNewNoticePinned(e.target.checked)}
                    className="rounded text-[#006d64] focus:ring-[#006d64]"
                  />
                  <span>Pin to top of student dashboards</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs ${
                    currentUser?.role === "admin"
                      ? "bg-purple-700 hover:bg-purple-800"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
