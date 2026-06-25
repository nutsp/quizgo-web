"use client";

import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChoiceKey, Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Card className="border-0 shadow-none md:border md:shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            ข้อ {currentQuestion}
          </span>
          <span className="text-xs text-muted">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-base leading-relaxed text-foreground md:text-lg">
          {question.text}
        </p>

        <div className="space-y-3">
          {question.choices.map((choice) => (
            <button
              key={choice.key}
              type="button"
              onClick={() => onSelectAnswer(choice.key)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                selectedAnswer === choice.key
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-surface hover:border-primary/30 hover:bg-background"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  selectedAnswer === choice.key
                    ? "bg-primary text-white"
                    : "bg-background text-muted"
                )}
              >
                {choice.key}
              </span>
              <span className="pt-1 text-sm leading-relaxed md:text-base">{choice.text}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentQuestion <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            ก่อนหน้า
          </Button>

          <Button
            variant={isMarked ? "accent" : "ghost"}
            onClick={onToggleMark}
          >
            <Bookmark className={cn("h-4 w-4", isMarked && "fill-current")} />
            ทำเครื่องหมาย
          </Button>

          <Button
            onClick={onNext}
            disabled={currentQuestion >= totalQuestions}
          >
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
