import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { subjectBreakdown } from "@/data/resultSummary";

export function SubjectBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">คะแนนแยกตามวิชา</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {subjectBreakdown.map((item) => {
          const percentage = Math.round((item.score / item.total) * 100);
          return (
            <div key={item.subject} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.subject}</span>
                <span className="text-muted">
                  {item.score} / {item.total}{" "}
                  <span className="font-semibold text-primary">({percentage}%)</span>
                </span>
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
