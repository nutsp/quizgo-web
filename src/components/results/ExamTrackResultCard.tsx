import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatPercent, formatThaiDate } from "@/lib/format";
import type { ExamTrackResultSummary } from "@/lib/api/types";

interface ExamTrackResultCardProps {
  track: ExamTrackResultSummary;
}

export function ExamTrackResultCard({ track }: ExamTrackResultCardProps) {
  const { exam_track: t } = track;
  const progressPercent =
    track.total_exam_sets > 0
      ? Math.round((track.completed_exam_sets / track.total_exam_sets) * 100)
      : 0;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-36 w-full">
        <ExamCoverImage
          src={t.cover_image_url}
          alt={t.name}
          title={t.name}
          className="h-36 w-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold text-white">{t.name}</h3>
          <p className="text-sm text-white/80">
            ทำแล้ว {track.completed_exam_sets} / {track.total_exam_sets} ชุด
          </p>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted">ความคืบหน้า</span>
            <span className="font-medium text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted">ทำทั้งหมด</p>
            <p className="font-semibold">{track.total_attempts} ครั้ง</p>
          </div>
          <div>
            <p className="text-muted">คะแนนเฉลี่ย (ดีที่สุด)</p>
            <p className="font-semibold">{formatPercent(track.average_best_score_percent)}</p>
          </div>
          <div>
            <p className="text-muted">คะแนนดีที่สุด</p>
            <p className="font-semibold text-success">{formatPercent(track.best_score_percent)}</p>
          </div>
          <div>
            <p className="text-muted">ผ่าน / ไม่ผ่าน</p>
            <p className="font-semibold">
              {track.passed_exam_sets} / {track.failed_exam_sets}
            </p>
          </div>
        </div>

        {track.last_attempt_at && (
          <p className="text-xs text-muted">
            ล่าสุด: {formatThaiDate(track.last_attempt_at)}
          </p>
        )}

        {track.weak_subjects.length > 0 && (
          <div className="rounded-lg bg-warning/5 p-3">
            <p className="text-xs font-medium text-warning">จุดอ่อนหลัก</p>
            <p className="mt-1 text-sm text-foreground">
              {track.weak_subjects.map((s) => s.subject_name).join(", ")}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/my-results/tracks/${t.code}`}>
              ดูรายละเอียด
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/exams?track=${t.code}`}>
              <TrendingUp className="mr-1 h-4 w-4" />
              ฝึกต่อ
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
