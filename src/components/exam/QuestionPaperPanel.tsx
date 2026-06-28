"use client";

import type { Question } from "@/data/questions";
import { ExamPanelHeader } from "@/components/exam/ExamPanelHeader";
import {
  QuestionPaperFocusFooter,
  QuestionPaperFocusView,
} from "@/components/exam/QuestionPaperFocusView";
import { QuestionPaperFullView } from "@/components/exam/QuestionPaperFullView";
import {
  QuestionPaperModeToggle,
  type QuestionPaperMode,
} from "@/components/exam/QuestionPaperModeToggle";
import { cn } from "@/lib/utils";

export type { QuestionPaperMode };

export interface QuestionPaperPanelProps {
  mode: QuestionPaperMode;
  onModeChange: (mode: QuestionPaperMode) => void;
  questions: Question[];
  currentQuestionNo: number;
  markedQuestions: number[];
  onPrevious: () => void;
  onNext: () => void;
  onToggleMark: () => void;
  examTitle?: string;
  className?: string;
}

export function QuestionPaperPanel({
  mode,
  onModeChange,
  questions,
  currentQuestionNo,
  markedQuestions,
  onPrevious,
  onNext,
  onToggleMark,
  className,
}: QuestionPaperPanelProps) {
  const currentQuestion = questions.find((q) => q.id === currentQuestionNo);
  const marked = markedQuestions.includes(currentQuestionNo);
  const questionPaperSubtitle =
    mode === "focus"
      ? `ข้อ ${currentQuestionNo} / ${questions.length}`
      : `ทั้งหมด ${questions.length} ข้อ`;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      <ExamPanelHeader
        title="กระดาษข้อสอบ"
        subtitle={questionPaperSubtitle}
        actions={
          <QuestionPaperModeToggle mode={mode} onModeChange={onModeChange} />
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {mode === "focus" && currentQuestion ? (
          <QuestionPaperFocusView
            question={currentQuestion}
            currentQuestionNo={currentQuestionNo}
            marked={marked}
          />
        ) : (
          <QuestionPaperFullView questions={questions} />
        )}
      </div>

      {mode === "focus" && currentQuestion && (
        <QuestionPaperFocusFooter
          currentQuestionNo={currentQuestionNo}
          totalQuestions={questions.length}
          marked={marked}
          onPrevious={onPrevious}
          onNext={onNext}
          onMark={onToggleMark}
        />
      )}
    </div>
  );
}
