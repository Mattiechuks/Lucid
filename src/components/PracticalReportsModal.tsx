import { useState } from "react";
import { X, Microscope, Download, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { PracticalReport, Course } from "../types";
import { PRACTICAL_REPORTS } from "../data/mockData";

interface PracticalReportsModalProps {
  course: Course;
  onClose: () => void;
}

export function PracticalReportsModal({ course, onClose }: PracticalReportsModalProps) {
  const reports = PRACTICAL_REPORTS.filter((r) => r.course === course.code) || [];
  const [selectedReport, setSelectedReport] = useState<PracticalReport | null>(reports[0] || PRACTICAL_REPORTS[0]);
  const [downloadToast, setDownloadToast] = useState(false);

  const handleDownload = () => {
    if (!selectedReport) return;
    const content = `PRACTICAL LAB REPORT
Course: ${selectedReport.course}
Title: ${selectedReport.title}
Date: ${selectedReport.date}

AIM:
${selectedReport.aim}

APPARATUS / TOOLS:
${selectedReport.apparatus.map((a) => `- ${a}`).join("\n")}

PROCEDURE:
${selectedReport.procedure.map((p, i) => `${i + 1}. ${p}`).join("\n")}

OBSERVATIONS:
${selectedReport.observations}

CONCLUSION:
${selectedReport.conclusions}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport.course}_Lab_Report_${selectedReport.weekNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  const activeReport = selectedReport || PRACTICAL_REPORTS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0b3330] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Microscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg">Practical Reports Repository</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  Lab Work
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Verified lab write-ups with aims, circuit procedures, code simulations and conclusions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Left list of reports */}
          <div className="border-r border-neutral-200 dark:border-slate-800 p-4 bg-neutral-50/70 dark:bg-slate-950/70 overflow-y-auto space-y-2">
            <h3 className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Available Lab Reports
            </h3>
            {PRACTICAL_REPORTS.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  activeReport.id === rep.id
                    ? "bg-white dark:bg-slate-800 border-[#006d64] dark:border-teal-500 shadow-2xs font-semibold text-neutral-900 dark:text-slate-100"
                    : "bg-white/50 dark:bg-slate-900/50 border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#006d64] dark:text-teal-400">{rep.course}</span>
                  <span className="text-[10px] text-neutral-400 dark:text-slate-400">Week {rep.weekNumber}</span>
                </div>
                <p className="line-clamp-2 text-neutral-800 dark:text-slate-200 text-[11px] leading-snug">
                  {rep.title}
                </p>
              </button>
            ))}
          </div>

          {/* Right report view */}
          <div className="col-span-2 p-6 overflow-y-auto space-y-5 bg-white dark:bg-slate-900 transition-colors">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-[#006d64] dark:text-teal-400 uppercase tracking-wider block">
                  {activeReport.course} • Practical Manual
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  {activeReport.title}
                </h3>
                <span className="text-[11px] text-neutral-400 dark:text-slate-400">Recorded on {activeReport.date}</span>
              </div>

              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-teal-600 hover:bg-neutral-800 dark:hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
              >
                <Download size={13} />
                <span>Download Report</span>
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-neutral-800 dark:text-slate-200 uppercase tracking-wider mb-1 text-[11px]">
                  1. Aim of the Experiment
                </h4>
                <p className="text-neutral-700 dark:text-slate-300 bg-neutral-50 dark:bg-slate-800/80 p-3 rounded-xl border border-neutral-200 dark:border-slate-700 leading-relaxed">
                  {activeReport.aim}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-800 dark:text-slate-200 uppercase tracking-wider mb-1 text-[11px]">
                  2. Apparatus & Tools Required
                </h4>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-slate-300 pl-1">
                  {activeReport.apparatus.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-neutral-800 dark:text-slate-200 uppercase tracking-wider mb-1 text-[11px]">
                  3. Experimental Procedure
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-neutral-700 dark:text-slate-300 pl-1">
                  {activeReport.procedure.map((step, i) => (
                    <li key={i} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-neutral-800 dark:text-slate-200 uppercase tracking-wider mb-1 text-[11px]">
                  4. Observations & Experimental Findings
                </h4>
                <p className="text-neutral-700 dark:text-slate-300 bg-neutral-50 dark:bg-slate-800/80 p-3 rounded-xl border border-neutral-200 dark:border-slate-700 leading-relaxed">
                  {activeReport.observations}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-800 dark:text-slate-200 uppercase tracking-wider mb-1 text-[11px]">
                  5. Conclusion
                </h4>
                <p className="text-emerald-900 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 leading-relaxed font-medium">
                  {activeReport.conclusions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {downloadToast && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 size={15} />
            <span>Practical report downloaded successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
