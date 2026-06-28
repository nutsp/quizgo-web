"use client";

import { OMRBubble } from "@/components/exam/omr/OMRBubble";
import { getChoiceDisplayLabels } from "@/lib/exam/answerSheetLayout";
import { CHOICE_LABELS, type ChoiceKey } from "@/lib/choices";
import { cn } from "@/lib/utils";
import type { OMRAnswer } from "@/components/exam/omr/types";

export type OMRBlockProps = {
  questionNumbers: number[];
  currentQuestionNo: number;
  answers: OMRAnswer[];
  choiceLabelStyle?: "thai" | "english";
  onSelectQuestion: (questionNo: number) => void;
  onSelectAnswer?: (questionNo: number, choiceKey: ChoiceKey) => void;
  readonly?: boolean;
  compact?: boolean;
  mobile?: boolean;
};

function answerByQuestionNo(
  answers: OMRAnswer[],
  questionNo: number
): OMRAnswer {
  return (
    answers.find((a) => a.question_no === questionNo) ?? {
      question_no: questionNo,
      selected_choice_key: null,
      marked: false,
    }
  );
}

export function OMRBlock({
  questionNumbers,
  currentQuestionNo,
  answers,
  choiceLabelStyle = "thai",
  onSelectQuestion,
  onSelectAnswer,
  readonly = false,
  compact = false,
  mobile = false,
}: OMRBlockProps) {
  const headerLabels = getChoiceDisplayLabels(choiceLabelStyle);
  const rowGridClass = "grid-cols-[36px_repeat(4,1fr)]";

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-300 bg-white">
      <div
        className={cn(
          "grid border-b border-slate-300 bg-slate-50 px-2 py-2 text-center text-sm font-bold text-slate-900",
          rowGridClass
        )}
        aria-hidden
      >
        <span />
        {headerLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      {questionNumbers.map((questionNo) => {
        const answer = answerByQuestionNo(answers, questionNo);
        const isCurrent = questionNo === currentQuestionNo;
        const isMarked = Boolean(answer.marked);
        const selected = answer.selected_choice_key ?? null;

        return (
          <div
            key={questionNo}
            data-omr-row={questionNo}
            className={cn(
              "grid items-center px-2 text-center",
              mobile ? "py-3" : "py-2",
              rowGridClass,
              isCurrent && "border-l-4 border-l-teal-600 bg-teal-50",
              !isCurrent && isMarked && "bg-amber-50"
            )}
            aria-current={isCurrent ? "true" : undefined}
          >
            <button
              type="button"
              onClick={() => onSelectQuestion(questionNo)}
              className={cn(
                "text-left text-sm font-semibold tabular-nums hover:text-teal-700",
                isCurrent ? "text-teal-800" : "text-slate-700"
              )}
              aria-label={`ไปข้อ ${questionNo}`}
            >
              {questionNo}
            </button>

            {CHOICE_LABELS.map((choice) => (
              <div key={choice} className="flex min-w-0 justify-center">
                <OMRBubble
                  questionNo={questionNo}
                  choiceKey={choice}
                  selected={selected === choice}
                  readonly={readonly}
                  mode="block"
                  compact={compact}
                  mobile={mobile}
                  onComplete={onSelectAnswer}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
