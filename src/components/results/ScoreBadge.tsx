import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/format";

interface ScoreBadgeProps {
  percent: number;
  className?: string;
}

export function ScoreBadge({ percent, className }: ScoreBadgeProps) {
  const color =
    percent >= 80 ? "text-success" : percent >= 60 ? "text-primary" : "text-warning";

  return (
    <span className={cn("inline-flex items-center font-bold", color, className)}>
      {formatPercent(percent)}
    </span>
  );
}
