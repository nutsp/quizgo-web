import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeaknessAnalysisItem } from "@/lib/api/types";
import { formatPercent } from "@/lib/format";

interface WeaknessAnalysisProps {
  items: WeaknessAnalysisItem[];
}

export function WeaknessAnalysis({ items }: WeaknessAnalysisProps) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">จุดที่ควรฝึกเพิ่ม</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.subject_name}
            className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/10 text-sm font-bold text-warning">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-foreground">{item.subject_name}</p>
                <p className="mt-1 text-sm text-muted">{item.recommendation}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-warning sm:shrink-0">
              {formatPercent(item.score_percent)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
