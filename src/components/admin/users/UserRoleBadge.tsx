import { Badge } from "@/components/ui/badge";
import { userRoleLabels } from "@/lib/admin/labels";
import { cn } from "@/lib/utils";

const roleStyles: Record<string, string> = {
  user: "bg-slate-100 text-slate-700",
  admin: "bg-teal-50 text-teal-700",
  tutor: "bg-blue-50 text-blue-700",
};

export function UserRoleBadge({ role }: { role: string }) {
  return (
    <Badge variant="secondary" className={cn("font-normal", roleStyles[role] ?? "bg-slate-100 text-slate-700")}>
      {userRoleLabels[role] ?? role}
    </Badge>
  );
}
