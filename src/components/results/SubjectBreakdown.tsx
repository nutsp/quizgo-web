import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SubjectBreakdownItem } from "@/lib/api/types";
import { formatPercent } from "@/lib/format";

interface SubjectBreakdownProps {
  items: SubjectBreakdownItem[];
}

export function SubjectBreakdown({ items }: SubjectBreakdownProps) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">คะแนนแยกตามหมวด</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item) => (
          <div key={item.subject_name} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{item.subject_name}</span>
              <span className="shrink-0 text-muted">
                {item.correct} / {item.total}{" "}
                <span className="font-semibold text-primary">
                  ({formatPercent(item.score_percent)})
                </span>
              </span>
            </div>
            <Progress value={item.score_percent} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
