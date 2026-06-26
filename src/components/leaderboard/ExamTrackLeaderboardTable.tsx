import { Card, CardContent } from "@/components/ui/card";
import { RankBadge } from "@/components/leaderboard/RankBadge";
import type { ExamTrackLeaderboardEntry } from "@/lib/api/types";
import { formatPercent, formatThaiDateTime, leaderboardDisplayName } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ExamTrackLeaderboardTableProps {
  entries: ExamTrackLeaderboardEntry[];
}

export function ExamTrackLeaderboardTable({ entries }: ExamTrackLeaderboardTableProps) {
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
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-background/80 text-left text-muted">
                <th className="px-4 py-3 font-medium">อันดับ</th>
                <th className="px-4 py-3 font-medium">ผู้ใช้</th>
                <th className="px-4 py-3 font-medium">คะแนนเฉลี่ย</th>
                <th className="px-4 py-3 font-medium">ชุดที่ทำแล้ว</th>
                <th className="px-4 py-3 font-medium">สอบผ่าน</th>
                <th className="px-4 py-3 font-medium">อัตราผ่าน</th>
                <th className="px-4 py-3 font-medium">ล่าสุด</th>
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
                  <td className="px-4 py-3 font-semibold tabular-nums text-foreground">
                    {formatPercent(entry.average_score_percent)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted">
                    {entry.completed_exam_sets}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted">
                    {entry.passed_exam_sets}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted">
                    {formatPercent(entry.pass_rate_percent)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatThaiDateTime(entry.latest_submitted_at)}
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
