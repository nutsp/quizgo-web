import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RankBadge } from "@/components/leaderboard/RankBadge";
import type { ExamSetLeaderboardEntry } from "@/lib/api/types";
import { formatDuration, formatPercent, formatScore, formatThaiDateTime, leaderboardDisplayName } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ExamSetLeaderboardTableProps {
  entries: ExamSetLeaderboardEntry[];
}

export function ExamSetLeaderboardTable({ entries }: ExamSetLeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted">
          <p className="font-medium">ยังไม่มีข้อมูลอันดับ</p>
          <p className="mt-1 text-sm">เมื่อมีผู้ส่งคำตอบ ระบบจะแสดงอันดับที่นี่</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-background/80 text-left text-muted">
                <th className="px-4 py-3 font-medium">อันดับ</th>
                <th className="px-4 py-3 font-medium">ผู้ใช้</th>
                <th className="px-4 py-3 font-medium">คะแนน</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">เวลาที่ใช้</th>
                <th className="px-4 py-3 font-medium">วันที่ส่ง</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={`${entry.rank}-${entry.user_id}`}
                  className={cn(
                    "border-b border-border/60 last:border-0",
                    entry.is_current_user && "bg-primary/5"
                  )}
                >
                  <td className="px-4 py-3">
                    <RankBadge rank={entry.rank} />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {leaderboardDisplayName(entry.display_name, entry.is_current_user)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <span className="font-semibold">
                      {formatScore(entry.score, entry.total_score)}
                    </span>
                    <span className="ml-1 text-muted">({formatPercent(entry.score_percent)})</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={entry.passed ? "success" : "danger"}>
                      {entry.passed ? "ผ่าน" : "ไม่ผ่าน"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDuration(entry.duration_seconds)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatThaiDateTime(entry.submitted_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
