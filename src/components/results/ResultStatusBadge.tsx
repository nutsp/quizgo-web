import { Badge } from "@/components/ui/badge";

interface ResultStatusBadgeProps {
  passed: boolean;
}

export function ResultStatusBadge({ passed }: ResultStatusBadgeProps) {
  return (
    <Badge variant={passed ? "success" : "danger"}>
      {passed ? "ผ่าน" : "ไม่ผ่าน"}
    </Badge>
  );
}
