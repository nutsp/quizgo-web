import { Badge } from "@/components/ui/badge";
import type { UserAccessSummary } from "@/lib/api/admin/endpoints";

type UserAccessTypeBadgeProps = {
  accessSummary: UserAccessSummary;
};

const VARIANTS: Record<UserAccessSummary["display_access_type"], "outline" | "secondary" | "accent"> = {
  free: "outline",
  exam_set: "secondary",
  premium: "accent",
};

function formatExpiryDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getAccessLabel(accessSummary: UserAccessSummary) {
  switch (accessSummary.display_access_type) {
    case "premium":
      return "Premium";
    case "exam_set":
      return "ซื้อรายชุด";
    case "free":
    default:
      return "ใช้งานฟรี";
  }
}

function getAccessSubtext(accessSummary: UserAccessSummary) {
  if (accessSummary.display_access_type === "premium" && accessSummary.premium_expires_at) {
    return `หมดอายุ ${formatExpiryDate(accessSummary.premium_expires_at)}`;
  }
  if (accessSummary.display_access_type === "exam_set" && accessSummary.active_exam_set_count > 0) {
    return `${accessSummary.active_exam_set_count} ชุด`;
  }
  return null;
}

export function UserAccessTypeBadge({ accessSummary }: UserAccessTypeBadgeProps) {
  const label = getAccessLabel(accessSummary);
  const subtext = getAccessSubtext(accessSummary);

  return (
    <div className="flex flex-col gap-0.5">
      <Badge variant={VARIANTS[accessSummary.display_access_type]}>{label}</Badge>
      {subtext && <span className="text-xs text-slate-500">{subtext}</span>}
    </div>
  );
}
