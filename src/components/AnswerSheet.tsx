"use client";

import type { ChoiceKey } from "@/data/questions";
import { cn } from "@/lib/utils";

const CHOICES: ChoiceKey[] = ["ก", "ข", "ค", "ง"];

interface AnswerSheetProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, ChoiceKey | null>;
  markedQuestions: number[];
  onQuestionSelect: (question: number) => void;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  compact?: boolean;
}

export function AnswerSheet({
  totalQuestions,
  currentQuestion,
  answers,
  markedQuestions,
  onQuestionSelect,
  answeredCount,
  unansweredCount,
  markedCount,
  compact = false,
}: AnswerSheetProps) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-4")}>
      <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-xs text-muted sm:grid-cols-3">
        <span>ตอบแล้ว: <strong className="text-success">{answeredCount}</strong></span>
        <span>ยังไม่ตอบ: <strong className="text-muted">{unansweredCount}</strong></span>
        <span>ทำเครื่องหมาย: <strong className="text-warning">{markedCount}</strong></span>
      </div>

      <div
        className={cn(
          "overflow-y-auto rounded-xl border border-border bg-background p-3",
          compact ? "max-h-[50vh]" : "max-h-[calc(100vh-280px)]"
        )}
      >
        <div className="space-y-1">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const qNum = i + 1;
            const answer = answers[qNum];
            const isCurrent = qNum === currentQuestion;
            const isMarked = markedQuestions.includes(qNum);

            return (
              <button
                key={qNum}
                type="button"
                onClick={() => onQuestionSelect(qNum)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors hover:bg-surface",
                  isCurrent && "bg-primary/10 ring-1 ring-primary/30"
                )}
              >
                <span
                  className={cn(
                    "w-7 shrink-0 text-xs font-semibold",
                    isCurrent ? "text-primary" : "text-muted"
                  )}
                >
                  {qNum}
                </span>
                <div className="flex flex-1 gap-1">
                  {CHOICES.map((choice) => (
                    <span
                      key={choice}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-medium transition-colors",
                        answer === choice
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface text-muted"
                      )}
                    >
                      {choice}
                    </span>
                  ))}
                </div>
                {isMarked && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-warning" title="ทำเครื่องหมาย" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
