import { Badge } from "@/components/ui/badge";
import type { UserEntitlement } from "@/lib/api/admin/endpoints";

const LABELS: Record<UserEntitlement["status"], string> = {
  active: "ใช้งานอยู่",
  expired: "หมดอายุ",
  revoked: "ถูกยกเลิก",
  pending: "ยังไม่เริ่ม",
};

const VARIANTS: Record<UserEntitlement["status"], "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  expired: "secondary",
  revoked: "destructive",
  pending: "outline",
};

export function UserEntitlementStatusBadge({ status }: { status: UserEntitlement["status"] }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
