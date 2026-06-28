import { Badge } from "@/components/ui/badge";
import { userStatusLabels } from "@/lib/admin/labels";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  suspended: "bg-orange-50 text-orange-700",
  disabled: "bg-red-50 text-red-700",
};

export function UserStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={cn("font-normal", statusStyles[status] ?? "bg-slate-100 text-slate-700")}>
      {userStatusLabels[status] ?? status}
    </Badge>
  );
}
