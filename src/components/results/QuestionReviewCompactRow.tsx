"use client";

import { ChevronRight } from "lucide-react";
import type { ReviewQuestion } from "@/lib/api/types";
import {
  getChoiceShortLabel,
  getQuestionStatus,
  truncateText,
} from "@/lib/results/transforms";
import { cn } from "@/lib/utils";
import { QuestionReviewStatusBadge } from "@/components/results/QuestionReviewStatusBadge";

interface QuestionReviewCompactRowProps {
  question: ReviewQuestion;
  isSelected: boolean;
  onSelect: () => void;
}

export function QuestionReviewCompactRow({
  question,
  isSelected,
  onSelect,
}: QuestionReviewCompactRowProps) {
  const status = getQuestionStatus(question);
  const selectedLabel = getChoiceShortLabel(question, question.selected_choice_key);
  const correctLabel = getChoiceShortLabel(question, question.correct_choice_key);

  return (
    <button
      type="button"
      id={`question-${question.question_no}`}
      onClick={onSelect}
      className={cn(
        "scroll-mt-24 flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
        isSelected
          ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
        !isSelected && status === "correct" && "border-green-100",
        !isSelected && status === "wrong" && "border-red-100",
        !isSelected && status === "unanswered" && "border-amber-100"
      )}
      aria-pressed={isSelected}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-900">ข้อ {question.question_no}</span>
          <QuestionReviewStatusBadge question={question} />
          {question.subject && (
            <span className="truncate text-xs text-slate-500">{question.subject}</span>
          )}
        </div>

        <p className="line-clamp-1 text-sm text-slate-700">
          {truncateText(question.question_text, 90)}
        </p>

        <p className="text-xs text-slate-500">
          คุณตอบ:{" "}
          <span
            className={cn(
              "font-semibold",
              status === "correct" && "text-green-600",
              status === "wrong" && "text-red-600",
              status === "unanswered" && "text-amber-600"
            )}
          >
            {status === "unanswered" ? "ไม่ได้ตอบ" : selectedLabel}
          </span>
          <span className="mx-1.5 text-slate-300">·</span>
          เฉลย: <span className="font-semibold text-green-600">{correctLabel}</span>
        </p>
      </div>

      <ChevronRight
        className={cn(
          "mt-1 h-4 w-4 shrink-0 text-slate-400",
          isSelected && "text-teal-700"
        )}
      />
    </button>
  );
}
