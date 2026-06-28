import type { MyResultsSummary } from "@/lib/api/types";
import { formatDuration, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  type LucideIcon,
} from "lucide-react";

interface MyResultsSummaryCardsProps {
  summary: MyResultsSummary;
}

type MetricCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  emphasized?: boolean;
};

function MetricCardView({ label, value, icon: Icon, emphasized = false }: MetricCard) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            emphasized ? "bg-teal-50 text-teal-700" : "bg-slate-50 text-slate-600"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p
            className={cn(
              "mt-1 font-bold text-slate-950",
              emphasized ? "text-2xl text-teal-800" : "text-xl"
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MyResultsSummaryCards({ summary }: MyResultsSummaryCardsProps) {
  const cards: MetricCard[] = [
    {
      label: "ทำข้อสอบแล้วทั้งหมด",
      value: `${summary.total_attempts} ครั้ง`,
      icon: BookOpen,
    },
    {
      label: "คะแนนเฉลี่ย",
      value: formatPercent(summary.average_score_percent),
      icon: BarChart3,
      emphasized: true,
    },
    {
      label: "คะแนนสูงสุด",
      value: formatPercent(summary.best_score_percent),
      icon: Award,
      emphasized: true,
    },
    {
      label: "อัตราผ่าน",
      value: formatPercent(summary.pass_rate_percent),
      icon: CheckCircle2,
    },
    {
      label: "ชุดข้อสอบที่ทำแล้ว",
      value: `${summary.completed_exam_sets} ชุด`,
      icon: Target,
    },
    {
      label: "เวลาทำเฉลี่ย",
      value: formatDuration(Math.round(summary.average_duration_seconds)),
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <MetricCardView key={card.label} {...card} />
      ))}
    </div>
  );
}
