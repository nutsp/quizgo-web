import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export function RankBadge({ rank, className }: RankBadgeProps) {
  const isTop3 = rank <= 3;

  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold tabular-nums",
        rank === 1 && "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
        rank === 2 && "bg-slate-200 text-slate-700 ring-1 ring-slate-300",
        rank === 3 && "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
        !isTop3 && "bg-background text-muted ring-1 ring-border",
        className
      )}
    >
      {rank}
    </span>
  );
}
