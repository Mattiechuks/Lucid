import { X, Download, GraduationCap, Calendar, FileText, Check } from "lucide-react";
import { PastQuestionPaper } from "../types";

interface PaperPreviewModalProps {
  paper: PastQuestionPaper | null;
  onClose: () => void;
  onDownload: (paper: PastQuestionPaper) => void;
}

export function PaperPreviewModal({ paper, onClose, onDownload }: PaperPreviewModalProps) {
  if (!paper) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-teal-800 text-white flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                {paper.course} — {paper.examType}
              </h2>
              <span className="text-xs text-neutral-500 dark:text-slate-400">
                Academic Session: {paper.session}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(paper)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-teal-700 hover:bg-neutral-800 dark:hover:bg-teal-600 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Download size={13} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 dark:text-slate-500 hover:text-neutral-700 dark:hover:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Paper Document Preview (Simulated University Exam Sheet) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-neutral-50 dark:bg-slate-950">
          <div className="bg-white dark:bg-slate-900 border border-neutral-200/90 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xs max-w-xl mx-auto space-y-6">
            {/* Header of paper */}
            <div className="text-center border-b pb-5 border-neutral-200 dark:border-slate-800 space-y-1">
              <h3 className="font-serif-display text-sm tracking-wide uppercase font-bold text-neutral-900 dark:text-white">
                Departmental Examination Board
              </h3>
              <p className="text-xs font-semibold text-neutral-700 dark:text-slate-300">
                Course: {paper.course} • {paper.examType}
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-slate-400">
                Academic Year: {paper.session} • Time Allowed: 2 Hours 30 Minutes
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-slate-400 italic mt-2">
                Instructions: Answer any THREE questions. All questions carry equal marks unless specified.
              </p>
            </div>

            {/* Questions list */}
            <div className="space-y-4">
              {paper.sampleQuestions && paper.sampleQuestions.length > 0 ? (
                paper.sampleQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-neutral-50/70 dark:bg-slate-800/80 border border-neutral-200/60 dark:border-slate-700">
                    <p className="text-xs text-neutral-800 dark:text-slate-200 leading-relaxed font-serif-display font-medium">
                      {q}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-slate-800 border border-neutral-200/60 dark:border-slate-700 text-center text-xs text-neutral-500 dark:text-slate-400">
                  Document scanned from physical paper. Download the PDF for the full mathematical schematics and figures.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-slate-800 text-center text-[10px] text-neutral-400 dark:text-slate-500 font-mono">
              [END OF EXAMINATION PAPER — {paper.fileName}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
