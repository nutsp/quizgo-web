"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewQuestion } from "@/lib/api/types";
import { apiKeyToLabel, CHOICE_LABELS, type ChoiceKey } from "@/lib/choices";
import { getQuestionStatus } from "@/lib/results/transforms";
import { cn } from "@/lib/utils";

interface ReviewedAnswerSheetProps {
  questions: ReviewQuestion[];
  onQuestionSelect?: (questionNo: number) => void;
}

const STATUS_LABEL = {
  correct: "ตอบถูก",
  wrong: "ตอบผิด",
  unanswered: "ไม่ตอบ",
} as const;

const STATUS_CLASS = {
  correct: "text-green-600 bg-green-50",
  wrong: "text-red-600 bg-red-50",
  unanswered: "text-amber-600 bg-amber-50",
} as const;

interface ReviewBubbleProps {
  label: ChoiceKey;
  isSelected: boolean;
  isCorrect: boolean;
  status: ReturnType<typeof getQuestionStatus>;
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
          isSelected || isCorrect ? "font-bold text-slate-900" : "text-slate-400"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "relative flex h-5 w-5 items-center justify-center rounded-full border",
          showFilled && "border-[#111827] bg-[#111827]",
          showWrongRing && "ring-2 ring-red-600 ring-offset-1",
          showCorrectOutline && !showFilled && "border-green-600 bg-green-50",
          !showFilled && !showCorrectOutline && "border-slate-200 bg-white"
        )}
      >
        {showFilled && <span className="h-1 w-1 rounded-full bg-white/40" />}
      </span>
    </div>
  );
}

function AnswerSheetRow({
  question,
  onSelect,
}: {
  question: ReviewQuestion;
  onSelect?: (questionNo: number) => void;
}) {
  const status = getQuestionStatus(question);
  const selectedLabel = question.selected_choice_key
    ? apiKeyToLabel(question.selected_choice_key)
    : null;
  const correctLabel = apiKeyToLabel(question.correct_choice_key);

  const handleClick = () => {
    onSelect?.(question.question_no);
    document.getElementById(`question-${question.question_no}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 border-l-[3px] px-2 py-1.5 text-left transition-colors hover:bg-slate-50",
        status === "correct" && "border-l-green-600",
        status === "wrong" && "border-l-red-600",
        status === "unanswered" && "border-l-amber-500"
      )}
    >
      <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-slate-500">
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

export function ReviewedAnswerSheet({ questions, onQuestionSelect }: ReviewedAnswerSheetProps) {
  if (questions.length === 0) return null;

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-900">
          กระดาษคำตอบ (ตรวจแล้ว)
        </CardTitle>
        <p className="text-sm text-slate-500">แตะข้อใดข้อหนึ่งเพื่อดูเฉลยรายละเอียด</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-wrap gap-3 border-b border-slate-200 px-4 py-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-green-600 bg-green-50" />
            ตอบถูก
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-red-600 ring-2 ring-red-600 ring-offset-1" />
            ตอบผิด
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-slate-300 bg-white" />
            ไม่ตอบ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-green-600 bg-green-50" />
            คำตอบที่ถูก
          </span>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
          <span className="w-6 shrink-0 text-center font-mono text-[10px] text-slate-400">#</span>
          <div className="flex flex-1 items-center justify-around">
            {CHOICE_LABELS.map((c) => (
              <span
                key={c}
                className="w-6 text-center font-mono text-[10px] font-semibold text-slate-400"
              >
                {c}
              </span>
            ))}
          </div>
          <span className="w-14 shrink-0 text-center text-[10px] text-slate-400">สถานะ</span>
        </div>

        <div className="max-h-64 divide-y divide-slate-100 overflow-y-auto">
          {questions.map((question) => (
            <AnswerSheetRow
              key={question.question_no}
              question={question}
              onSelect={onQuestionSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
