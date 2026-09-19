import { ShieldAlert, ArrowRight, X, UserCheck, GraduationCap } from "lucide-react";
import { UserProfile } from "../types";

interface UploadRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCourseRep: () => void;
  currentUser: UserProfile;
  contentType: "note" | "paper";
}

export function UploadRestrictedModal({
  isOpen,
  onClose,
  onSwitchToCourseRep,
  currentUser,
  contentType,
}: UploadRestrictedModalProps) {
  if (!isOpen) return null;

  const itemLabel = contentType === "note" ? "Course Lecture Notes" : "Past Examination Papers";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with warning accent */}
        <div className="bg-amber-500/10 border-b border-amber-200/70 px-6 py-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldAlert size={22} className="text-amber-700" />
          </div>
          <div className="flex-1 pr-2">
            <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Role Permission Notice
            </span>
            <h3 className="text-base font-bold text-neutral-900 mt-1">
              Course Rep Upload Access Only
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-neutral-800 font-semibold">
              <GraduationCap size={15} className="text-[#006d64]" />
              <span>Current Account: {currentUser.name} (Scholar / Student)</span>
            </div>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Cohort: <span className="font-semibold text-neutral-700">{currentUser.institutionName || "Institution"}</span> • <span className="font-semibold text-neutral-700">{currentUser.department}</span> • <span className="font-semibold text-neutral-700">{currentUser.level}</span>
            </p>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Per institutional policy for <strong className="text-neutral-800">{currentUser.department} ({currentUser.level})</strong>, only designated <strong>Course Representatives</strong> and <strong>Department Administrators</strong> are authorized to upload official {itemLabel} to prevent syllabus misalignment and unauthorized file pollution.
          </p>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-xs text-teal-900 space-y-1">
            <p className="font-bold text-[#006d64]">What Scholars (Students) can do:</p>
            <ul className="list-disc list-inside text-[11px] text-teal-800 space-y-0.5">
              <li>Study all official flashcard decks published by your Course Rep</li>
              <li>Practice Computer-Based Tests (CBT) with timed exam simulations</li>
              <li>Download past examination archives for revision</li>
            </ul>
          </div>

          {/* Quick Demo Switch CTA */}
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onSwitchToCourseRep();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <UserCheck size={14} />
              <span>Switch to Course Rep Demo Account</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-semibold text-xs transition-colors"
            >
              Close and Continue as Scholar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
