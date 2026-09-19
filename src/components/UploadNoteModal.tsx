import { useState, useRef, FormEvent } from "react";
import { X, Upload, Sparkles, FileText, AlignLeft, Check, Loader2, BookOpen } from "lucide-react";
import { Course, UserProfile } from "../types";
import { extractTextFromPDF } from "../lib/pdfExtractor";

interface UploadNoteModalProps {
  courses: Course[];
  onClose: () => void;
  onOpenHandwritten: () => void;
  currentUser?: UserProfile;
  onSubmit: (data: {
    course: string;
    title: string;
    fileName?: string;
    rawText?: string;
    sourceType: "file" | "paste" | "handwritten";
  }) => void;
}

export function UploadNoteModal({ courses, onClose, onOpenHandwritten, onSubmit, currentUser }: UploadNoteModalProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [course, setCourse] = useState(courses[0]?.code || "AIT 311");
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfStats, setPdfStats] = useState<{ pages: number; words: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    if (!title) {
      // Clean up file name to propose a clean note title
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setTitle(cleanName);
    }

    // If it's a PDF, extract text directly via pdfjs-dist
    if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
      setIsExtractingPdf(true);
      setPdfStats(null);
      try {
        const extracted = await extractTextFromPDF(file);
        setRawText(extracted.text);
        setPdfStats({ pages: extracted.numPages, words: extracted.wordCount });
      } catch (err) {
        console.warn("PDF extraction warning:", err);
      } finally {
        setIsExtractingPdf(false);
      }
      return;
    }

    // If it's a text file, read content
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setRawText(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeTab === "file" && !fileName) return;
    if (activeTab === "paste" && !rawText.trim()) return;

    onSubmit({
      course,
      title: title.trim(),
      fileName: activeTab === "file" ? fileName : `Pasted_${title.slice(0, 16)}.txt`,
      rawText: activeTab === "paste" ? rawText.trim() : rawText,
      sourceType: activeTab,
    });
  };

  const isSubmitDisabled = !title.trim() || (activeTab === "file" && !fileName) || (activeTab === "paste" && !rawText.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200/90 dark:border-slate-800 shadow-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-slate-800">
          <div>
            <h2 className="font-serif-display text-lg font-bold text-neutral-900 dark:text-white">
              Upload Course Note
            </h2>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
              Lucid turns your material into high-yield flashcards.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 dark:text-slate-500 hover:text-neutral-700 dark:hover:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch: File Upload vs Direct Text */}
        <div className="px-6 pt-4 space-y-3">
          {/* Official Course Rep Authorization Pill */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 flex items-center justify-center font-bold text-sm">
                  📢
                </span>
                <div>
                  <p className="font-bold text-amber-950 dark:text-amber-200 text-xs">
                    Course Rep Upload Authorization Active
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    Uploader: <strong>{currentUser.name}</strong> • {currentUser.institutionId} ({currentUser.level})
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200/90 dark:bg-amber-800 text-amber-950 dark:text-amber-100 shrink-0">
                Verified
              </span>
            </div>
          )}

          {/* Handwritten Note Highlight Banner */}
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-base">✍️</span>
              <div>
                <p className="text-xs font-bold text-[#006d64] dark:text-teal-300">Have handwritten notebook notes?</p>
                <p className="text-[11px] text-teal-800 dark:text-teal-300/80">Use our AI Handwriting OCR to transcribe photo scans into flashcards.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHandwritten();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#006d64] hover:bg-[#005851] text-white text-xs font-bold whitespace-nowrap shadow-2xs transition-colors"
            >
              Handwriting OCR
            </button>
          </div>

          <div className="flex rounded-xl bg-neutral-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("file")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                activeTab === "file"
                  ? "bg-white dark:bg-slate-700 text-neutral-900 dark:text-white shadow-2xs"
                  : "text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200"
              }`}
            >
              <Upload size={13} />
              <span>Document (PDF/DOCX)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                activeTab === "paste"
                  ? "bg-white dark:bg-slate-700 text-neutral-900 dark:text-white shadow-2xs"
                  : "text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200"
              }`}
            >
              <AlignLeft size={13} />
              <span>Paste Typed Text</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course select */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1.5">
              Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-xs font-medium text-neutral-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Note Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1.5">
              Note Title
            </label>
            <input
              type="text"
              placeholder="e.g. Week 8 — Database Concurrency & 2PL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-xs text-neutral-900 dark:text-slate-100 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* File picker or Paste textarea */}
          {activeTab === "file" ? (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1.5">
                Select Document
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileChange(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40"
                    : fileName
                    ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/30"
                    : "border-neutral-200 dark:border-slate-700 hover:border-neutral-300 dark:hover:border-slate-600 bg-neutral-50/50 dark:bg-slate-800/50"
                }`}
              >
                {isExtractingPdf ? (
                  <div className="space-y-2 py-2 text-emerald-700 dark:text-emerald-300">
                    <Loader2 size={24} className="mx-auto animate-spin text-[#006d64] dark:text-teal-400" />
                    <p className="text-xs font-semibold">Extracting Lecture Content via PDF.js engine...</p>
                    <p className="text-[11px] text-neutral-500 dark:text-slate-400">Transcribing pages into clean machine-readable text</p>
                  </div>
                ) : fileName ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                      <Check size={16} />
                      <span className="font-semibold">{fileName}</span>
                    </div>
                    {pdfStats && (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">
                        <BookOpen size={12} />
                        <span>{pdfStats.pages} Page{pdfStats.pages > 1 ? "s" : ""} Extracted • ~{pdfStats.words.toLocaleString()} Words Ready</span>
                      </div>
                    )}
                    <p className="text-[10px] text-neutral-400 dark:text-slate-500">Click to change document</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-neutral-500 dark:text-slate-400">
                    <Upload size={20} className="mx-auto text-neutral-400 dark:text-slate-500" />
                    <p className="text-xs font-medium">
                      Click to choose or drag and drop file here
                    </p>
                    <p className="text-[11px] text-neutral-400 dark:text-slate-500">
                      PDF (automatic text extraction), DOCX, or plain text
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1.5">
                Lecture Excerpt or Summary
              </label>
              <textarea
                rows={5}
                placeholder="Paste key points, lecture slides summary, or syllabus definitions here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-xs text-neutral-900 dark:text-slate-100 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#006d64] hover:bg-[#005851] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-xs transition-all"
            >
              <Sparkles size={14} className="text-emerald-300" />
              <span>Generate Flashcards Deck</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
