"use client";

import { ChevronDown } from "lucide-react";
import { QuestionReviewDetailPanel } from "@/components/results/QuestionReviewDetailPanel";
import { QuestionReviewStatusBadge } from "@/components/results/QuestionReviewStatusBadge";
import type { ReviewQuestion } from "@/lib/api/types";
import {
  getChoiceShortLabel,
  getQuestionStatus,
  truncateText,
} from "@/lib/results/transforms";
import { cn } from "@/lib/utils";

interface QuestionReviewAccordionProps {
  question: ReviewQuestion;
  isOpen: boolean;
  onToggle: () => void;
}

export function QuestionReviewAccordion({
  question,
  isOpen,
  onToggle,
}: QuestionReviewAccordionProps) {
  const status = getQuestionStatus(question);
  const selectedLabel = getChoiceShortLabel(question, question.selected_choice_key);
  const correctLabel = getChoiceShortLabel(question, question.correct_choice_key);

  return (
    <div
      id={`question-${question.question_no}`}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-xl border bg-white transition-colors",
        status === "correct" && "border-green-200",
        status === "wrong" && "border-red-200",
        status === "unanswered" && "border-amber-200"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
        aria-expanded={isOpen}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-900">ข้อ {question.question_no}</span>
            <QuestionReviewStatusBadge question={question} />
            {question.subject && (
              <span className="text-xs text-slate-500">{question.subject}</span>
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

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xs font-medium text-teal-700">
            {isOpen ? "ย่อ" : "ดูเฉลย"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {isOpen && <QuestionReviewDetailPanel question={question} variant="inline" />}
    </div>
  );
}
