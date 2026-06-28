"use client";

import { OMRBlock } from "@/components/exam/omr/OMRBlock";
import {
  chunkQuestions,
  resolveOMRLayout,
  type AnswerSheetLayoutConfig,
  type OMRGridVariant,
} from "@/lib/exam/answerSheetLayout";
import type { ChoiceKey } from "@/lib/choices";
import { cn } from "@/lib/utils";
import type { OMRAnswer } from "@/components/exam/omr/types";

export type OMRBlockGridProps = {
  answers: OMRAnswer[];
  totalQuestions: number;
  currentQuestionNo: number;
  readonly?: boolean;
  variant?: OMRGridVariant;
  layoutConfig?: AnswerSheetLayoutConfig;
  onSelectQuestion: (questionNo: number) => void;
  onSelectAnswer?: (questionNo: number, choiceKey: ChoiceKey) => void;
  className?: string;
};

function blockGridColumnCount(
  blockColumns: number,
  variant: OMRGridVariant
): number {
  if (variant === "drawer" || variant === "mobile" || variant === "preview") return 1;
  return Math.min(4, Math.max(1, blockColumns));
}

export function OMRBlockGrid({
  answers,
  totalQuestions,
  currentQuestionNo,
  readonly,
  variant = "compact",
  layoutConfig,
  onSelectQuestion,
  onSelectAnswer,
  className,
}: OMRBlockGridProps) {
  const layout = resolveOMRLayout(totalQuestions, layoutConfig);
  const blocks = chunkQuestions(totalQuestions, layout.questions_per_block);
  const columnCount = blockGridColumnCount(layout.block_columns, variant);
  const isMobile = variant === "mobile";
  const compact = !isMobile && layout.block_columns >= 4;

  return (
    <div
      className={cn(
        "grid min-w-0 gap-3",
        compact ? "gap-2" : "gap-3 sm:gap-4",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
      role="list"
      aria-label="กลุ่มคำตอบ OMR"
    >
      {blocks.map((questionNumbers, index) => (
        <div key={questionNumbers[0] ?? index} className="min-w-0" role="listitem">
          <OMRBlock
            questionNumbers={questionNumbers}
            currentQuestionNo={currentQuestionNo}
            answers={answers}
            readonly={readonly}
            compact={compact}
            mobile={isMobile}
            choiceLabelStyle={layout.choice_label_style}
            onSelectQuestion={onSelectQuestion}
            onSelectAnswer={onSelectAnswer}
          />
        </div>
      ))}
    </div>
  );
}
