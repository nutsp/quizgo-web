"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { QuestionReviewList } from "@/components/results/QuestionReviewList";
import { ResultActions } from "@/components/results/ResultActions";
import { ResultSummaryCard } from "@/components/results/ResultSummaryCard";
import { ResultStatusBadge } from "@/components/results/ResultStatusBadge";
import { ReviewedAnswerSheet } from "@/components/results/ReviewedAnswerSheet";
import { SubjectBreakdown } from "@/components/results/SubjectBreakdown";
import { WeaknessAnalysis } from "@/components/results/WeaknessAnalysis";
import { Button } from "@/components/ui/button";
import { resultApi } from "@/lib/api/resultApi";
import type { ResultResponse, ReviewResponse } from "@/lib/api/types";
import { formatThaiDateTime } from "@/lib/format";

interface ExamResultViewProps {
  examSetCode: string;
}

export function ExamResultView({ examSetCode }: ExamResultViewProps) {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt_id") ?? searchParams.get("attemptId");

  const [loadingResult, setLoadingResult] = useState(true);
  const [loadingReview, setLoadingReview] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setError("ไม่พบข้อมูลผลสอบ");
      setLoadingResult(false);
      setLoadingReview(false);
      return;
    }

    let cancelled = false;

    async function loadResult() {
      try {
        const resultData = await resultApi.getAttemptResult(attemptId!);
        if (!cancelled) setResult(resultData);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "ไม่สามารถโหลดผลสอบได้ กรุณาลองใหม่อีกครั้ง"
          );
        }
      } finally {
        if (!cancelled) setLoadingResult(false);
      }
    }

    async function loadReview() {
      try {
        const reviewData = await resultApi.getAttemptReview(attemptId!);
        if (!cancelled) setReview(reviewData);
      } catch {
        if (!cancelled) setReview(null);
      } finally {
        if (!cancelled) setLoadingReview(false);
      }
    }

    loadResult();
    loadReview();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  useEffect(() => {
    if (!loadingReview && review && window.location.hash === "#review") {
      document.getElementById("review")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadingReview, review]);

  const scrollToReview = useCallback(() => {
    document.getElementById("review")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (loadingResult) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>กำลังโหลดผลสอบ...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-danger">{error ?? "ไม่สามารถโหลดผลสอบได้ กรุณาลองใหม่อีกครั้ง"}</p>
        <Button asChild className="mt-4">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  const passingScore = result.exam_set.passing_score ?? 60;
  const reviewQuestions = review?.questions ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 lg:px-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">ผลสอบ</p>
            <h1 className="text-2xl font-bold text-foreground">{result.exam_set.title}</h1>
          </div>
          <ResultStatusBadge passed={result.summary.passed} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span>สายการสอบ: {result.exam_track?.name ?? "-"}</span>
          <span>วันที่ส่งคำตอบ: {formatThaiDateTime(result.summary.submitted_at)}</span>
        </div>
      </header>

      <ResultSummaryCard summary={result.summary} passingScore={passingScore} />

      <SubjectBreakdown items={result.subject_breakdown} />

      <WeaknessAnalysis items={result.weakness_analysis} />

      {!loadingReview && reviewQuestions.length > 0 && (
        <ReviewedAnswerSheet questions={reviewQuestions} />
      )}

      <ResultActions examSetCode={examSetCode} onScrollToReview={scrollToReview} />

      <QuestionReviewList questions={reviewQuestions} loading={loadingReview} />
    </div>
  );
}
