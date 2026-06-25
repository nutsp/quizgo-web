"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getMyExamSetResultDetail } from "@/lib/api/endpoints";
import { toUserFriendlyError } from "@/lib/api";
import type { ExamSetResultDetail } from "@/lib/api/types";
import { ResultStatusBadge } from "@/components/results/ResultStatusBadge";
import { ScoreBadge } from "@/components/results/ScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatPercent, formatThaiDate } from "@/lib/format";

function ExamSetResultDetailContent() {
  const params = useParams<{ examSetCode: string }>();
  const examSetCode = params.examSetCode;

  const [data, setData] = useState<ExamSetResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMyExamSetResultDetail(examSetCode);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(toUserFriendlyError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [examSetCode]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>กำลังโหลดผลสอบ...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger">ไม่สามารถโหลดผลสอบได้ กรุณาลองใหม่อีกครั้ง</p>
        {error && <p className="text-sm text-muted">{error}</p>}
        <Button asChild variant="outline">
          <Link href="/my-results">กลับไปผลสอบของฉัน</Link>
        </Button>
      </div>
    );
  }

  const { exam_set: set, summary, attempts } = data;
  const improved = summary.improvement_percent > 0;

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/my-results">
          <ArrowLeft className="mr-1 h-4 w-4" />
          ผลสอบของฉัน
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-background sm:h-28 sm:w-44">
          {set.cover_image_url ? (
            <Image src={set.cover_image_url} alt={set.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary/10 text-primary">
              {set.code}
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{set.title}</h1>
            <ResultStatusBadge passed={summary.passed} />
          </div>
          <p className="mt-1 text-muted">ทำแล้ว {summary.attempt_count} ครั้ง</p>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted">ครั้งแรก</p>
            <p className="text-lg font-semibold">{formatPercent(summary.first_score_percent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">ล่าสุด</p>
            <p className="text-lg font-semibold">{formatPercent(summary.latest_score_percent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">ดีที่สุด</p>
            <p className="text-lg font-semibold text-success">
              {formatPercent(summary.best_score_percent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">พัฒนาการ</p>
            <p className={`text-lg font-semibold ${improved ? "text-success" : "text-muted"}`}>
              {improved ? "+" : ""}
              {formatPercent(summary.improvement_percent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">เวลาทำเฉลี่ย</p>
            <p className="text-lg font-semibold">
              {formatDuration(Math.round(summary.average_duration_seconds))}
            </p>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">ประวัติการสอบ</h2>
          <Button asChild size="sm">
            <Link href={`/exams/${set.code}`}>สอบใหม่</Link>
          </Button>
        </div>

        {attempts.length === 0 ? (
          <p className="text-muted">ยังไม่มีประวัติการสอบ</p>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => {
              const resultUrl = `/exams/${set.code}/result?attempt_id=${attempt.attempt_id}`;
              return (
                <Card key={attempt.attempt_id}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">ครั้งที่ {attempt.attempt_no}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <ScoreBadge percent={attempt.score_percent} />
                        <ResultStatusBadge passed={attempt.passed} />
                        <span className="text-sm text-muted">
                          {formatDuration(attempt.duration_seconds)}
                        </span>
                        {attempt.submitted_at && (
                          <span className="text-sm text-muted">
                            {formatThaiDate(attempt.submitted_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={resultUrl}>ดูผล</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`${resultUrl}#review`}>ดูเฉลย</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ExamSetResultPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <ExamSetResultDetailContent />
      </div>
    </AuthGuard>
  );
}
