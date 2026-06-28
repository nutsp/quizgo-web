import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReviewQuestion } from "@/lib/api/types";
import { QuestionReviewStatusBadge } from "@/components/results/QuestionReviewStatusBadge";
import { cn } from "@/lib/utils";

function getChoiceLabel(choice: ReviewQuestion["choices"][number]) {
  if (choice.is_correct && choice.is_selected) {
    return "คุณตอบ / คำตอบที่ถูก";
  }
  if (choice.is_correct) {
    return "คำตอบที่ถูก";
  }
  if (choice.is_selected) {
    return "คุณตอบ";
  }
  return null;
}

interface QuestionReviewDetailPanelProps {
  question: ReviewQuestion;
  variant?: "inline" | "panel";
  onClose?: () => void;
}

export function QuestionReviewDetailPanel({
  question,
  variant = "inline",
  onClose,
}: QuestionReviewDetailPanelProps) {
  const isPanel = variant === "panel";

  return (
    <div
      className={cn(
        "space-y-3",
        isPanel ? "p-4" : "border-t border-slate-100 px-4 pb-4 pt-3"
      )}
    >
      {isPanel && (
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">ข้อ {question.question_no}</h3>
              <QuestionReviewStatusBadge question={question} />
            </div>
            {question.subject && (
              <p className="text-xs text-slate-500">{question.subject}</p>
            )}
          </div>
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 shrink-0 p-0"
              onClick={onClose}
              aria-label="ปิดรายละเอียด"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <p className="text-sm leading-relaxed text-slate-900">{question.question_text}</p>

      {!isPanel && (question.subject || (question.tags ?? []).length > 0) && (
        <div className="flex flex-wrap gap-2">
          {question.subject && (
            <Badge variant="outline" className="font-normal">
              {question.subject}
            </Badge>
          )}
          {(question.tags ?? []).map((tag) => (
            <Badge
              key={tag.code}
              variant="secondary"
              className="bg-slate-100 font-normal text-slate-700"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {isPanel && (question.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(question.tags ?? []).map((tag) => (
            <Badge
              key={tag.code}
              variant="secondary"
              className="bg-slate-100 font-normal text-slate-700"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {question.is_unanswered && (
        <p className="text-sm font-medium text-amber-600">คุณไม่ได้ตอบข้อนี้</p>
      )}

      <div className="space-y-2">
        {question.choices.map((choice) => {
          const tag = getChoiceLabel(choice);
          const isHighlighted = choice.is_selected || choice.is_correct;

          return (
            <div
              key={choice.choice_key}
              className={cn(
                "rounded-lg border p-2.5 text-sm",
                choice.is_correct && "border-green-200 bg-green-50",
                choice.is_selected && !choice.is_correct && "border-red-200 bg-red-50",
                !isHighlighted && "border-slate-200 bg-white"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="leading-relaxed text-slate-900">
                  <span className="font-semibold">{choice.choice_label}.</span>{" "}
                  {choice.choice_text}
                </p>
                {tag && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                      choice.is_correct && "bg-green-100 text-green-700",
                      choice.is_selected && !choice.is_correct && "bg-red-100 text-red-700"
                    )}
                  >
                    {tag}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {question.explanation && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">คำอธิบาย</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-900">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
