import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  active?: boolean;
  status?: string;
  className?: string;
};

const statusLabels: Record<string, string> = {
  draft: "ฉบับร่าง",
  published: "เผยแพร่แล้ว",
  archived: "เก็บถาวร",
  easy: "ง่าย",
  medium: "ปานกลาง",
  hard: "ยาก",
  free: "ฟรี",
  premium: "Premium",
  practice: "ฝึกหัด",
  mock_exam: "จำลองสอบ",
};

export function AdminStatusBadge({ active, status, className }: AdminStatusBadgeProps) {
  if (active !== undefined) {
    return (
      <span
        className={cn(
          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
          active ? "bg-success/10 text-success" : "bg-muted/10 text-muted",
          className
        )}
      >
        {active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
      </span>
    );
  }

  const label = status ? statusLabels[status] ?? status : "-";
  const colorMap: Record<string, string> = {
    draft: "bg-amber-100 text-amber-800",
    published: "bg-success/10 text-success",
    archived: "bg-slate-100 text-slate-600",
    premium: "bg-accent/10 text-accent",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorMap[status ?? ""] ?? "bg-primary/10 text-primary",
        className
      )}
    >
      {label}
    </span>
  );
}
