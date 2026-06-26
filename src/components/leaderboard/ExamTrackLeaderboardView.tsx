"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CurrentUserRankCard } from "@/components/leaderboard/CurrentUserRankCard";
import { ExamTrackLeaderboardTable } from "@/components/leaderboard/ExamTrackLeaderboardTable";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { Button } from "@/components/ui/button";
import { leaderboardApi } from "@/lib/api/leaderboardApi";
import type { ExamTrackLeaderboardResponse } from "@/lib/api/types";
import { ApiError, toUserFriendlyError } from "@/lib/api";

interface ExamTrackLeaderboardViewProps {
  trackCode: string;
}

export function ExamTrackLeaderboardView({ trackCode }: ExamTrackLeaderboardViewProps) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExamTrackLeaderboardResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await leaderboardApi.getExamTrackLeaderboard(trackCode, page);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError && e.status === 404) {
            setError("ไม่พบสายการสอบนี้");
          } else {
            setError(toUserFriendlyError(e));
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [trackCode, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.pagination.total / data.pagination.limit)) : 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 lg:px-8">
      <Button asChild variant="ghost" size="sm">
        <Link href="/exams">
          <ArrowLeft className="h-4 w-4" />
          กลับไปคลังข้อสอบ
        </Link>
      </Button>

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>กำลังโหลดกระดานอันดับ...</p>
        </div>
      ) : error || !data ? (
        <div className="py-16 text-center">
          <p className="text-danger">
            {error ?? "ไม่สามารถโหลดกระดานอันดับได้ กรุณาลองใหม่อีกครั้ง"}
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/exams">กลับไปคลังข้อสอบ</Link>
          </Button>
        </div>
      ) : (
        <>
          <LeaderboardHeader
            title={`กระดานอันดับ: ${data.exam_track.name}`}
            subtitle="จัดอันดับจากคะแนนเฉลี่ยที่ดีที่สุดในแต่ละชุดข้อสอบของสายการสอบนี้"
          />

          <CurrentUserRankCard
            variant="exam-track"
            rank={data.current_user_rank}
            startHref="/exams"
          />

          <ExamTrackLeaderboardTable entries={data.leaderboard} />

          {data.pagination.total > data.pagination.limit && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                หน้า {data.pagination.page} จาก {totalPages} ({data.pagination.total} คน)
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  ก่อนหน้า
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ถัดไป
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface PageWrapperProps {
  trackCode: string;
}

export function ExamTrackLeaderboardPage({ trackCode }: PageWrapperProps) {
  return (
    <AuthGuard>
      <ExamTrackLeaderboardView trackCode={trackCode} />
    </AuthGuard>
  );
}
