import { useState, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Download,
  Eye,
  Plus,
  Filter,
  FileText,
  Calendar,
  Layers,
  Lock,
} from "lucide-react";
import { PastQuestionPaper, Course, UserProfile } from "../types";
import { SESSIONS, EXAM_TYPES } from "../data/mockData";

interface PastQuestionsViewProps {
  papers: PastQuestionPaper[];
  courses: Course[];
  onUploadClick: () => void;
  onPreviewPaper: (paper: PastQuestionPaper) => void;
  onDownloadPaper: (paper: PastQuestionPaper) => void;
  currentUser?: UserProfile;
}

export function PastQuestionsView({
  papers,
  courses,
  onUploadClick,
  onPreviewPaper,
  onDownloadPaper,
  currentUser,
}: PastQuestionsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedSession, setSelectedSession] = useState("ALL");
  const [selectedExamType, setSelectedExamType] = useState<string>("ALL");

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      const matchesSearch =
        p.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.session.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = selectedCourse === "ALL" || p.course === selectedCourse;
      const matchesSession = selectedSession === "ALL" || p.session === selectedSession;
      const matchesExamType = selectedExamType === "ALL" || p.examType === selectedExamType;

      return matchesSearch && matchesCourse && matchesSession && matchesExamType;
    });
  }, [papers, searchQuery, selectedCourse, selectedSession, selectedExamType]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 mb-8 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 mb-2">
            <GraduationCap size={13} className="text-blue-600" />
            Archive & Repository
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Past Examination Papers
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Official continuous assessment and final exam papers organized by course, semester, and academic session.
          </p>
        </div>

        {currentUser?.role === "student" ? (
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
            title="Past paper archives are managed by Course Representatives"
          >
            <Lock size={14} className="text-amber-700" />
            <span>Upload Paper (Rep Only)</span>
          </button>
        ) : (
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006d64] hover:bg-[#005851] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
            title="Upload and archive past exam papers"
          >
            <Plus size={15} />
            <span>Upload Exam Paper</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs mb-6 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search paper by course code, session, or file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50/70 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white transition-all"
            />
          </div>

          {/* Course select */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Courses</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>

            {/* Session select */}
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Sessions</option>
              {SESSIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exam Type Segmented Filters */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100 overflow-x-auto text-xs">
          <span className="text-neutral-400 font-medium mr-1 text-[11px]">Type:</span>
          {["ALL", ...EXAM_TYPES].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedExamType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedExamType === type
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {type === "ALL" ? "All Papers" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Papers */}
      {filteredPapers.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-300 rounded-2xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-500 mx-auto flex items-center justify-center mb-3">
            <GraduationCap size={22} />
          </div>
          <h3 className="font-serif-display text-lg font-semibold text-neutral-900 mb-1">
            No past papers found
          </h3>
          <p className="text-xs text-neutral-500 mb-5">
            Try adjusting your course, session, or exam type filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCourse("ALL");
              setSelectedSession("ALL");
              setSelectedExamType("ALL");
            }}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 hover:border-neutral-300 transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-200">
                    {paper.course}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                    {paper.examType}
                  </span>
                </div>

                <h3 className="font-serif-display text-base font-bold text-neutral-900 mb-1">
                  Session {paper.session}
                </h3>
                <p className="text-xs text-neutral-500 font-mono truncate mb-3">
                  {paper.fileName}
                </p>

                <div className="text-[11px] text-neutral-400 space-y-0.5 mb-4">
                  <div>Uploaded on {paper.uploadedAt}</div>
                  <div>File size: {paper.fileSize || "1.8 MB"}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                <button
                  onClick={() => onPreviewPaper(paper)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold border border-neutral-200 transition-colors"
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => onDownloadPaper(paper)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
