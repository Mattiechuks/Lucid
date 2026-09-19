import { useState, useRef, FormEvent } from "react";
import { X, Upload, Plus, GraduationCap, Check } from "lucide-react";
import { Course, UserProfile } from "../types";
import { SESSIONS, EXAM_TYPES } from "../data/mockData";

interface UploadPaperModalProps {
  courses: Course[];
  onClose: () => void;
  currentUser?: UserProfile;
  onSubmit: (data: {
    course: string;
    session: string;
    examType: "First CA" | "Second CA" | "Final Exam";
    fileName: string;
  }) => void;
}

export function UploadPaperModal({ courses, onClose, onSubmit, currentUser }: UploadPaperModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200/90 dark:border-slate-800 shadow-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-slate-800">
          <div>
            <h2 className="font-serif-display text-lg font-bold text-neutral-900 dark:text-white">
              Upload Past Exam Paper
            </h2>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
              Preserved in the repository for student revision.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 dark:text-slate-500 hover:text-neutral-700 dark:hover:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {currentUser && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 flex items-center justify-center font-bold text-sm">
                  📢
                </span>
                <div>
                  <p className="font-bold text-amber-950 dark:text-amber-200 text-xs">
                    Exam Paper Uploader: {currentUser.name}
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    Authorized for {currentUser.institutionId} • {currentUser.department} ({currentUser.level})
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200/90 dark:bg-amber-800 text-amber-950 dark:text-amber-100 shrink-0">
                Course Rep
              </span>
            </div>
          )}

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1.5">
                Session
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-xs font-medium text-neutral-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              >
                {SESSIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1.5">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-xs font-medium text-neutral-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
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
            <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1.5">
              Exam Document (PDF/Scanned Image)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                fileName
                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/30"
                  : "border-neutral-200 dark:border-slate-700 hover:border-neutral-300 dark:hover:border-slate-600 bg-neutral-50/50 dark:bg-slate-800/50"
              }`}
            >
              {fileName ? (
                <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                  <Check size={16} />
                  <span className="font-semibold">{fileName}</span>
                </div>
              ) : (
                <div className="space-y-1 text-neutral-500 dark:text-slate-400">
                  <Upload size={18} className="mx-auto text-neutral-400 dark:text-slate-500" />
                  <p className="text-xs font-medium">Select examination file</p>
                  <p className="text-[11px] text-neutral-400 dark:text-slate-500">PDF, PNG, JPG</p>
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
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 dark:bg-teal-700 hover:bg-neutral-800 dark:hover:bg-teal-600 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition-all"
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
