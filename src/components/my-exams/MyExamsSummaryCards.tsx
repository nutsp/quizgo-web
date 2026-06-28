import Link from "next/link";
import type { ReactNode } from "react";
import { Crown, Lock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MyExamSummary } from "@/lib/api/types";
import type { MyExamTab } from "@/lib/my-exams/filters";
import { cn } from "@/lib/utils";

type MyExamsSummaryCardsProps = {
  summary: MyExamSummary;
  activeTab: MyExamTab;
  onTabChange: (tab: MyExamTab) => void;
};

export function MyExamsSummaryCards({
  summary,
  activeTab,
  onTabChange,
}: MyExamsSummaryCardsProps) {
  const premiumLabel = summary.has_premium ? "ใช้งานอยู่" : "ยังไม่ได้ใช้งาน";
  const paidCount = summary.single_purchase_count ?? Math.max(
    0,
    summary.unlocked_exam_set_count - summary.private_exam_set_count
  );
  const grantCount =
    summary.grant_count ??
    summary.private_exam_set_count;

  const premiumCard = summary.has_premium ? (
    <button
      type="button"
      onClick={() => onTabChange("completed")}
      className="w-full text-left"
    >
      <SummaryCard
        icon={<Crown className="h-5 w-5" />}
        iconClassName="bg-amber-50 text-amber-600"
        label="Premium"
        value={premiumLabel}
        subtitle={
          summary.premium_expires_at
            ? `หมดอายุ ${new Date(summary.premium_expires_at).toLocaleDateString("th-TH")}`
            : summary.premium_activity_count
              ? `เคยทำผ่าน Premium ${summary.premium_activity_count} ชุด`
              : undefined
        }
        active={activeTab === "completed"}
      />
    </button>
  ) : (
    <Link href="/pricing" className="block">
      <SummaryCard
        icon={<Crown className="h-5 w-5" />}
        iconClassName="bg-amber-50 text-amber-600"
        label="Premium"
        value={premiumLabel}
        subtitle={
          summary.premium_activity_count
            ? `เคยทำผ่าน Premium ${summary.premium_activity_count} ชุด`
            : undefined
        }
      />
    </Link>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {premiumCard}
      <button type="button" onClick={() => onTabChange("unlocked")} className="w-full text-left">
        <SummaryCard
          icon={<Lock className="h-5 w-5" />}
          iconClassName="bg-blue-50 text-blue-600"
          label="ซื้อรายชุด"
          value={`${paidCount} ชุด`}
          active={activeTab === "unlocked"}
        />
      </button>
      <button type="button" onClick={() => onTabChange("special_grant")} className="w-full text-left">
        <SummaryCard
          icon={<ShieldCheck className="h-5 w-5" />}
          iconClassName="bg-violet-50 text-violet-600"
          label="เฉพาะผู้ได้รับสิทธิ์"
          value={`${grantCount} ชุด`}
          active={activeTab === "special_grant"}
        />
      </button>
    </div>
  );
}

function SummaryCard({
  icon,
  iconClassName,
  label,
  value,
  subtitle,
  active,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  subtitle?: string;
  active?: boolean;
}) {
  return (
    <Card
      className={cn(
        "transition-colors hover:border-teal-200 hover:bg-slate-50/50",
        active && "border-teal-300 ring-1 ring-teal-200"
      )}
    >
      <CardContent className="flex items-start gap-3 p-5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            iconClassName
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="font-semibold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
