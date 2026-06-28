"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2, Send, Volume2, VolumeX } from "lucide-react";
import { AnswerSheetPanel } from "@/components/exam/AnswerSheetPanel";
import {
  QuestionPaperPanel,
  type QuestionPaperMode,
} from "@/components/exam/QuestionPaperPanel";
import { RealisticOMRAnswerSheet } from "@/components/exam/omr/RealisticOMRAnswerSheet";
import type { OMRAnswer } from "@/components/exam/omr/types";
import {
  defaultLayoutConfig,
  normalizeLayoutConfig,
} from "@/lib/exam/answerSheetLayout";
import type { AnswerSheetLayoutConfig } from "@/lib/exam/answerSheetLayout";
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  submitAttempt,
} from "@/lib/api/endpoints";
import type { GetAttemptResponse } from "@/lib/api/types";
import { useAuth } from "@/hooks/useAuth";
import { useExamSoundSetting } from "@/hooks/useExamSoundSetting";
import { playOMRFillSound } from "@/lib/audio/omrSound";
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

const QUESTION_PAPER_MODE_KEY = "exam-question-paper-mode";

function readStoredQuestionPaperMode(): QuestionPaperMode {
  if (typeof window === "undefined") return "focus";
  const stored = localStorage.getItem(QUESTION_PAPER_MODE_KEY);
  return stored === "paper" ? "paper" : "focus";
}

