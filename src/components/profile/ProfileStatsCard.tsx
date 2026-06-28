import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/lib/api/types";
import { formatPercent } from "@/lib/format";

interface ProfileStatsCardProps {
  stats: NonNullable<UserProfile["stats"]>;
}

export function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">สถิติการสอบ</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs text-muted">จำนวนครั้งที่สอบ</p>
          <p className="mt-1 text-xl font-bold text-foreground">{stats.total_attempts}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs text-muted">ชุดข้อสอบที่ทำแล้ว</p>
          <p className="mt-1 text-xl font-bold text-foreground">{stats.completed_exam_sets}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs text-muted">คะแนนเฉลี่ย</p>
          <p className="mt-1 text-xl font-bold text-primary">
            {formatPercent(stats.average_score_percent)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs text-muted">คะแนนสูงสุด</p>
          <p className="mt-1 text-xl font-bold text-success">
            {formatPercent(stats.best_score_percent)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
