import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { resultSummary } from "@/data/resultSummary";
import { cn } from "@/lib/utils";

export function ResultSummaryCard() {
  const { score, total, passed, correct, wrong, unanswered, timeUsed, passingScore } =
    resultSummary;
  const percentage = Math.round((score / total) * 100);

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary-dark text-white shadow-soft">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <p className="text-sm font-medium text-white/80">คะแนนที่ได้</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold md:text-6xl">{score}</span>
              <span className="text-2xl text-white/70">/ {total}</span>
            </div>
            <Badge
              className={cn(
                "mt-3 border-0 text-sm font-semibold",
                passed ? "bg-success text-white" : "bg-danger text-white"
              )}
            >
              {passed ? "ผ่าน" : "ไม่ผ่าน"} (เกณฑ์ {passingScore}%)
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:mt-0 md:gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{percentage}%</p>
              <p className="text-xs text-white/70">เปอร์เซ็นต์</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-300" />
            <div>
              <p className="text-lg font-bold">{correct}</p>
              <p className="text-xs text-white/70">ตอบถูก</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-300" />
            <div>
              <p className="text-lg font-bold">{wrong}</p>
              <p className="text-xs text-white/70">ตอบผิด</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/50 text-xs">
              ?
            </div>
            <div>
              <p className="text-lg font-bold">{unanswered}</p>
              <p className="text-xs text-white/70">ไม่ได้ตอบ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-white/70" />
            <div>
              <p className="text-sm font-bold">{timeUsed}</p>
              <p className="text-xs text-white/70">เวลาที่ใช้</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
