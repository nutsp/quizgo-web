"use client";

import { CHOICE_LABELS, type ChoiceKey } from "@/lib/choices";
import { cn } from "@/lib/utils";

export type OMRLegendProps = {
  className?: string;
};

export function OMRLegend({ className }: OMRLegendProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 border-b border-[#CBD5E1] bg-white px-2 py-1",
        className
      )}
      aria-hidden
    >
      <span className="w-5 shrink-0 text-center font-mono text-[9px] font-semibold text-[#64748B]">
        #
      </span>
      <div className="flex flex-1 items-center justify-around">
        {CHOICE_LABELS.map((choice: ChoiceKey) => (
          <span
            key={choice}
            className="min-w-[2.75rem] text-center font-mono text-[9px] font-semibold text-[#64748B]"
          >
            {choice}
          </span>
        ))}
      </div>
    </div>
  );
}
