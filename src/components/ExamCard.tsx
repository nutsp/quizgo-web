import Link from "next/link";
import {
  Clock,
  FileQuestion,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Exam } from "@/data/exams";
import { cn } from "@/lib/utils";

interface ExamCardProps {
  exam: Exam;
  variant?: "default" | "compact";
  showDetailButton?: boolean;
}

const difficultyColor: Record<string, string> = {
  ง่าย: "text-success",
  กลาง: "text-accent",
  ยาก: "text-danger",
};

export function ExamCard({
  exam,
  variant = "default",
  showDetailButton = false,
}: ExamCardProps) {
  const examHref = exam.slug
    ? `/exams/${exam.slug}/take`
    : "/exams/demo/take";

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{exam.title}</CardTitle>
          <Badge variant={exam.isFree ? "free" : "premium"}>
            {exam.isFree ? "ฟรี" : "Premium"}
          </Badge>
        </div>
        {variant === "default" && (
          <p className="text-sm text-muted line-clamp-2">{exam.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{exam.category}</Badge>
          {exam.subjects.slice(0, 2).map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FileQuestion className="h-3.5 w-3.5" />
            {exam.questionCount} ข้อ
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {exam.durationMinutes} นาที
          </span>
          <span className={cn("flex items-center gap-1", difficultyColor[exam.difficulty])}>
            <TrendingUp className="h-3.5 w-3.5" />
            ระดับ{exam.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5" />
            ผ่าน {exam.passingScore}%
          </span>
        </div>

        {variant === "default" && (
          <p className="flex items-center gap-1 text-xs text-muted">
            <Users className="h-3.5 w-3.5" />
            ผู้ทำแล้ว {exam.attemptCount.toLocaleString()} คน
          </p>
        )}

        {exam.status && (
          <Badge
            variant={
              exam.status === "ทำแล้ว"
                ? "success"
                : exam.status === "เคยผิดเยอะ"
                  ? "warning"
                  : "outline"
            }
          >
            {exam.status}
          </Badge>
        )}
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button asChild className="flex-1">
          <Link href={examHref}>เริ่มสอบ</Link>
        </Button>
        {showDetailButton && (
          <Button variant="outline" className="flex-1">
            ดูรายละเอียด
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
