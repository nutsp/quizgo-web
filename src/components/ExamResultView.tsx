"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { ResultSummaryCard } from "@/components/ResultSummaryCard";
import { ReviewQuestionCard } from "@/components/ReviewQuestionCard";
import { SubjectBreakdown } from "@/components/SubjectBreakdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResult, getReview } from "@/lib/api/endpoints";
import { formatDuration } from "@/lib/api/mappers";
import type { ResultResponse, ReviewResponse } from "@/lib/api/types";
import { apiKeyToLabel } from "@/lib/choices";
import type { ChoiceKey } from "@/lib/choices";

interface ExamResultViewProps {
  examSetCode: string;
}

export function ExamResultView({ examSetCode }: ExamResultViewProps) {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt_id") ?? searchParams.get("attemptId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setError("ไม่พบข้อมูลการสอบ");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const [resultData, reviewData] = await Promise.all([
          getResult(attemptId!),
          getReview(attemptId!),
        ]);
        if (!cancelled) {
          setResult(resultData);
          setReview(reviewData);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "โหลดผลสอบไม่สำเร็จ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>กำลังโหลดผลสอบ...</p>
      </div>
    );
  }

  if (error || !result || !review) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-danger">{error ?? "ไม่พบผลสอบ"}</p>
        <Button asChild className="mt-4">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  const passingScore = result.exam_set.passing_score ?? 60;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ผลการสอบ</h1>
        <p className="mt-1 text-muted">{result.exam_set.title}</p>
      </div>

      <ResultSummaryCard
        score={result.score}
        total={result.total_score}
        passed={result.passed}
        correct={result.correct_count}
        wrong={result.wrong_count}
        unanswered={result.unanswered_count}
        timeUsed={formatDuration(result.duration_seconds)}
        passingScore={passingScore}
      />

      <SubjectBreakdown
        items={result.subject_breakdown.map((s) => ({
          subject: s.subject_name,
          score: s.correct,
          total: s.total,
        }))}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">จุดที่ควรฝึกเพิ่ม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.weakness_analysis.map((item, index) => (
            <div
              key={item.subject_name}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-sm font-bold text-warning">
                  {index + 1}
                </span>
                <span className="font-medium text-foreground">{item.subject_name}</span>
                <span className="text-sm text-muted">
                  {Math.round(item.score_percent)}%
                </span>
              </div>
            </div>
          ))}
          {result.next_recommended_actions.length > 0 && (
            <ul className="space-y-2 text-sm text-muted">
              {result.next_recommended_actions.map((action) => (
                <li key={action}>• {action}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">ตรวจทานข้อสอบ</h2>
        <div className="space-y-4">
          {review.questions.map((q) => {
            const yourAnswer = q.selected_choice_key
              ? (apiKeyToLabel(q.selected_choice_key) as ChoiceKey)
              : ("-" as ChoiceKey);
            const correctAnswer = apiKeyToLabel(q.correct_choice_key) as ChoiceKey;
            return (
              <ReviewQuestionCard
                key={q.question_no}
                questionNumber={q.question_no}
                questionText={q.question_text}
                yourAnswer={yourAnswer}
                correctAnswer={correctAnswer}
                explanation={q.explanation}
                isCorrect={q.is_correct}
              />
            );
          })}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild className="w-full">
          <Link href={`/exams/${examSetCode}/take`}>
            <RotateCcw className="h-4 w-4" />
            สอบใหม่อีกครั้ง
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            กลับคลังข้อสอบ
          </Link>
        </Button>
      </div>
    </div>
  );
}
