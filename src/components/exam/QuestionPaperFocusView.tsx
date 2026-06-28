"use client";

import { useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import type { Question } from "@/data/questions";
import {
  QuestionChoiceList,
  QuestionHeading,
} from "@/components/exam/QuestionPaperContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuestionPaperFocusViewProps {
  question: Question;
  currentQuestionNo: number;
  totalQuestions: number;
  marked: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMark: () => void;
}

export function QuestionPaperFocusView({
  question,
  currentQuestionNo,
  marked,
}: Pick<QuestionPaperFocusViewProps, "question" | "currentQuestionNo" | "marked">) {
  const [showChoiceHint, setShowChoiceHint] = useState(false);

  const handleChoiceHint = () => {
    setShowChoiceHint(true);
    window.setTimeout(() => setShowChoiceHint(false), 3000);
  };

  return (
    <div className="p-5 md:p-6">
      <QuestionHeading
        questionNo={currentQuestionNo}
        text={question.text}
      />

      {marked && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <Bookmark className="h-3 w-3 fill-current" />
            ทำเครื่องหมายแล้ว
          </span>
        </div>
      )}

      {showChoiceHint && (
        <p
          className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-800"
          role="status"
        >
          กรุณาฝนคำตอบในกระดาษคำตอบด้านขวา
        </p>
      )}

      <QuestionChoiceList
        choices={question.choices}
        onChoiceClick={handleChoiceHint}
      />
    </div>
  );
}

export function QuestionPaperFocusFooter({
  currentQuestionNo,
  totalQuestions,
  marked,
  onPrevious,
  onNext,
  onMark,
}: Omit<QuestionPaperFocusViewProps, "question">) {
  return (
    <div className="shrink-0 border-t border-border bg-white px-5 py-4 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionNo <= 1}
          className="sm:min-w-[120px]"
        >
          <ChevronLeft className="h-4 w-4" />
          ก่อนหน้า
        </Button>

        <Button
          variant={marked ? "accent" : "outline"}
          onClick={onMark}
          className="sm:min-w-[160px]"
        >
          <Bookmark className={cn("h-4 w-4", marked && "fill-current")} />
          {marked ? "ยกเลิกเครื่องหมาย" : "ทำเครื่องหมาย"}
        </Button>

        <Button
          onClick={onNext}
          disabled={currentQuestionNo >= totalQuestions}
          className="sm:min-w-[120px]"
        >
          ถัดไป
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
