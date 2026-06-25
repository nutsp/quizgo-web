"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, LayoutGrid, Send, X } from "lucide-react";
import { AnswerSheet } from "@/components/AnswerSheet";
import { QuestionPanel } from "@/components/QuestionPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { demoQuestion, TOTAL_QUESTIONS, type ChoiceKey } from "@/data/questions";
import { initialExamState } from "@/data/userProgress";
import { cn, formatTime } from "@/lib/utils";

export function ExamTakingView() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(initialExamState.currentQuestion);
  const [answers, setAnswers] = useState(initialExamState.answers);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>(
    initialExamState.markedQuestions
  );
  const [remainingSeconds, setRemainingSeconds] = useState(initialExamState.remainingSeconds);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const unansweredCount = TOTAL_QUESTIONS - answeredCount;
  const markedCount = markedQuestions.length;
  const isLowTime = remainingSeconds < 600;

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectAnswer = useCallback(
    (choice: ChoiceKey) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion]: choice }));
    },
    [currentQuestion]
  );

  const handleToggleMark = useCallback(() => {
    setMarkedQuestions((prev) =>
      prev.includes(currentQuestion)
        ? prev.filter((q) => q !== currentQuestion)
        : [...prev, currentQuestion]
    );
  }, [currentQuestion]);

  const handlePrevious = () => setCurrentQuestion((q) => Math.max(1, q - 1));
  const handleNext = () => setCurrentQuestion((q) => Math.min(TOTAL_QUESTIONS, q + 1));

  const handleSubmit = () => {
    setShowSubmitDialog(false);
    router.push("/exams/demo/result");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Exam Bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-surface shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-sm font-bold text-foreground md:text-base">
              Mock Exam เสมียน ชุด A
            </h1>
            <p className="text-xs text-muted">
              ข้อ {currentQuestion} / {TOTAL_QUESTIONS}
            </p>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg font-bold",
              isLowTime ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
            )}
          >
            <Clock className="h-5 w-5" />
            {formatTime(remainingSeconds)}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowAnswerSheet(true)}
            >
              <LayoutGrid className="h-4 w-4" />
              กระดาษคำตอบ
            </Button>
            <Button size="sm" onClick={() => setShowSubmitDialog(true)}>
              <Send className="h-4 w-4" />
              ส่งคำตอบ
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_340px]">
        <QuestionPanel
          question={demoQuestion}
          currentQuestion={currentQuestion}
          totalQuestions={TOTAL_QUESTIONS}
          selectedAnswer={answers[currentQuestion]}
          isMarked={markedQuestions.includes(currentQuestion)}
          onSelectAnswer={handleSelectAnswer}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToggleMark={handleToggleMark}
        />

        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-4 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-foreground">กระดาษคำตอบ</h2>
            <AnswerSheet
              totalQuestions={TOTAL_QUESTIONS}
              currentQuestion={currentQuestion}
              answers={answers}
              markedQuestions={markedQuestions}
              onQuestionSelect={setCurrentQuestion}
              answeredCount={answeredCount}
              unansweredCount={unansweredCount}
              markedCount={markedCount}
            />
          </div>
        </div>
      </div>

      {/* Mobile Answer Sheet Bottom Sheet */}
      {showAnswerSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowAnswerSheet(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl border-t border-border bg-surface p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">กระดาษคำตอบ</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAnswerSheet(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <AnswerSheet
              totalQuestions={TOTAL_QUESTIONS}
              currentQuestion={currentQuestion}
              answers={answers}
              markedQuestions={markedQuestions}
              onQuestionSelect={(q) => {
                setCurrentQuestion(q);
                setShowAnswerSheet(false);
              }}
              answeredCount={answeredCount}
              unansweredCount={unansweredCount}
              markedCount={markedCount}
              compact
            />
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการส่งคำตอบ?</DialogTitle>
            <DialogDescription>
              คุณยังมีข้อที่ยังไม่ตอบ {unansweredCount} ข้อ หากส่งแล้วจะไม่สามารถแก้ไขได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              กลับไปทำต่อ
            </Button>
            <Button onClick={handleSubmit}>ส่งคำตอบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