function getRemainingSeconds(data: GetAttemptResponse): number {
  if (typeof data.remaining_seconds === "number") {
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
  const { enabled: soundEnabled, setEnabled: setSoundEnabled } = useExamSoundSetting();
  const resultSlug = routeSlug ?? examSetCode;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(initialAttemptId ?? null);
  const [examTitle, setExamTitle] = useState("");
  const [layoutConfig, setLayoutConfig] = useState<AnswerSheetLayoutConfig>(
    defaultLayoutConfig
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, ChoiceKey>>({});
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [omrOpen, setOmrOpen] = useState(false);
  const [questionPaperMode, setQuestionPaperMode] = useState<QuestionPaperMode>("focus");
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const saveQueue = useRef(Promise.resolve());
  const omrScrollRef = useRef<HTMLDivElement>(null);

  const totalQuestions = questions.length;

  useEffect(() => {
    setQuestionPaperMode(readStoredQuestionPaperMode());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const lockBodyScroll = () => {
      document.body.style.overflow = mediaQuery.matches ? "hidden" : "";
    };
    lockBodyScroll();
    mediaQuery.addEventListener("change", lockBodyScroll);
    return () => {
      document.body.style.overflow = "";
      mediaQuery.removeEventListener("change", lockBodyScroll);
    };
  }, []);

  const handleQuestionPaperModeChange = useCallback((mode: QuestionPaperMode) => {
    setQuestionPaperMode(mode);
    localStorage.setItem(QUESTION_PAPER_MODE_KEY, mode);
  }, []);

  const scrollOmrToQuestion = useCallback((questionNo: number) => {
    requestAnimationFrame(() => {
      const row = omrScrollRef.current?.querySelector(
        `[data-omr-row="${questionNo}"]`
      );
      row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        const attemptFromQuery =
          initialAttemptId ??
          (typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("attempt_id") ??
              sessionStorage.getItem(attemptStorageKey(resultSlug))
            : null);

        if (!attemptFromQuery) {
          if (!cancelled) {
            setError("กรุณาเริ่มทำข้อสอบจากหน้ารายละเอียดชุดข้อสอบ");
            setLoading(false);
            window.setTimeout(() => {
              router.replace(`/exams/${examSetCode}`);
            }, 2500);
          }
          return;
        }

        const data = await getAttempt(attemptFromQuery);
        if (data.status !== "in_progress") {
          if (!cancelled) {
            setError("การสอบนี้สิ้นสุดแล้ว กรุณาเริ่มชุดข้อสอบใหม่");
            setLoading(false);
          }
          return;
        }

        if (cancelled) return;

        const mapped = data.questions.map(mapApiQuestion);
        setAttemptId(data.attempt_id);
        setExamTitle(data.exam_set.title);
        setLayoutConfig(
          normalizeLayoutConfig(
            data.exam_set.answer_sheet_layout ?? defaultLayoutConfig
          )
        );
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
  }, [examSetCode, resultSlug, initialAttemptId, router]);

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

  const commitAnswerSelection = useCallback(
    (questionNumber: number, choice: ChoiceKey) => {
      let changed = false;
      setSelectedAnswers((prev) => {
        changed = prev[questionNumber] !== choice;
        return { ...prev, [questionNumber]: choice };
      });
      persistAnswer(questionNumber, choice);
      if (changed) {
        playOMRFillSound(soundEnabled);
      }
    },
    [persistAnswer, soundEnabled]
  );

  const handleSheetSelectAnswer = useCallback(
    (questionNumber: number, choice: ChoiceKey) => {
      commitAnswerSelection(questionNumber, choice);
    },
    [commitAnswerSelection]
  );

  const handleMobileSelectAnswer = useCallback(
    (questionNumber: number, choice: ChoiceKey) => {
      commitAnswerSelection(questionNumber, choice);
      setCurrentQuestion(questionNumber);
      setOmrOpen(false);
    },
    [commitAnswerSelection]
  );

  const handleNavigateToQuestion = useCallback(
    (questionNumber: number) => {
      setCurrentQuestion(questionNumber);
      scrollOmrToQuestion(questionNumber);
    },
    [scrollOmrToQuestion]
  );

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

  const omrAnswers: OMRAnswer[] = useMemo(() => {
    return Array.from({ length: totalQuestions }, (_, i) => {
      const questionNo = i + 1;
      return {
        question_no: questionNo,
        selected_choice_key: selectedAnswers[questionNo] ?? null,
        marked: markedQuestions.includes(questionNo),
      };
    });
  }, [totalQuestions, selectedAnswers, markedQuestions]);

  const omrSheetProps = {
    examTitle,
    examSetCode: resultSlug,
    candidateName: user?.display_name,
    candidateNo: undefined as string | undefined,
    totalQuestions,
    currentQuestionNo: currentQuestion,
    answers: omrAnswers,
    layoutConfig,
    onSelectQuestion: handleNavigateToQuestion,
    onSelectAnswer: handleSheetSelectAnswer,
  };

  const mobileOmrSheetProps = {
    ...omrSheetProps,
    onSelectAnswer: handleMobileSelectAnswer,
  };

  const openSubmitDialog = () => {
    setOmrOpen(false);
    setShowSubmitDialog(true);
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
        <Button className="mt-4" onClick={() => router.push(`/exams/${examSetCode}`)}>
          กลับไปรายละเอียดชุดข้อสอบ
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-slate-50",
        "min-h-screen pb-24",
        "xl:fixed xl:inset-0 xl:z-30 xl:h-dvh xl:overflow-hidden xl:pb-0"
      )}
    >
      <header className="shrink-0 border-b border-border bg-surface shadow-sm">
        <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
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

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            title="เสียงฝนคำตอบ"
            aria-label={soundEnabled ? "ปิดเสียงฝนคำตอบ" : "เปิดเสียงฝนคำตอบ"}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {soundEnabled ? "เปิดเสียง" : "ปิดเสียง"}
            </span>
          </button>

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
      </header>

      <main className="min-h-0 flex-1 xl:overflow-hidden">
        <div className="px-4 py-6 sm:px-6 lg:px-8 xl:hidden">
          <QuestionPaperPanel
            mode={questionPaperMode}
            onModeChange={handleQuestionPaperModeChange}
            questions={questions}
            currentQuestionNo={currentQuestion}
            markedQuestions={markedQuestions}
            examTitle={examTitle}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToggleMark={handleToggleMark}
          />
        </div>

        <div className="hidden h-full xl:flex">
          <div className="mx-auto flex h-full w-full max-w-[1800px] gap-6 px-6 py-6">
            <section className="h-full min-w-0 flex-[3]">
              <QuestionPaperPanel
                className="h-full"
                mode={questionPaperMode}
                onModeChange={handleQuestionPaperModeChange}
                questions={questions}
                currentQuestionNo={currentQuestion}
                markedQuestions={markedQuestions}
                examTitle={examTitle}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToggleMark={handleToggleMark}
              />
            </section>

            <aside className="h-full min-w-0 flex-[2]">
              <AnswerSheetPanel
                className="h-full"
                {...omrSheetProps}
                variant="compact"
                scrollContainerRef={omrScrollRef}
              />
            </aside>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex-1 text-sm text-slate-600">
            ตอบแล้ว{" "}
            <span className="font-bold text-teal-700">{answeredCount}</span>/{totalQuestions}
          </div>
          <Button onClick={() => setOmrOpen(true)} aria-label="ดูกระดาษคำตอบ">
            ดูกระดาษคำตอบ
          </Button>
        </div>
      </div>

      <Sheet open={omrOpen} onOpenChange={setOmrOpen}>
        <SheetContent side="bottom" className="flex flex-col p-0 xl:hidden">
          <SheetHeader className="shrink-0 border-b border-border px-4 py-3 pr-12">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <SheetTitle>กระดาษคำตอบ</SheetTitle>
                <SheetDescription className="mt-1">
                  กดค้างที่วงกลมเพื่อฝนคำตอบ
                </SheetDescription>
              </div>
              <SheetCloseButton className="absolute right-3 top-3" />
            </div>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <RealisticOMRAnswerSheet
              {...mobileOmrSheetProps}
              variant="mobile"
              showSummary={false}
              className="min-h-0 flex-1"
            />
          </div>

          <SheetFooter className="shrink-0 border-t border-border px-4 py-3">
            <Button className="w-full" onClick={openSubmitDialog}>
              <Send className="h-4 w-4" />
              ส่งคำตอบ
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ยืนยันการส่งคำตอบ</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted">
            <div className="space-y-2 rounded-xl border border-border bg-background p-4 text-foreground">
              <p>
                ตอบแล้ว: <strong>{answeredCount}</strong> ข้อ
              </p>
              <p>
                ยังไม่ตอบ: <strong>{unansweredCount}</strong> ข้อ
              </p>
              <p>
                ทำเครื่องหมายไว้: <strong>{markedCount}</strong> ข้อ
              </p>
            </div>
            <p className="text-xs leading-relaxed text-foreground">
              กรุณาตรวจสอบกระดาษคำตอบก่อนส่ง
            </p>
            <p className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs leading-relaxed text-foreground">
              เมื่อส่งคำตอบแล้วจะไม่สามารถกลับมาแก้ไขได้
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              ยกเลิก
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
