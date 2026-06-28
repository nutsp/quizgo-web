"use client";

import { cn } from "@/lib/utils";

export function QuestionNumberBadge({
  questionNo,
  className,
}: {
  questionNo: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-lg bg-teal-600 px-3 py-1 text-sm font-semibold text-white",
        className
      )}
    >
      ข้อ {questionNo}
    </span>
  );
}

export function QuestionHeading({
  questionNo,
  text,
  className,
}: {
  questionNo: number;
  text: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <QuestionNumberBadge questionNo={questionNo} />
      <h2 className="min-w-0 flex-1 text-lg font-semibold leading-8 text-slate-950">
        {text}
      </h2>
    </div>
  );
}

export function QuestionChoiceList({
  choices,
  onChoiceClick,
}: {
  choices: { key: string; text: string }[];
  onChoiceClick?: () => void;
}) {
  return (
    <div className="mt-4 space-y-3" aria-label="ตัวเลือกคำตอบ">
      {choices.map((choice) => (
        <div
          key={choice.key}
          className="flex gap-3 text-base leading-7 text-slate-900"
          onClick={onChoiceClick}
          onKeyDown={undefined}
          role={onChoiceClick ? "presentation" : undefined}
        >
          <span className="w-6 shrink-0 font-semibold">{choice.key}.</span>
          <span className="min-w-0 flex-1 break-words">{choice.text}</span>
        </div>
      ))}
    </div>
  );
}
