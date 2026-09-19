import { X, Keyboard, Sparkles, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";

interface HelpShortcutsModalProps {
  onClose: () => void;
}

export function HelpShortcutsModal({ onClose }: HelpShortcutsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-slate-800 text-neutral-800 dark:text-slate-200 flex items-center justify-center">
              <Keyboard size={16} />
            </div>
            <div>
              <h2 className="font-serif-display text-base font-bold text-neutral-900 dark:text-white">
                Lucid Guide & Keyboard Shortcuts
              </h2>
              <span className="text-xs text-neutral-500 dark:text-slate-400">
                Speed up your study workflow
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 dark:text-slate-500 hover:text-neutral-700 dark:hover:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-neutral-600 dark:text-slate-300">
          {/* Study Shortcuts */}
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Flashcard Study Mode Shortcuts
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-50 dark:bg-slate-800/80 border border-neutral-200/70 dark:border-slate-700">
                <span className="text-neutral-700 dark:text-slate-200">Flip card to reveal answer</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 font-mono text-[11px] font-semibold text-neutral-800 dark:text-slate-200 shadow-2xs">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-50 dark:bg-slate-800/80 border border-neutral-200/70 dark:border-slate-700">
                <span className="text-neutral-700 dark:text-slate-200">Rate card as "Needs Review"</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 font-mono text-[11px] font-semibold text-neutral-800 dark:text-slate-200 shadow-2xs">
                    1
                  </kbd>
                  <span className="text-neutral-400 dark:text-slate-500">or</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 font-mono text-[11px] font-semibold text-neutral-800 dark:text-slate-200 shadow-2xs">
                    ←
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-50 dark:bg-slate-800/80 border border-neutral-200/70 dark:border-slate-700">
                <span className="text-neutral-700 dark:text-slate-200">Rate card as "Got It"</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 font-mono text-[11px] font-semibold text-neutral-800 dark:text-slate-200 shadow-2xs">
                    2
                  </kbd>
                  <span className="text-neutral-400 dark:text-slate-500">or</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 font-mono text-[11px] font-semibold text-neutral-800 dark:text-slate-200 shadow-2xs">
                    →
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-50 dark:bg-slate-800/80 border border-neutral-200/70 dark:border-slate-700">
                <span className="text-neutral-700 dark:text-slate-200">Star card for review</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 font-mono text-[11px] font-semibold text-neutral-800 dark:text-slate-200 shadow-2xs">
                  S
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-50 dark:bg-slate-800/80 border border-neutral-200/70 dark:border-slate-700">
                <span className="text-neutral-700 dark:text-slate-200">Exit study mode</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 font-mono text-[11px] font-semibold text-neutral-800 dark:text-slate-200 shadow-2xs">
                  Esc
                </kbd>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="pt-4 border-t border-neutral-100 dark:border-slate-800">
            <h3 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-2.5">
              How Lucid Works
            </h3>
            <ul className="space-y-2 text-neutral-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Sparkles size={14} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">AI Note Synthesis:</strong> Upload lecture documents (PDF/DOCX) or paste transcripts. Gemini extracts core definitions, theorems, and exam traps.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <GraduationCap size={14} className="text-neutral-700 dark:text-slate-300 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">Past Papers Repository:</strong> Access official exam papers with question previews, filtered by course, session, and exam type.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="px-6 py-3 bg-neutral-50 dark:bg-slate-900 border-t border-neutral-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-teal-700 text-white text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-teal-600 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
