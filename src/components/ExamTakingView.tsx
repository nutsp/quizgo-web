"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileText, Loader2, Send, X } from "lucide-react";
import { QuestionPanel } from "@/components/QuestionPanel";
import { RealisticAnswerSheet } from "@/components/RealisticAnswerSheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  answersRecordToLabels,
  mapApiQuestion,
  type ChoiceKey,
  type Question,
} from "@/data/questions";
import {
  getAttempt,
  saveAnswer,
  startAttempt,
  submitAttempt,
} from "@/lib/api/endpoints";
import type { GetAttemptResponse, StartAttemptResponse } from "@/lib/api/types";
import { useAuth } from "@/hooks/useAuth";
import { labelToApiKey } from "@/lib/choices";
import { cn, formatTime } from "@/lib/utils";

interface ExamTakingViewProps {
  examSetCode: string;
  routeSlug?: string;
  attemptId?: string;
}

function attemptStorageKey(slug: string) {
  return `attempt:${slug}`;
}

function getRemainingSeconds(
  data: StartAttemptResponse | GetAttemptResponse
): number {
  if ("remaining_seconds" in data && typeof data.remaining_seconds === "number") {
    return data.remaining_seconds;
  }
  return Math.max(
    0,
    Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)
  );
}

export function ExamTakingView({
  examSetCode,
  routeSlug,
  attemptId: initialAttemptId,
}: ExamTakingViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const resultSlug = routeSlug ?? examSetCode;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(initialAttemptId ?? null);
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, ChoiceKey>>({});
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const saveQueue = useRef(Promise.resolve());

  const totalQuestions = questions.length;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        let data: StartAttemptResponse | GetAttemptResponse;
        const storedId =
          initialAttemptId ??
          (typeof window !== "undefined"
            ? sessionStorage.getItem(attemptStorageKey(resultSlug))
            : null);

        if (storedId) {
          try {
            const existing = await getAttempt(storedId);
            data =
              existing.status === "in_progress"
                ? existing
                : await startAttempt(examSetCode);
          } catch {
            data = await startAttempt(examSetCode);
          }
        } else {
          data = await startAttempt(examSetCode);
        }

        if (cancelled) return;

        const mapped = data.questions.map(mapApiQuestion);
        setAttemptId(data.attempt_id);
        setExamTitle(data.exam_set.title);
        setQuestions(mapped);
        setRemainingSeconds(getRemainingSeconds(data));
        setSelectedAnswers(answersRecordToLabels(data.answers ?? {}));
        sessionStorage.setItem(attemptStorageKey(resultSlug), data.attempt_id);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "โหลดข้อสอบไม่สำเร็จ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [examSetCode, resultSlug, initialAttemptId]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const persistAnswer = useCallback(
    (questionNo: number, choice: ChoiceKey) => {
      if (!attemptId) return;
      const apiKey = labelToApiKey(choice);
      setSaveStatus("saving");
      saveQueue.current = saveQueue.current.then(async () => {
        try {
          await saveAnswer(attemptId, questionNo, apiKey);
          setSaveStatus("saved");
          window.setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("idle");
        }
      });
    },
    [attemptId]
  );

  const handleSelectAnswer = useCallback(
    (choice: ChoiceKey) => {
      setSelectedAnswers((prev) => {
        const next = { ...prev, [currentQuestion]: choice };
        return next;
      });
      persistAnswer(currentQuestion, choice);
    },
    [currentQuestion, persistAnswer]
  );

  const handleSheetSelectAnswer = useCallback(
    (questionNumber: number, choice: ChoiceKey) => {
      setSelectedAnswers((prev) => ({ ...prev, [questionNumber]: choice }));
      persistAnswer(questionNumber, choice);
    },
    [persistAnswer]
  );

  const handleNavigateToQuestion = useCallback((questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  }, []);

  const handleToggleMark = useCallback(() => {
    setMarkedQuestions((prev) =>
      prev.includes(currentQuestion)
        ? prev.filter((q) => q !== currentQuestion)
        : [...prev, currentQuestion]
    );
  }, [currentQuestion]);

  const handlePrevious = () => setCurrentQuestion((q) => Math.max(1, q - 1));
  const handleNext = () =>
    setCurrentQuestion((q) => Math.min(totalQuestions || 1, q + 1));

  const handleSubmit = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    try {
      await saveQueue.current;
      await submitAttempt(attemptId);
      sessionStorage.removeItem(attemptStorageKey(resultSlug));
      router.push(`/exams/${resultSlug}/result?attempt_id=${attemptId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ส่งคำตอบไม่สำเร็จ");
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  const answeredCount = Object.values(selectedAnswers).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;
  const markedCount = markedQuestions.length;
  const isLowTime = remainingSeconds < 600;

  const currentQuestionData = useMemo(
    () => questions.find((q) => q.id === currentQuestion),
    [questions, currentQuestion]
  );

  const sheetProps = {
    examTitle,
    examSetCode: resultSlug,
    candidateName: user?.display_name ?? "ผู้สอบ",
    candidateId: "-",
    totalQuestions,
    currentQuestion,
    selectedAnswers,
    markedQuestions,
    onSelectAnswer: handleSheetSelectAnswer,
    onNavigateToQuestion: handleNavigateToQuestion,
    answeredCount,
    unansweredCount,
    markedCount,
    highlightUnanswered: showSubmitDialog,
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>กำลังโหลดข้อสอบ...</p>
      </div>
    );
  }

  if (error || !currentQuestionData) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-danger">{error ?? "ไม่พบข้อสอบ"}</p>
        <Button className="mt-4" onClick={() => router.push("/exams")}>
          กลับคลังข้อสอบ
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <div className="sticky top-0 z-30 border-b border-border bg-surface shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-bold text-foreground md:text-base">
              {examTitle}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
              <span>
                ข้อ <strong className="font-mono text-foreground">{currentQuestion}</strong> /{" "}
                {totalQuestions}
              </span>
              <span className="hidden sm:inline">·</span>
              <span>
                ตอบแล้ว{" "}
                <strong className="font-mono text-success">{answeredCount}</strong> ข้อ
              </span>
              {saveStatus !== "idle" && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span className="text-muted">
                    {saveStatus === "saving" ? "กำลังบันทึก…" : "บันทึกแล้ว"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-base font-bold md:px-4 md:py-2 md:text-lg",
              isLowTime ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
            )}
          >
            <Clock className="h-4 w-4 md:h-5 md:w-5" />
            {formatTime(remainingSeconds)}
          </div>

          <Button size="sm" onClick={() => setShowSubmitDialog(true)} className="shrink-0">
            <Send className="h-4 w-4" />
            ส่งคำตอบ
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[3fr_2fr]">
        <QuestionPanel
          question={currentQuestionData}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswers[currentQuestion] ?? null}
          isMarked={markedQuestions.includes(currentQuestion)}
          onSelectAnswer={handleSelectAnswer}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToggleMark={handleToggleMark}
        />

        <div className="hidden lg:block">
          <div className="sticky top-[72px]">
            <RealisticAnswerSheet {...sheetProps} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur-md lg:hidden">
        <Button
          variant="outline"
          className="w-full border-primary text-primary"
          onClick={() => setShowAnswerSheet(true)}
        >
          <FileText className="h-4 w-4" />
          เปิดกระดาษคำตอบ
        </Button>
      </div>

      {showAnswerSheet && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
            <h2 className="text-sm font-bold text-foreground">กระดาษคำตอบ</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowAnswerSheet(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col p-3">
            <RealisticAnswerSheet
              {...sheetProps}
              className="flex min-h-0 flex-1 flex-col shadow-none"
              scrollMaxHeight={null}
            />
          </div>
          <div className="border-t border-border bg-surface p-3">
            <Button className="w-full" onClick={() => setShowAnswerSheet(false)}>
              กลับไปทำข้อสอบ
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ยืนยันการส่งคำตอบ?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted">
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-background p-4">
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-success">{answeredCount}</p>
                <p className="text-xs">ตอบแล้ว</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-danger">{unansweredCount}</p>
                <p className="text-xs">ยังไม่ตอบ</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-accent">{markedCount}</p>
                <p className="text-xs">ทำเครื่องหมาย</p>
              </div>
            </div>
            <p className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs leading-relaxed text-foreground">
              หากส่งคำตอบแล้วจะไม่สามารถกลับมาแก้ไขได้
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              กลับไปทำต่อ
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "กำลังส่ง..." : "ส่งคำตอบ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
