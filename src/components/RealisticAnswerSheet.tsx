"use client";

import { Flag } from "lucide-react";
import { HoldToFillBubble } from "@/components/HoldToFillBubble";
import type { ChoiceKey } from "@/data/questions";
import { cn } from "@/lib/utils";

const CHOICES: ChoiceKey[] = ["ก", "ข", "ค", "ง"];

/** Prepared for future review mode — not fully implemented yet */
export interface ReviewAnswerState {
  userAnswer: ChoiceKey | null;
  correctAnswer: ChoiceKey;
  hasExplanation?: boolean;
}

export type AnswerSheetMode = "taking" | "review";

export interface RealisticAnswerSheetProps {
  examTitle: string;
  examSetCode?: string;
  candidateName?: string;
  candidateId?: string;
  totalQuestions: number;
  currentQuestion: number;
  selectedAnswers: Record<number, ChoiceKey | null>;
  markedQuestions: number[];
  onSelectAnswer: (questionNumber: number, choice: ChoiceKey) => void;
  onNavigateToQuestion: (questionNumber: number) => void;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  highlightUnanswered?: boolean;
  mode?: AnswerSheetMode;
  reviewData?: Record<number, ReviewAnswerState>;
  showHeader?: boolean;
  className?: string;
  scrollMaxHeight?: string | null;
}

interface ReviewBubbleProps {
  choice: ChoiceKey;
  isSelected: boolean;
  reviewState?: ReviewAnswerState;
}

function ReviewBubble({ choice, isSelected, reviewState }: ReviewBubbleProps) {
  const isCorrect =
    reviewState &&
    reviewState.userAnswer === choice &&
    reviewState.correctAnswer === choice;
  const isWrong =
    reviewState &&
    reviewState.userAnswer === choice &&
    reviewState.correctAnswer !== choice;
  const isCorrectAnswer = reviewState && reviewState.correctAnswer === choice;

  return (
    <div className="flex flex-col items-center gap-0.5 px-1 py-0.5">
      <span
        className={cn(
          "text-[10px] font-medium leading-none",
          isSelected || isCorrect || isWrong ? "font-bold text-foreground" : "text-muted"
        )}
      >
        {choice}
      </span>
      <span
        className={cn(
          "relative flex h-7 w-7 items-center justify-center rounded-full border md:h-6 md:w-6",
          isCorrect && "border-success bg-success",
          isWrong && "border-danger bg-danger",
          isCorrectAnswer && !isWrong && !isCorrect && "border-success bg-success/20",
          !isCorrect && !isWrong && !isCorrectAnswer && isSelected && "border-[#111827] bg-[#111827]",
          !isCorrect && !isWrong && !isCorrectAnswer && !isSelected && "border-border bg-white"
        )}
      >
        {(isSelected || isCorrect || isWrong) && (
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        )}
      </span>
    </div>
  );
}

interface AnswerRowProps {
  questionNumber: number;
  selectedAnswer: ChoiceKey | null;
  isCurrent: boolean;
  isMarked: boolean;
  isUnanswered: boolean;
  highlightUnanswered: boolean;
  mode: AnswerSheetMode;
  reviewState?: ReviewAnswerState;
  onSelectAnswer: (choice: ChoiceKey) => void;
  onNavigate: () => void;
}

function AnswerRow({
  questionNumber,
  selectedAnswer,
  isCurrent,
  isMarked,
  isUnanswered,
  highlightUnanswered,
  mode,
  reviewState,
  onSelectAnswer,
  onNavigate,
}: AnswerRowProps) {
  const isReview = mode === "review";

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-l-[3px] px-2 py-1 transition-colors",
        isCurrent && "border-l-primary bg-primary/10",
        !isCurrent && isMarked && "border-l-accent bg-accent/10",
        !isCurrent && !isMarked && "border-l-transparent",
        highlightUnanswered && isUnanswered && "bg-danger/5 ring-1 ring-inset ring-danger/20"
      )}
    >
      <button
        type="button"
        onClick={onNavigate}
        className={cn(
          "w-6 shrink-0 text-left font-mono text-xs tabular-nums hover:text-primary",
          isCurrent ? "font-bold text-primary" : "text-muted"
        )}
      >
        {questionNumber}
      </button>

      <div className="flex flex-1 items-center justify-around">
        {CHOICES.map((choice) =>
          isReview ? (
            <ReviewBubble
              key={choice}
              choice={choice}
              isSelected={selectedAnswer === choice}
              reviewState={reviewState}
            />
          ) : (
            <HoldToFillBubble
              key={choice}
              questionNo={questionNumber}
              choiceKey={choice}
              label={choice}
              selected={selectedAnswer === choice}
              onComplete={(_qNo, choiceKey) => onSelectAnswer(choiceKey)}
            />
          )
        )}
      </div>

      {isMarked && mode === "taking" && (
        <Flag className="h-3 w-3 shrink-0 fill-accent text-accent" aria-label="ทำเครื่องหมาย" />
      )}
    </div>
  );
}

