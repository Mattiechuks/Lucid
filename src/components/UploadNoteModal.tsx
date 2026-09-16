import { useState, useRef, FormEvent } from "react";
import { X, Upload, Sparkles, FileText, AlignLeft, Check } from "lucide-react";
import { Course } from "../types";

interface UploadNoteModalProps {
  courses: Course[];
  onClose: () => void;
  onOpenHandwritten: () => void;
  onSubmit: (data: {
    course: string;
    title: string;
    fileName?: string;
    rawText?: string;
    sourceType: "file" | "paste" | "handwritten";
  }) => void;
}

export function UploadNoteModal({ courses, onClose, onOpenHandwritten, onSubmit }: UploadNoteModalProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [course, setCourse] = useState(courses[0]?.code || "AIT 311");
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | undefined) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-neutral-200/90 shadow-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="font-serif-display text-lg font-bold text-neutral-900">
              Upload Course Note
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Lucid turns your material into high-yield flashcards.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch: File Upload vs Direct Text */}
        <div className="px-6 pt-4 space-y-3">
          {/* Handwritten Note Highlight Banner */}
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-base">✍️</span>
              <div>
                <p className="text-xs font-bold text-[#006d64]">Have handwritten notebook notes?</p>
                <p className="text-[11px] text-teal-800">Use our AI Handwriting OCR to transcribe photo scans into flashcards.</p>
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

          <div className="flex rounded-xl bg-neutral-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("file")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                activeTab === "file"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-800"
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
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-800"
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
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
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
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Note Title
            </label>
            <input
              type="text"
              placeholder="e.g. Week 8 — Database Concurrency & 2PL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* File picker or Paste textarea */}
          {activeTab === "file" ? (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
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
                    ? "border-blue-500 bg-blue-50/50"
                    : fileName
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/50"
                }`}
              >
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 text-xs font-medium">
                    <Check size={16} />
                    <span className="font-semibold">{fileName}</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-neutral-500">
                    <Upload size={20} className="mx-auto text-neutral-400" />
                    <p className="text-xs font-medium">
                      Click to choose or drag and drop file here
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      PDF, DOCX, or plain text up to 25MB
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
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Lecture Excerpt or Summary
              </label>
              <textarea
                rows={5}
                placeholder="Paste key points, lecture slides summary, or syllabus definitions here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
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
