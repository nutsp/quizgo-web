"use client";

import { cn } from "@/lib/utils";

export type QuestionPaperMode = "focus" | "paper";

export interface QuestionPaperModeToggleProps {
  mode: QuestionPaperMode;
  onModeChange: (mode: QuestionPaperMode) => void;
  className?: string;
}

const MODES: { value: QuestionPaperMode; label: string }[] = [
  { value: "focus", label: "ทีละข้อ" },
  { value: "paper", label: "ทั้งฉบับ" },
];

export function QuestionPaperModeToggle({
  mode,
  onModeChange,
  className,
}: QuestionPaperModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1",
        className
      )}
      role="group"
      aria-label="โหมดกระดาษข้อสอบ"
    >
      {MODES.map(({ value, label }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onModeChange(value)}
            aria-pressed={active}
            aria-label={value === "focus" ? "โหมดทีละข้อ" : "โหมดกระดาษข้อสอบ"}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
