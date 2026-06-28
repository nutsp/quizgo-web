"use client";

import { QuestionReviewAccordion } from "@/components/results/QuestionReviewAccordion";
import type { ReviewQuestion } from "@/lib/api/types";

interface QuestionReviewCompactListProps {
  questions: ReviewQuestion[];
  openQuestionNo: number | null;
  onToggleQuestion: (questionNo: number) => void;
}

export function QuestionReviewCompactList({
  questions,
  openQuestionNo,
  onToggleQuestion,
}: QuestionReviewCompactListProps) {
  if (questions.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">ไม่พบข้อที่ตรงกับตัวกรอง</p>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <QuestionReviewAccordion
          key={question.question_no}
          question={question}
          isOpen={openQuestionNo === question.question_no}
          onToggle={() => onToggleQuestion(question.question_no)}
        />
      ))}
    </div>
  );
}
