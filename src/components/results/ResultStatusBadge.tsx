import { cn } from "@/lib/utils";

interface ResultStatusBadgeProps {
  passed: boolean;
  status?: string;
}

const statusStyles = {
  passed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  timeout: "bg-amber-50 text-amber-700",
} as const;

export function ResultStatusBadge({ passed, status }: ResultStatusBadgeProps) {
  const isTimeout = status === "timeout";
  const tone = isTimeout ? "timeout" : passed ? "passed" : "failed";
  const label = isTimeout ? "หมดเวลา" : passed ? "ผ่าน" : "ไม่ผ่าน";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[tone]
      )}
    >
      {label}
    </span>
  );
}
