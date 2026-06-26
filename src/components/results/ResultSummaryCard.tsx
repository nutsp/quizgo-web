import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ResultSummary } from "@/lib/api/types";
import { formatDuration, formatPercent, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ResultSummaryCardProps {
  summary: ResultSummary;
  passingScore: number;
}

export function ResultSummaryCard({ summary, passingScore }: ResultSummaryCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary-dark text-white shadow-soft">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <p className="text-sm font-medium text-white/80">คะแนนรวม</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold md:text-6xl">
                {formatScore(summary.score, summary.total_score)}
              </span>
            </div>
            <Badge
              className={cn(
                "mt-3 border-0 text-sm font-semibold",
                summary.passed ? "bg-success text-white" : "bg-danger text-white"
              )}
            >
              {summary.passed ? "ผ่าน" : "ไม่ผ่าน"}
            </Badge>
            <p className="mt-3 text-sm text-white/90">
              {summary.passed
                ? "ยอดเยี่ยม คุณสอบผ่านเกณฑ์"
                : "ยังไม่ผ่านเกณฑ์ ลองทบทวนข้อที่ผิดแล้วฝึกใหม่อีกครั้ง"}
            </p>
          </div>

          <div className="mt-6 text-center md:mt-0 md:text-right">
            <p className="text-3xl font-bold">{formatPercent(summary.score_percent)}</p>
            <p className="text-xs text-white/70">เปอร์เซ็นต์</p>
            <p className="mt-2 text-xs text-white/70">คะแนนผ่าน {passingScore}%</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-300" />
            <div>
              <p className="text-lg font-bold">{summary.correct_count}</p>
              <p className="text-xs text-white/70">ข้อถูก</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-300" />
            <div>
              <p className="text-lg font-bold">{summary.wrong_count}</p>
              <p className="text-xs text-white/70">ข้อผิด</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/50 text-xs">
              ?
            </div>
            <div>
              <p className="text-lg font-bold">{summary.unanswered_count}</p>
              <p className="text-xs text-white/70">ไม่ตอบ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-white/70" />
            <div>
              <p className="text-sm font-bold">{formatDuration(summary.duration_seconds)}</p>
              <p className="text-xs text-white/70">เวลาที่ใช้</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
