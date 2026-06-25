import Link from "next/link";
import type { WeakSubject } from "@/lib/api/types";
import { formatPercent } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface WeakSubjectsCardProps {
  subjects: WeakSubject[];
}

export function WeakSubjectsCard({ subjects }: WeakSubjectsCardProps) {
  if (subjects.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">หมวดที่ควรฝึกเพิ่ม</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((subject) => (
          <Card key={subject.subject_code ?? subject.subject_name}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{subject.subject_name}</p>
                <p className="text-sm text-muted">
                  คะแนนเฉลี่ย {formatPercent(subject.average_score_percent)}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {subject.recommendation ?? "ควรฝึกข้อสอบหมวดนี้เพิ่ม"}
                </p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href="/exams">ฝึกเพิ่ม</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
