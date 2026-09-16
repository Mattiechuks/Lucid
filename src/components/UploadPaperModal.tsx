import { useState, useRef, FormEvent } from "react";
import { X, Upload, Plus, GraduationCap, Check } from "lucide-react";
import { Course } from "../types";
import { SESSIONS, EXAM_TYPES } from "../data/mockData";

interface UploadPaperModalProps {
  courses: Course[];
  onClose: () => void;
  onSubmit: (data: {
    course: string;
    session: string;
    examType: "First CA" | "Second CA" | "Final Exam";
    fileName: string;
  }) => void;
}

export function UploadPaperModal({ courses, onClose, onSubmit }: UploadPaperModalProps) {
  const [course, setCourse] = useState(courses[0]?.code || "AIT 313");
  const [session, setSession] = useState(SESSIONS[0]);
  const [examType, setExamType] = useState<"First CA" | "Second CA" | "Final Exam">(EXAM_TYPES[0]);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    onSubmit({
      course,
      session,
      examType,
      fileName,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/90 shadow-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="font-serif-display text-lg font-bold text-neutral-900">
              Upload Past Exam Paper
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Preserved in the repository for student revision.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Session
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              >
                {SESSIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              >
                {EXAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Exam Document (PDF/Scanned Image)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                fileName
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
                <div className="space-y-1 text-neutral-500">
                  <Upload size={18} className="mx-auto text-neutral-400" />
                  <p className="text-xs font-medium">Select examination file</p>
                  <p className="text-[11px] text-neutral-400">PDF, PNG, JPG</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!fileName}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Plus size={14} />
              <span>Publish to Repository</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
