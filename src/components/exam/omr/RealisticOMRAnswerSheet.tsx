"use client";

import { useMemo, type Ref } from "react";
import { OMRBlockGrid } from "@/components/exam/omr/OMRBlockGrid";
import { OMRCompactHeader } from "@/components/exam/omr/OMRCompactHeader";
import { OMRHeader } from "@/components/exam/omr/OMRHeader";
import { OMRInstructions } from "@/components/exam/omr/OMRInstructions";
import type { OMRAnswer } from "@/components/exam/omr/types";
import {
  normalizeLayoutConfig,
  type AnswerSheetLayoutConfig,
} from "@/lib/exam/answerSheetLayout";
import type { ChoiceKey } from "@/lib/choices";
import { cn } from "@/lib/utils";

export type { OMRAnswer } from "@/components/exam/omr/types";

export type OMRVariant =
  | "compact"
  | "sidebar"
  | "full"
  | "print"
  | "fullscreen"
  | "drawer"
  | "mobile"
  | "preview";

export type RealisticOMRAnswerSheetProps = {
  examTitle: string;
  examSetCode?: string;
  candidateName?: string;
  candidateNo?: string;
  totalQuestions: number;
  currentQuestionNo: number;
  answers: OMRAnswer[];
  layoutConfig?: AnswerSheetLayoutConfig;
  onSelectQuestion: (questionNo: number) => void;
  onSelectAnswer?: (questionNo: number, choiceKey: ChoiceKey) => void;
  readonly?: boolean;
  variant?: OMRVariant;
  showInstructions?: boolean;
  hint?: string;
  fillContainer?: boolean;
  showSummary?: boolean;
  scrollContainerRef?: Ref<HTMLDivElement>;
  className?: string;
};

function isCompactVariant(variant: OMRVariant): boolean {
  return (
    variant === "compact" ||
    variant === "sidebar" ||
    variant === "drawer" ||
    variant === "mobile" ||
    variant === "fullscreen"
  );
}

function OMRInstructionStrip({ text }: { text: string }) {
  return (
    <div className="shrink-0 px-5 pt-4">
      <div className="rounded-xl bg-teal-50 px-4 py-2 text-center text-sm font-medium text-teal-700">
        {text}
      </div>
    </div>
  );
}

function AnswerSummary({
  answeredCount,
  unansweredCount,
  markedCount,
}: {
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
}) {
  return (
    <div className="grid shrink-0 grid-cols-3 divide-x divide-slate-200 border-b border-slate-200">
      <div className="px-4 py-3 text-center">
        <div className="text-lg font-bold text-green-600">{answeredCount}</div>
        <div className="mt-1 text-xs text-slate-500">ตอบแล้ว</div>
      </div>
      <div className="px-4 py-3 text-center">
        <div className="text-lg font-bold text-slate-700">{unansweredCount}</div>
        <div className="mt-1 text-xs text-slate-500">ยังไม่ตอบ</div>
      </div>
      <div className="px-4 py-3 text-center">
        <div className="text-lg font-bold text-amber-500">{markedCount}</div>
        <div className="mt-1 text-xs text-slate-500">ทำเครื่องหมาย</div>
      </div>
    </div>
  );
}

export function RealisticOMRAnswerSheet({
  examTitle,
  examSetCode,
  candidateName,
  candidateNo,
  totalQuestions,
  currentQuestionNo,
  answers,
  layoutConfig,
  onSelectQuestion,
  onSelectAnswer,
  readonly = false,
  variant = "compact",
  showInstructions,
  hint,
  fillContainer = false,
  showSummary = true,
  scrollContainerRef,
  className,
}: RealisticOMRAnswerSheetProps) {
  const layout = normalizeLayoutConfig(layoutConfig);
  const compact = isCompactVariant(variant);

  const { answeredCount, unansweredCount, markedCount } = useMemo(() => {
    if (!showSummary) {
      return { answeredCount: 0, unansweredCount: 0, markedCount: 0 };
    }
    let answered = 0;
    let marked = 0;
    for (const a of answers) {
      if (a.selected_choice_key) answered += 1;
      if (a.marked) marked += 1;
    }
    const total = totalQuestions || answers.length;
    return {
      answeredCount: answered,
      unansweredCount: Math.max(0, total - answered),
      markedCount: marked,
    };
  }, [answers, totalQuestions, showSummary]);

  const handleSelectAnswer = (questionNo: number, choiceKey: ChoiceKey) => {
    onSelectAnswer?.(questionNo, choiceKey);
    onSelectQuestion(questionNo);
  };

  const instructionsVisible =
    !compact &&
    (showInstructions ?? layout.show_instructions) &&
    variant !== "fullscreen";

  const showFullHeader = !compact && layout.show_header;

  const showCompactHeader =
    compact && variant !== "drawer" && variant !== "mobile" && variant !== "preview";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm",
        fillContainer && "h-full min-h-0",
        compact &&
          variant !== "drawer" &&
          variant !== "mobile" &&
          variant !== "preview" &&
          !fillContainer &&
          "min-h-[520px] max-h-[calc(100vh-7rem)]",
        variant !== "drawer" &&
          variant !== "mobile" &&
          variant !== "preview" &&
          !compact &&
          !fillContainer &&
          "max-h-[calc(100vh-7rem)]",
        variant === "mobile" && "min-h-0 max-h-none rounded-none border-0 shadow-none",
        className
      )}
    >
      {showCompactHeader ? (
        <OMRCompactHeader examTitle={examTitle} />
      ) : (
        showFullHeader && (
          <OMRHeader
            examTitle={examTitle}
            examSetCode={examSetCode}
            showCandidateInfo={layout.show_candidate_info}
            candidateName={candidateName}
            candidateNo={candidateNo}
          />
        )
      )}

      {instructionsVisible && <OMRInstructions />}

      {showSummary && (
        <AnswerSummary
          answeredCount={answeredCount}
          unansweredCount={unansweredCount}
          markedCount={markedCount}
        />
      )}

      {showCompactHeader && hint && <OMRInstructionStrip text={hint} />}

      <div
        ref={scrollContainerRef}
        className={cn(
          "min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
          variant === "preview" ? "p-2" : fillContainer ? "px-5 py-4" : "px-4 py-4"
        )}
      >
        <div className={cn(fillContainer && "mx-auto w-full max-w-full")}>
          <OMRBlockGrid
          answers={answers}
          totalQuestions={totalQuestions}
          currentQuestionNo={currentQuestionNo}
          readonly={readonly}
          variant={variant}
          layoutConfig={layoutConfig}
          onSelectQuestion={onSelectQuestion}
          onSelectAnswer={handleSelectAnswer}
        />
        </div>
      </div>
    </div>
  );
}
