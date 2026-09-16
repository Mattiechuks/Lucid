import { CheckCircle2, AlertCircle, Loader2, Clock } from "lucide-react";
import { GenerationStatus } from "../types";

interface StatusBadgeProps {
  status: GenerationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
          <Clock size={11} className="text-neutral-500" />
          Queued
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
          <Loader2 size={11} className="animate-spin text-blue-600" />
          Generating…
        </span>
      );
    case "READY":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <CheckCircle2 size={11} className="text-emerald-600" />
          Ready
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
          <AlertCircle size={11} className="text-rose-600" />
          Failed
        </span>
      );
    default:
      return null;
  }
}
