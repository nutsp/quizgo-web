import type { TrackSummaryStats } from "@/lib/api/types";
import { formatDuration, formatPercent } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TrackResultSummaryProps {
  summary: TrackSummaryStats;
  trackName?: string;
}

export function TrackResultSummary({ summary, trackName }: TrackResultSummaryProps) {
  const progressPercent =
    summary.total_exam_sets > 0
      ? Math.round((summary.completed_exam_sets / summary.total_exam_sets) * 100)
      : 0;

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        {trackName && (
          <div>
            <p className="text-sm text-muted">ความพร้อมสอบ</p>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-3xl font-bold text-primary">
                {formatPercent(summary.readiness_percent)}
              </span>
              <span className="text-sm text-muted">
                {summary.completed_exam_sets} / {summary.total_exam_sets} ชุด
              </span>
            </div>
            <Progress value={summary.readiness_percent} className="mt-2" />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted">ทำแล้ว</p>
            <p className="font-semibold">
              {summary.completed_exam_sets} / {summary.total_exam_sets} ชุด
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">คะแนนเฉลี่ย (ดีที่สุด)</p>
            <p className="font-semibold">{formatPercent(summary.average_best_score_percent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">คะแนนดีที่สุด</p>
            <p className="font-semibold text-success">{formatPercent(summary.best_score_percent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">ผ่านแล้ว / ยังไม่ผ่าน</p>
            <p className="font-semibold">
              {summary.passed_exam_sets} / {summary.failed_exam_sets}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">จำนวนครั้งทั้งหมด</p>
            <p className="font-semibold">{summary.total_attempts} ครั้ง</p>
          </div>
          <div>
            <p className="text-xs text-muted">เวลาทำเฉลี่ย</p>
            <p className="font-semibold">
              {formatDuration(Math.round(summary.average_duration_seconds))}
            </p>
          </div>
        </div>

        {!trackName && (
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted">ความคืบหน้า</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
