"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getMyExamTrackResultDetail } from "@/lib/api/endpoints";
import { toUserFriendlyError } from "@/lib/api";
import type { ExamTrackResultDetail } from "@/lib/api/types";
import { TrackResultSummary } from "@/components/results/TrackResultSummary";
import { ExamSetProgressCard } from "@/components/results/ExamSetProgressCard";
import { WeakSubjectsCard } from "@/components/results/WeakSubjectsCard";
import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/format";
import { Progress } from "@/components/ui/progress";

function TrackResultDetailContent() {
  const params = useParams<{ trackCode: string }>();
  const trackCode = params.trackCode;

  const [data, setData] = useState<ExamTrackResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMyExamTrackResultDetail(trackCode);
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
  }, [trackCode]);

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

  const { exam_track: track, summary } = data;

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/my-results">
          <ArrowLeft className="mr-1 h-4 w-4" />
          ผลสอบของฉัน
        </Link>
      </Button>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="relative h-48 w-full bg-background md:h-56">
          {track.cover_image_url ? (
            <Image
              src={track.cover_image_url}
              alt={track.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary/10 text-primary">
              {track.name}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl font-bold text-white md:text-3xl">{track.name}</h1>
            {track.description && (
              <p className="mt-1 max-w-2xl text-sm text-white/85">{track.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted">ความพร้อมสอบ</p>
            <p className="text-3xl font-bold text-primary">
              {formatPercent(summary.readiness_percent)}
            </p>
            <Progress value={summary.readiness_percent} className="mt-2 max-w-xs" />
          </div>
          <Button asChild>
            <Link href={`/exams?track=${track.code}`}>
              <TrendingUp className="mr-2 h-4 w-4" />
              ฝึกต่อ
            </Link>
          </Button>
        </div>
      </div>

      <TrackResultSummary summary={summary} trackName={track.name} />

      <section>
        <h2 className="mb-4 text-lg font-semibold">ความคืบหน้าแต่ละชุด</h2>
        {data.exam_sets.length === 0 ? (
          <p className="text-muted">ยังไม่มีชุดที่ทำในสายนี้</p>
        ) : (
          <div className="space-y-4">
            {data.exam_sets.map((item) => (
              <ExamSetProgressCard key={item.exam_set.code} item={item} />
            ))}
          </div>
        )}
      </section>

      <WeakSubjectsCard
        subjects={data.weakness_analysis.map((w) => ({
          ...w,
          recommendation: w.recommendation ?? "ควรฝึกข้อสอบหมวดนี้เพิ่ม",
        }))}
      />
    </div>
  );
}

export default function TrackResultPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <TrackResultDetailContent />
      </div>
    </AuthGuard>
  );
}
