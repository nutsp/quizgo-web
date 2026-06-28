"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BreakdownTabs } from "@/components/results/BreakdownTabs";
import { PerformanceRadarChart } from "@/components/results/PerformanceRadarChart";
import { QuestionReviewWorkspace } from "@/components/results/QuestionReviewWorkspace";
import { ResultActionBar } from "@/components/results/ResultActionBar";
import { ResultSummaryHero } from "@/components/results/ResultSummaryHero";
import { WeaknessInsightCard } from "@/components/results/WeaknessInsightCard";
import { Button } from "@/components/ui/button";
import { resultApi } from "@/lib/api/resultApi";
import type { ResultResponse, ReviewResponse } from "@/lib/api/types";
import {
  buildRadarData,
  buildTagBreakdownFromReview,
  getWeakestItems,
  mapSubjectBreakdown,
  type ReviewFilter,
} from "@/lib/results/transforms";

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
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");

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

  const reviewQuestions = useMemo(() => review?.questions ?? [], [review?.questions]);

  const subjectItems = useMemo(
    () => (result ? mapSubjectBreakdown(result.subject_breakdown) : []),
    [result]
  );

  const tagItems = useMemo(
    () => buildTagBreakdownFromReview(reviewQuestions),
    [reviewQuestions]
  );

  const radar = useMemo(
    () =>
      result
        ? buildRadarData(result, reviewQuestions)
        : { data: [], chartLabel: "", source: [] },
    [result, reviewQuestions]
  );

  const weakestItems = useMemo(
    () => getWeakestItems(radar.source.length > 0 ? radar.source : subjectItems),
    [radar.source, subjectItems]
  );

  const scrollToReview = useCallback((filter: ReviewFilter = "all") => {
    setReviewFilter(filter);
    requestAnimationFrame(() => {
      document.getElementById("review")?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const handleViewWrongOnly = useCallback(() => {
    scrollToReview("wrong");
  }, [scrollToReview]);

  if (loadingResult) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
        <p>กำลังโหลดผลสอบ...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-600">
          {error ?? "ไม่สามารถโหลดผลสอบได้ กรุณาลองใหม่อีกครั้ง"}
        </p>
        <Button asChild className="mt-4 bg-teal-700 hover:bg-teal-800">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  const passingScore = result.exam_set.passing_score ?? 60;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <ResultSummaryHero
        summary={result.summary}
        passingScore={passingScore}
        examTitle={result.exam_set.title}
        examTrackName={result.exam_track?.name}
      />

      <ResultActionBar examSetCode={examSetCode} onViewWrongOnly={handleViewWrongOnly} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-900">วิเคราะห์ภาพรวม</p>
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <PerformanceRadarChart
            data={radar.data}
            chartLabel={radar.chartLabel}
            compact
          />
          <WeaknessInsightCard items={weakestItems} compact />
        </div>
      </div>

      <BreakdownTabs subjectItems={subjectItems} tagItems={tagItems} />

      <QuestionReviewWorkspace
        questions={reviewQuestions}
        loading={loadingReview}
        initialFilter={reviewFilter}
      />
    </div>
  );
}
