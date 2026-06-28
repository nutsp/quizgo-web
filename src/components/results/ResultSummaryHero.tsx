import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ResultSummary } from "@/lib/api/types";
import { formatDuration, formatPercent, formatScore, formatThaiDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ResultSummaryHeroProps {
  summary: ResultSummary;
  passingScore: number;
  examTitle?: string;
  examTrackName?: string;
}

export function ResultSummaryHero({
  summary,
  passingScore,
  examTitle,
  examTrackName,
}: ResultSummaryHeroProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        {(examTitle || examTrackName) && (
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="min-w-0">
              {examTitle && (
                <h1 className="truncate text-lg font-bold text-slate-900">{examTitle}</h1>
              )}
              <p className="text-xs text-slate-500">
                {examTrackName ? `สายการสอบ: ${examTrackName}` : null}
                {examTrackName && summary.submitted_at ? " · " : null}
                {summary.submitted_at
                  ? `ส่งคำตอบ ${formatThaiDateTime(summary.submitted_at)}`
                  : null}
              </p>
            </div>
            <Badge
              className={cn(
                "shrink-0 border-0 text-xs font-semibold",
                summary.passed ? "bg-green-600 text-white" : "bg-red-600 text-white"
              )}
            >
              {summary.passed ? "ผ่านเกณฑ์" : "ไม่ผ่านเกณฑ์"}
            </Badge>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-white",
                summary.passed ? "bg-teal-700" : "bg-red-600"
              )}
            >
              <span className="text-xl font-bold leading-none">
                {formatPercent(summary.score_percent)}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500">คะแนนรวม</p>
              <p className="text-lg font-bold text-slate-900">
                {formatScore(summary.score, summary.total_score)} คะแนน
              </p>
              <p className="text-xs text-slate-500">ผ่าน {passingScore}%</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 sm:justify-end">
            <span>
              ตอบถูก <strong className="text-green-600">{summary.correct_count}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span>
              ตอบผิด <strong className="text-red-600">{summary.wrong_count}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span>
              ไม่ตอบ <strong className="text-amber-600">{summary.unanswered_count}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span>
              ใช้เวลา <strong>{formatDuration(summary.duration_seconds)}</strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
