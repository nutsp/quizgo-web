import type { MyResultsSummary } from "@/lib/api/types";
import { formatDuration, formatPercent } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

interface MyResultsSummaryCardsProps {
  summary: MyResultsSummary;
}

export function MyResultsSummaryCards({ summary }: MyResultsSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="ทำข้อสอบแล้วทั้งหมด"
        value={`${summary.total_attempts} ครั้ง`}
        icon={BookOpen}
      />
      <StatCard
        label="คะแนนเฉลี่ย"
        value={formatPercent(summary.average_score_percent)}
        icon={BarChart3}
      />
      <StatCard
        label="คะแนนดีที่สุด"
        value={formatPercent(summary.best_score_percent)}
        icon={Award}
        iconColor="text-success"
      />
      <StatCard
        label="อัตราผ่าน"
        value={formatPercent(summary.pass_rate_percent)}
        icon={CheckCircle2}
        iconColor="text-success"
      />
      <StatCard
        label="ชุดข้อสอบที่ทำแล้ว"
        value={`${summary.completed_exam_sets} ชุด`}
        icon={Target}
      />
      <StatCard
        label="เวลาทำเฉลี่ย"
        value={formatDuration(Math.round(summary.average_duration_seconds))}
        icon={Clock}
      />
    </div>
  );
}
