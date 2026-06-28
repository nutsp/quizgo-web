import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/format";

interface ScoreBadgeProps {
  percent: number;
  passed?: boolean;
  className?: string;
}

export function ScoreBadge({ percent, passed, className }: ScoreBadgeProps) {
  const color =
    passed === true
      ? "text-green-700"
      : passed === false
        ? "text-orange-600"
        : percent >= 80
          ? "text-green-700"
          : percent >= 60
            ? "text-teal-700"
            : "text-orange-600";

  return (
    <span className={cn("inline-flex items-center font-bold", color, className)}>
      {formatPercent(percent)}
    </span>
  );
}
