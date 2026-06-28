"use client";

import { useCallback, useEffect, useState } from "react";
import { useHoldToFill } from "@/components/HoldToFillBubble";
import type { ChoiceKey } from "@/lib/choices";
import { cn } from "@/lib/utils";

const FILL_COLOR = "#020617";

export type OMRBubbleProps = {
  questionNo: number;
  choiceKey: ChoiceKey;
  selected: boolean;
  readonly?: boolean;
  /** inline = label + bubble (legacy row); block = bubble only in OMR grid */
  mode?: "inline" | "block";
  size?: "sm" | "md";
  /** Smaller bubble for 4-column OMR layouts */
  compact?: boolean;
  /** Larger touch target for mobile bottom sheet */
  mobile?: boolean;
  /** Override aria label display (e.g. A vs ก) */
  displayLabel?: string;
  onComplete?: (questionNo: number, choiceKey: ChoiceKey) => void;
};

const SIZE_CLASS = {
  sm: "h-[18px] w-[18px] sm:h-5 sm:w-5",
  md: "h-5 w-5 sm:h-6 sm:w-6",
} as const;

export function OMRBubble({
  questionNo,
  choiceKey,
  selected,
  readonly = false,
  mode = "block",
  size = "sm",
  compact = false,
  mobile = false,
  displayLabel,
  onComplete,
}: OMRBubbleProps) {
  const [pendingFill, setPendingFill] = useState(false);

  const handleComplete = useCallback(() => {
    if (readonly || !onComplete) return;
    setPendingFill(true);
    onComplete(questionNo, choiceKey);
  }, [readonly, onComplete, questionNo, choiceKey]);

  useEffect(() => {
    if (selected) setPendingFill(false);
  }, [selected]);

  const { progress, isHolding, startHold, endHold, handleKeyDown } = useHoldToFill({
    disabled: readonly || selected,
    onComplete: handleComplete,
  });

  const filled = selected || pendingFill;
  const fillHeight = filled ? 100 : progress;
  const ariaChoice = displayLabel ?? choiceKey;

  const bubbleSize =
    mode === "block"
      ? mobile
        ? "h-7 w-7"
        : compact
          ? "h-5 w-5"
          : "h-6 w-6"
      : SIZE_CLASS[size];

  const bubble = (
    <div
      role={readonly ? undefined : "button"}
      tabIndex={readonly ? undefined : 0}
      aria-label={`ข้อ ${questionNo} ตัวเลือก ${ariaChoice}`}
      aria-pressed={selected}
      onPointerDown={readonly ? undefined : startHold}
      onPointerUp={readonly ? undefined : endHold}
      onPointerLeave={readonly ? undefined : endHold}
      onPointerCancel={readonly ? undefined : endHold}
      onKeyDown={readonly ? undefined : handleKeyDown}
      className={cn(
        "relative rounded-full border-2 transition-transform touch-none select-none",
        bubbleSize,
        filled
          ? "border-slate-950 bg-slate-950"
          : "border-slate-300 bg-white",
        isHolding && !filled && "scale-110 border-slate-400",
        !readonly && !filled && "cursor-pointer",
        !readonly &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-1"
      )}
    >
      {!filled && fillHeight > 0 && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${fillHeight}%`,
              backgroundColor: FILL_COLOR,
              transition: isHolding ? "none" : "height 150ms ease-out",
            }}
          />
        </div>
      )}
      {filled && (
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30" />
      )}
    </div>
  );

  if (mode === "block") {
    return (
      <div
        className="flex touch-none select-none justify-center"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {bubble}
      </div>
    );
  }

  return (
    <div
      className="flex touch-none select-none items-center gap-0.5"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <span
        className={cn(
          "text-[9px] font-medium leading-none",
          selected ? "font-bold text-[#0F172A]" : "text-[#64748B]"
        )}
      >
        {choiceKey}
      </span>
      {bubble}
    </div>
  );
}
