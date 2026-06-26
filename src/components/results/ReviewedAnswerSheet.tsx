"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewQuestion } from "@/lib/api/types";
import { apiKeyToLabel, CHOICE_LABELS, type ChoiceKey } from "@/lib/choices";
import { cn } from "@/lib/utils";

type QuestionStatus = "correct" | "wrong" | "unanswered";

interface ReviewedAnswerSheetProps {
  questions: ReviewQuestion[];
}

function getQuestionStatus(question: ReviewQuestion): QuestionStatus {
  if (question.is_unanswered) return "unanswered";
  if (question.is_correct) return "correct";
  return "wrong";
}

const STATUS_LABEL: Record<QuestionStatus, string> = {
  correct: "ถูก",
  wrong: "ผิด",
  unanswered: "ไม่ตอบ",
};

const STATUS_CLASS: Record<QuestionStatus, string> = {
  correct: "text-success bg-success/10",
  wrong: "text-danger bg-danger/10",
  unanswered: "text-warning bg-warning/10",
};

interface ReviewBubbleProps {
  label: ChoiceKey;
  isSelected: boolean;
  isCorrect: boolean;
  status: QuestionStatus;
}

function ReviewBubble({ label, isSelected, isCorrect, status }: ReviewBubbleProps) {
  const showWrongRing = status === "wrong" && isSelected && !isCorrect;
  const showCorrectOutline = isCorrect && (!isSelected || status === "unanswered");
  const showFilled = isSelected && status !== "unanswered";

  return (
    <div className="flex flex-col items-center gap-0.5 px-0.5">
      <span
        className={cn(
          "text-[10px] font-medium leading-none",
          isSelected || isCorrect ? "font-bold text-foreground" : "text-muted"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "relative flex h-6 w-6 items-center justify-center rounded-full border md:h-5 md:w-5",
          showFilled && "border-[#111827] bg-[#111827]",
          showWrongRing && "ring-2 ring-danger ring-offset-1",
          showCorrectOutline && !showFilled && "border-success bg-success/10",
          !showFilled && !showCorrectOutline && "border-border bg-white"
        )}
      >
        {showFilled && <span className="h-1 w-1 rounded-full bg-white/40" />}
      </span>
    </div>
  );
}

function AnswerSheetRow({ question }: { question: ReviewQuestion }) {
  const status = getQuestionStatus(question);
  const selectedLabel = question.selected_choice_key
    ? apiKeyToLabel(question.selected_choice_key)
    : null;
  const correctLabel = apiKeyToLabel(question.correct_choice_key);

  const scrollToQuestion = () => {
    document.getElementById(`question-${question.question_no}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToQuestion}
      className={cn(
        "flex w-full items-center gap-2 border-l-[3px] px-2 py-1.5 text-left transition-colors hover:bg-slate-50",
        status === "correct" && "border-l-success",
        status === "wrong" && "border-l-danger",
        status === "unanswered" && "border-l-warning"
      )}
    >
      <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted">
        {question.question_no}
      </span>
      <div className="flex flex-1 items-center justify-around">
        {CHOICE_LABELS.map((label) => (
            <ReviewBubble
              key={label}
              label={label}
              isSelected={selectedLabel === label}
              isCorrect={correctLabel !== null && correctLabel === label}
              status={status}
            />
          ))}
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
          STATUS_CLASS[status]
        )}
      >
        {STATUS_LABEL[status]}
      </span>
    </button>
  );
}

export function ReviewedAnswerSheet({ questions }: ReviewedAnswerSheetProps) {
  if (questions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">กระดาษคำตอบ (ตรวจแล้ว)</CardTitle>
        <p className="text-sm text-muted">แตะข้อใดข้อหนึ่งเพื่อดูเฉลยรายละเอียด</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="w-6 shrink-0 text-center font-mono text-[10px] text-muted">#</span>
          <div className="flex flex-1 items-center justify-around">
            {CHOICE_LABELS.map((c) => (
              <span
                key={c}
                className="w-6 text-center font-mono text-[10px] font-semibold text-muted"
              >
                {c}
              </span>
            ))}
          </div>
          <span className="w-12 shrink-0 text-center text-[10px] text-muted">สถานะ</span>
        </div>
        <div className="max-h-80 divide-y divide-border/60 overflow-y-auto">
          {questions.map((question) => (
            <AnswerSheetRow key={question.question_no} question={question} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
