"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChoiceKey } from "@/data/questions";
import { cn } from "@/lib/utils";

const FILL_COLOR = "#111827";
const DEFAULT_HOLD_DURATION = 650;

export type HoldToFillBubbleProps = {
  questionNo: number;
  choiceKey: ChoiceKey;
  label: string;
  selected: boolean;
  disabled?: boolean;
  holdDuration?: number;
  /** compact = 24px desktop; default responsive 28px mobile / 24px desktop */
  size?: "responsive" | "fixed-sm";
  showLabel?: boolean;
  className?: string;
  onComplete: (questionNo: number, choiceKey: ChoiceKey) => void;
};

export function useHoldToFill({
  holdDuration = DEFAULT_HOLD_DURATION,
  disabled = false,
  onComplete,
}: {
  holdDuration?: number;
  disabled?: boolean;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const resetProgress = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    setIsHolding(false);
    if (!completedRef.current) {
      setProgress(0);
    }
    completedRef.current = false;
  }, []);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;

    const elapsed = performance.now() - startTimeRef.current;
    const nextProgress = Math.min(100, (elapsed / holdDuration) * 100);
    setProgress(nextProgress);

    if (nextProgress >= 100) {
      completedRef.current = true;
      onComplete();
      resetProgress();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [holdDuration, onComplete, resetProgress]);

  const startHold = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;

      e.preventDefault();
      e.stopPropagation();

      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // pointer capture may fail in some environments
      }

      completedRef.current = false;
      setIsHolding(true);
      startTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    },
    [disabled, tick]
  );

  const endHold = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      resetProgress();
    },
    [resetProgress]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onComplete();
      }
    },
    [disabled, onComplete]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    progress,
    isHolding,
    startHold,
    endHold,
    handleKeyDown,
  };
}

export function HoldToFillBubble({
  questionNo,
  choiceKey,
  label,
  selected,
  disabled = false,
  holdDuration = DEFAULT_HOLD_DURATION,
  size = "responsive",
  showLabel = true,
  className,
  onComplete,
}: HoldToFillBubbleProps) {
  const [pendingFill, setPendingFill] = useState(false);

  const handleComplete = useCallback(() => {
    setPendingFill(true);
    onComplete(questionNo, choiceKey);
  }, [onComplete, questionNo, choiceKey]);

  useEffect(() => {
    if (selected) setPendingFill(false);
  }, [selected]);

  const { progress, isHolding, startHold, endHold, handleKeyDown } = useHoldToFill({
    holdDuration,
    disabled: disabled || selected,
    onComplete: handleComplete,
  });

  const fillHeight = selected || pendingFill ? 100 : progress;

  const bubbleSizeClass =
    size === "fixed-sm"
      ? "h-6 w-6"
      : "h-7 w-7 md:h-6 md:w-6";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-md px-1 py-0.5 touch-none select-none",
        disabled && "pointer-events-none opacity-60",
        className
      )}
    >
      {showLabel && (
        <span
          className={cn(
            "text-[10px] font-medium leading-none",
            selected ? "font-bold text-foreground" : "text-muted"
          )}
        >
          {label}
        </span>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`ฝนคำตอบ ข้อ ${questionNo} ตัวเลือก ${label}`}
        aria-pressed={selected}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative rounded-full transition-transform duration-150",
          bubbleSizeClass,
          isHolding && !selected && "scale-110",
          !disabled && !selected && "cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-full border bg-white",
            selected ? "border-[#111827]" : "border-border",
            isHolding && !selected && "border-foreground/40"
          )}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${fillHeight}%`,
              backgroundColor: FILL_COLOR,
              transition: isHolding || selected ? "none" : "height 150ms ease-out",
            }}
          />
        </div>

        {selected && (
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30" />
        )}
      </div>
    </div>
  );
}

/** Larger bubble visual for question panel rows (shared fill rendering) */
export function HoldToFillBubbleVisual({
  selected,
  progress,
  isHolding,
  sizeClass = "h-7 w-7 md:h-8 md:w-8",
}: {
  selected: boolean;
  progress: number;
  isHolding: boolean;
  sizeClass?: string;
}) {
  const fillHeight = selected ? 100 : progress;

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full transition-transform duration-150",
        sizeClass,
        isHolding && !selected && "scale-110"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-full border-2 bg-white",
          selected ? "border-[#111827]" : "border-border",
          isHolding && !selected && "border-foreground/40"
        )}
      >
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: `${fillHeight}%`,
            backgroundColor: FILL_COLOR,
            transition: isHolding || selected ? "none" : "height 150ms ease-out",
          }}
        />
      </div>
      {selected && (
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30" />
      )}
    </div>
  );
}
