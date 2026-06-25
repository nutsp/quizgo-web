"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import {
  HoldToFillBubbleVisual,
  useHoldToFill,
} from "@/components/HoldToFillBubble";
import type { ChoiceKey, Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionPanelProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: ChoiceKey | null;
  isMarked: boolean;
  onSelectAnswer: (choice: ChoiceKey) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleMark: () => void;
}

interface QuestionChoiceRowProps {
  questionNo: number;
  choiceKey: ChoiceKey;
  choiceText: string;
  selected: boolean;
  onSelectAnswer: (choice: ChoiceKey) => void;
}

function QuestionChoiceRow({
  questionNo,
  choiceKey,
  choiceText,
  selected,
  onSelectAnswer,
}: QuestionChoiceRowProps) {
  const [pendingFill, setPendingFill] = useState(false);

  const handleComplete = useCallback(() => {
    setPendingFill(true);
    onSelectAnswer(choiceKey);
  }, [onSelectAnswer, choiceKey]);

  useEffect(() => {
    if (selected) setPendingFill(false);
  }, [selected]);

  const { progress, isHolding, startHold, endHold, handleKeyDown } = useHoldToFill({
    disabled: selected,
    onComplete: handleComplete,
  });

  const showFilled = selected || pendingFill;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`ฝนคำตอบ ข้อ ${questionNo} ตัวเลือก ${choiceKey}`}
      aria-pressed={selected}
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex w-full touch-none select-none items-start gap-4 rounded-xl border-2 p-4 transition-all md:p-5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        selected
          ? "border-foreground/20 bg-background shadow-sm ring-1 ring-foreground/10"
          : "border-border bg-background hover:border-foreground/20",
        (isHolding || pendingFill) && !selected && "scale-[1.01] border-foreground/30"
      )}
    >
      <span className="mt-0.5 flex shrink-0 flex-col items-center gap-1.5">
        <span
          className={cn(
            "text-sm font-bold",
            showFilled ? "text-foreground" : "text-muted"
          )}
        >
          {choiceKey}
        </span>
        <HoldToFillBubbleVisual
          selected={showFilled}
          progress={progress}
          isHolding={isHolding}
        />
      </span>

      <span
        className={cn(
          "flex-1 pt-0.5 text-sm leading-relaxed md:text-base md:leading-relaxed",
          showFilled ? "font-semibold text-foreground" : "text-foreground"
        )}
      >
        {choiceKey}. {choiceText}
      </span>
    </div>
  );
}

export function QuestionPanel({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  isMarked,
  onSelectAnswer,
  onPrevious,
  onNext,
  onToggleMark,
}: QuestionPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border bg-background px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-primary px-2.5 py-1 font-mono text-sm font-bold text-white">
            ข้อ {currentQuestion}
          </span>
          <span className="text-xs text-muted">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
        {isMarked && (
          <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            <Bookmark className="h-3 w-3 fill-current" />
            ทำเครื่องหมายแล้ว
          </span>
        )}
      </div>

      <div className="space-y-8 p-5 md:p-8">
        <p className="text-base font-medium leading-[1.8] text-foreground md:text-lg md:leading-[1.9]">
          {question.text}
        </p>

        <p className="rounded-lg bg-accent/5 px-3 py-2 text-center text-xs font-medium text-foreground">
          กดค้างที่วงกลมเพื่อฝนคำตอบ
        </p>

        <fieldset className="space-y-3">
          <legend className="sr-only">ตัวเลือกคำตอบ</legend>
          {question.choices.map((choice) => (
            <QuestionChoiceRow
              key={choice.key}
              questionNo={currentQuestion}
              choiceKey={choice.key}
              choiceText={choice.text}
              selected={selectedAnswer === choice.key}
              onSelectAnswer={onSelectAnswer}
            />
          ))}
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentQuestion <= 1}
            className="sm:min-w-[120px]"
          >
            <ChevronLeft className="h-4 w-4" />
            ก่อนหน้า
          </Button>

          <Button
            variant={isMarked ? "accent" : "outline"}
            onClick={onToggleMark}
            className="sm:min-w-[160px]"
          >
            <Bookmark className={cn("h-4 w-4", isMarked && "fill-current")} />
            {isMarked ? "ยกเลิกเครื่องหมาย" : "ทำเครื่องหมาย"}
          </Button>

          <Button
            onClick={onNext}
            disabled={currentQuestion >= totalQuestions}
            className="sm:min-w-[120px]"
          >
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
