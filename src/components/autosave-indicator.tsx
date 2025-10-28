import { CheckCircle2, RefreshCcw } from "lucide-react";

export function AutosaveIndicator({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error";
}) {
  const states = {
    idle: { label: "Autosave ready", icon: RefreshCcw, color: "text-slate-500" },
    saving: { label: "Saving…", icon: RefreshCcw, color: "text-brandTeal-600 animate-spin" },
    saved: { label: "All changes saved", icon: CheckCircle2, color: "text-green-600" },
    error: { label: "Unable to save", icon: RefreshCcw, color: "text-red-600" },
  } as const;

  const state = states[status];
  const Icon = state.icon;

  return (
    <div className="flex items-center gap-2 text-sm text-slate-500" aria-live="polite">
      <Icon className={state.color} size={16} aria-hidden="true" />
      <span>{state.label}</span>
    </div>
  );
}
