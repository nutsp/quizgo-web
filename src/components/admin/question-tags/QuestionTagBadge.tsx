import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QuestionTagBadgeProps = {
  name: string;
  color?: string;
  className?: string;
};

export function QuestionTagBadge({ name, color, className }: QuestionTagBadgeProps) {
  if (color) {
    return (
      <Badge
        variant="outline"
        className={cn("border-transparent font-normal text-white", className)}
        style={{ backgroundColor: color }}
      >
        {name}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={cn("bg-slate-100 font-normal text-slate-700", className)}>
      {name}
    </Badge>
  );
}