function AnswerSheetHeader({
  examTitle,
  examSetCode,
  candidateName,
  candidateId,
}: {
  examTitle: string;
  examSetCode: string;
  candidateName: string;
  candidateId: string;
}) {
  const idDigits = candidateId.padEnd(10, " ").split("").slice(0, 10);

  return (
    <div className="border-b border-border px-4 py-4">
      <div className="text-center">
        <h2 className="text-base font-bold tracking-wide text-foreground">กระดาษคำตอบ</h2>
        <p className="mt-0.5 text-xs text-muted">{examTitle}</p>
      </div>

      <div className="mt-4 space-y-2.5 text-xs text-foreground">
        <div className="flex items-baseline gap-2">
          <span className="shrink-0 font-medium">ชื่อผู้สอบ:</span>
          <span className="flex-1 border-b border-dotted border-border pb-0.5">
            {candidateName || "\u00A0"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 font-medium">เลขประจำตัวสอบ:</span>
          <div className="flex gap-1">
            {idDigits.map((digit, i) => (
              <span
                key={i}
                className="flex h-6 w-5 items-center justify-center border border-border bg-background font-mono text-[10px] font-semibold"
              >
                {digit.trim() || ""}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">ชุดข้อสอบ:</span>
          <span className="flex h-7 w-7 items-center justify-center border-2 border-foreground font-mono text-sm font-bold">
            {examSetCode}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-background/80 p-3 text-[11px] leading-relaxed text-muted">
        <p className="font-semibold text-foreground">คำชี้แจง:</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          <li>ให้เลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว</li>
          <li>กดค้างที่วงกลมเพื่อฝนคำตอบ จนเต็มวงกลม</li>
          <li>หากต้องการเปลี่ยนคำตอบ ให้ฝนตัวเลือกใหม่ในข้อเดิม</li>
        </ul>
      </div>
    </div>
  );
}

function AnswerSheetSummary({
  answeredCount,
  unansweredCount,
  markedCount,
}: {
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-border bg-background/50 px-4 py-2.5 text-[11px]">
      <div className="text-center">
        <span className="block font-mono text-sm font-bold text-success">{answeredCount}</span>
        <span className="text-muted">ตอบแล้ว</span>
      </div>
      <div className="text-center">
        <span className="block font-mono text-sm font-bold text-muted">{unansweredCount}</span>
        <span className="text-muted">ยังไม่ตอบ</span>
      </div>
      <div className="text-center">
        <span className="block font-mono text-sm font-bold text-accent">{markedCount}</span>
        <span className="text-muted">ทำเครื่องหมาย</span>
      </div>
    </div>
  );
}

export function RealisticAnswerSheet({
  examTitle,
  examSetCode = "A",
  candidateName = "",
  candidateId = "0123456789",
  totalQuestions,
  currentQuestion,
  selectedAnswers,
  markedQuestions,
  onSelectAnswer,
  onNavigateToQuestion,
  answeredCount,
  unansweredCount,
  markedCount,
  highlightUnanswered = false,
  mode = "taking",
  reviewData,
  showHeader = true,
  className,
  scrollMaxHeight = "calc(100vh - 120px)",
}: RealisticAnswerSheetProps) {
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const isTaking = mode === "taking";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft",
        scrollMaxHeight === null && "min-h-0 flex-1",
        className
      )}
    >
      {showHeader && (
        <AnswerSheetHeader
          examTitle={examTitle}
          examSetCode={examSetCode}
          candidateName={candidateName}
          candidateId={candidateId}
        />
      )}

      <AnswerSheetSummary
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        markedCount={markedCount}
      />

      {isTaking && (
        <p className="border-b border-border bg-accent/5 px-4 py-2 text-center text-[11px] font-medium text-foreground">
          กดค้างที่วงกลมเพื่อฝนคำตอบ
        </p>
      )}

      <div className="flex items-center gap-2 border-b border-border px-2 py-1.5">
        <span className="w-6 shrink-0 text-center font-mono text-[10px] text-muted">#</span>
        <div className="flex flex-1 items-center justify-around">
          {CHOICES.map((c) => (
            <span
              key={c}
              className="w-[30px] text-center font-mono text-[10px] font-semibold text-muted md:w-[26px]"
            >
              {c}
            </span>
          ))}
        </div>
        <span className="w-3" />
      </div>

      <div
        className={cn("overflow-y-auto", scrollMaxHeight === null && "flex-1")}
        style={scrollMaxHeight ? { maxHeight: scrollMaxHeight } : undefined}
      >
        <div className="divide-y divide-border/60 px-1 py-1">
          {questionNumbers.map((qNum) => {
            const answer = selectedAnswers[qNum] ?? null;
            return (
              <AnswerRow
                key={qNum}
                questionNumber={qNum}
                selectedAnswer={answer}
                isCurrent={qNum === currentQuestion}
                isMarked={markedQuestions.includes(qNum)}
                isUnanswered={answer === null}
                highlightUnanswered={highlightUnanswered}
                mode={mode}
                reviewState={reviewData?.[qNum]}
                onSelectAnswer={(choice) => {
                  onSelectAnswer(qNum, choice);
                  onNavigateToQuestion(qNum);
                }}
                onNavigate={() => onNavigateToQuestion(qNum)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
