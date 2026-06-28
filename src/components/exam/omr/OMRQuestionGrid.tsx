"use client";

import { Flag } from "lucide-react";
import { OMRBubble } from "@/components/exam/omr/OMRBubble";
import { CHOICE_LABELS, type ChoiceKey } from "@/lib/choices";
import { cn } from "@/lib/utils";
import type { OMRAnswer } from "@/components/exam/omr/types";

export type OMRQuestionGridProps = {
  answers: OMRAnswer[];
  currentQuestionNo: number;
  totalQuestions: number;
  readonly?: boolean;
  variant?: "sidebar" | "fullscreen";
  onSelectQuestion: (questionNo: number) => void;
  onSelectAnswer?: (questionNo: number, choiceKey: ChoiceKey) => void;
  className?: string;
};

function OMRQuestionRow({
  answer,
  isCurrent,
  readonly,
  bubbleSize,
  onSelectQuestion,
  onSelectAnswer,
}: {
  answer: OMRAnswer;
  isCurrent: boolean;
  readonly?: boolean;
  bubbleSize: "sm" | "md";
  onSelectQuestion: (questionNo: number) => void;
  onSelectAnswer?: (questionNo: number, choiceKey: ChoiceKey) => void;
}) {
  const isMarked = Boolean(answer.marked);
  const selected = answer.selected_choice_key ?? null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 border-b border-[#E2E8F0] px-1.5 py-1 transition-colors",
        isCurrent && "border-l-2 border-l-teal-700 bg-teal-50",
        !isCurrent && isMarked && "bg-amber-50",
        !isCurrent && !isMarked && "border-l-2 border-l-transparent"
      )}
      aria-current={isCurrent ? "true" : undefined}
    >
      <button
        type="button"
        onClick={() => onSelectQuestion(answer.question_no)}
        className={cn(
          "w-5 shrink-0 text-left font-mono text-[10px] tabular-nums hover:text-teal-700",
          isCurrent ? "font-bold text-teal-800" : "text-[#64748B]"
        )}
        aria-label={`ไปข้อ ${answer.question_no}`}
      >
        {answer.question_no}
      </button>

      <div className="flex flex-1 items-center justify-around">
        {CHOICE_LABELS.map((choice) => (
          <OMRBubble
            key={choice}
            questionNo={answer.question_no}
            choiceKey={choice}
            selected={selected === choice}
            readonly={readonly}
            size={bubbleSize}
            onComplete={onSelectAnswer}
          />
        ))}
      </div>

      {isMarked && (
        <Flag
          className="h-2.5 w-2.5 shrink-0 fill-amber-500 text-amber-500"
          aria-label="ทำเครื่องหมายไว้"
        />
      )}
      {!isMarked && <span className="w-2.5 shrink-0" aria-hidden />}
    </div>
  );
}

function columnCountClass(
  variant: "sidebar" | "fullscreen",
  totalQuestions: number
): string {
  if (variant === "fullscreen") {
    if (totalQuestions <= 30) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    if (totalQuestions <= 60) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
  }

  if (totalQuestions <= 50) return "grid-cols-1";
  return "grid-cols-1 min-[420px]:grid-cols-2";
}

export function OMRQuestionGrid({
  answers,
  currentQuestionNo,
  totalQuestions,
  readonly,
  variant = "sidebar",
  onSelectQuestion,
  onSelectAnswer,
  className,
}: OMRQuestionGridProps) {
  const bubbleSize = variant === "fullscreen" ? "md" : "sm";
  const items =
    answers.length > 0
      ? answers
      : Array.from({ length: totalQuestions }, (_, i) => ({
          question_no: i + 1,
          selected_choice_key: null,
          marked: false,
        }));

  return (
    <div
      className={cn(
        "grid gap-x-2",
        columnCountClass(variant, totalQuestions),
        className
      )}
      role="list"
      aria-label="ตารางคำตอบ"
    >
      {items.map((answer) => (
        <div key={answer.question_no} role="listitem">
          <OMRQuestionRow
            answer={answer}
            isCurrent={answer.question_no === currentQuestionNo}
            readonly={readonly}
            bubbleSize={bubbleSize}
            onSelectQuestion={onSelectQuestion}
            onSelectAnswer={onSelectAnswer}
          />
        </div>
      ))}
    </div>
  );
}
