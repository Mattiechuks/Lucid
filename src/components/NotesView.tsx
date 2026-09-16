import { useState, useMemo } from "react";
import {
  FileText,
  Sparkles,
  RotateCcw,
  Search,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  Layers,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { CourseNote, Course } from "../types";
import { StatusBadge } from "./StatusBadge";

interface NotesViewProps {
  notes: CourseNote[];
  courses: Course[];
  onUploadClick: () => void;
  onOpenDeck: (note: CourseNote) => void;
  onRetry: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onFilterByCourse?: string | null;
}

export function NotesView({
  notes,
  courses,
  onUploadClick,
  onOpenDeck,
  onRetry,
  onDeleteNote,
  onFilterByCourse = null,
}: NotesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>(onFilterByCourse || "ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.fileName && n.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCourse = selectedCourse === "ALL" || n.course === selectedCourse;
      const matchesStatus = selectedStatus === "ALL" || n.status === selectedStatus;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [notes, searchQuery, selectedCourse, selectedStatus]);

  // Overall stats
  const readyNotes = notes.filter((n) => n.status === "READY");
  const totalCards = readyNotes.reduce((acc, curr) => acc + (curr.cardCount || 0), 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 mb-8 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 mb-2">
            <Sparkles size={12} className="text-blue-600" />
            AI Flashcard Studio
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Course Notes & Decks
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Upload lecture notes or paste syllabus excerpts. Lucid automatically extracts key concepts and generates high-yield flashcard decks.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
            <div className="text-left">
              <span className="block text-lg font-bold text-neutral-900 leading-tight">
                {readyNotes.length}
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">Ready Decks</span>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div className="text-left">
              <span className="block text-lg font-bold text-neutral-900 leading-tight">
                {totalCards}
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">Total Cards</span>
            </div>
          </div>

          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>Upload Note</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notes by title, code, or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-neutral-200/80 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-neutral-200/80 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="READY">Ready to Study</option>
            <option value="PROCESSING">Generating</option>
            <option value="FAILED">Failed / Needs Retry</option>
          </select>
        </div>
      </div>

      {/* Course Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCourse("ALL")}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            selectedCourse === "ALL"
              ? "bg-neutral-900 text-white shadow-2xs"
              : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-100"
          }`}
        >
          All Courses ({notes.length})
        </button>
        {courses.map((c) => {
          const count = notes.filter((n) => n.course === c.code).length;
          return (
            <button
              key={c.code}
              onClick={() => setSelectedCourse(c.code)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCourse === c.code
                  ? "bg-neutral-900 text-white shadow-2xs"
                  : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-100"
              }`}
            >
              {c.code} {count > 0 && <span className="opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Note List / Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-300/80 rounded-2xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-500 mx-auto flex items-center justify-center mb-3">
            <FileText size={22} />
          </div>
          <h3 className="font-serif-display text-lg font-semibold text-neutral-900 mb-1">
            No course notes match your criteria
          </h3>
          <p className="text-xs text-neutral-500 mb-5">
            {searchQuery || selectedCourse !== "ALL" || selectedStatus !== "ALL"
              ? "Try clearing filters or search terms to see all uploaded materials."
              : "Upload your first lecture note to generate AI flashcards."}
          </p>
          <div className="flex items-center justify-center gap-2">
            {(searchQuery || selectedCourse !== "ALL" || selectedStatus !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCourse("ALL");
                  setSelectedStatus("ALL");
                }}
                className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={onUploadClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all"
            >
              <Plus size={14} />
              <span>Upload Note</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 p-5 sm:p-6 transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {note.course}
                    </span>
                    <StatusBadge status={note.status} />
                  </div>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    title="Remove note"
                    className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-600 transition-all p-1 rounded-md hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Note Title */}
                <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1.5 group-hover:text-neutral-950">
                  {note.title}
                </h3>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-500 mb-3">
                  <span>Uploaded {note.uploadedAt}</span>
                  {note.fileName && (
                    <span className="truncate max-w-[180px] font-mono text-[11px] text-neutral-400">
                      • {note.fileName}
                    </span>
                  )}
                  {note.cardCount !== undefined && note.status === "READY" && (
                    <span className="font-semibold text-neutral-700">
                      • {note.cardCount} flashcards
                    </span>
                  )}
                </div>

                {/* Error Box if FAILED */}
                {note.status === "FAILED" && (
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-700 mb-4">
                    <p className="font-medium">{note.error}</p>
                  </div>
                )}

                {/* Status description if PENDING or PROCESSING */}
                {(note.status === "PENDING" || note.status === "PROCESSING") && (
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs text-blue-700 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>
                      {note.status === "PENDING"
                        ? "Waiting in queue to extract key concepts..."
                        : "AI is analyzing lecture text and synthesizing cards..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-2">
                <span className="text-[11px] text-neutral-400 font-medium">
                  {note.sourceType === "paste" ? "Pasted text" : "Document source"}
                </span>

                <div className="flex items-center gap-2">
                  {note.status === "READY" && (
                    <button
                      onClick={() => onOpenDeck(note)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
                    >
                      <span>Study Deck</span>
                      <ArrowRight size={13} />
                    </button>
                  )}

                  {note.status === "FAILED" && (
                    <button
                      onClick={() => onRetry(note.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 text-xs font-semibold transition-colors"
                    >
                      <RotateCcw size={13} />
                      <span>Retry Generation</span>
                    </button>
                  )}

                  {(note.status === "PENDING" || note.status === "PROCESSING") && (
                    <span className="text-xs text-neutral-400 italic">Processing…</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
