"use client";

import Link from "next/link";
import {
  Clock,
  FileQuestion,
  Target,
  TrendingUp,
} from "lucide-react";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ACCESS_LABELS,
  DIFFICULTY_LABELS,
  formatExamPrice,
  type ExamSet,
} from "@/lib/exam/format";
import { cn } from "@/lib/utils";

export type ExamSetCardProps = {
  examSet: ExamSet;
  onStart?: (examSet: ExamSet) => void;
};

const difficultyColor: Record<string, string> = {
  easy: "text-success",
  medium: "text-accent",
  hard: "text-danger",
};

export function ExamSetCard({ examSet, onStart }: ExamSetCardProps) {
  const detailHref = `/exams/${examSet.code}`;
  const price = formatExamPrice(examSet);
  const trackName = examSet.exam_track?.name ?? "สนามสอบเสมือนจริง";

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-soft">
      <Link href={detailHref} className="group block">
        <div className="relative">
          <ExamCoverImage
            src={examSet.cover_image_url}
            alt={examSet.title}
            className="aspect-video w-full"
            imgClassName="transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute left-3 top-3">
            <Badge variant={examSet.access_type === "free" ? "free" : "premium"}>
              {ACCESS_LABELS[examSet.access_type]}
            </Badge>
          </div>
          {examSet.is_official && (
            <div className="absolute right-3 top-3">
              <Badge variant="secondary">Official</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <Link href={detailHref} className="group space-y-2">
          <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary">
            {examSet.title}
          </h3>
          <p className="text-xs font-medium text-primary">{trackName}</p>
          <p className="line-clamp-2 text-sm text-muted">{examSet.description}</p>
        </Link>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FileQuestion className="h-3.5 w-3.5 shrink-0" />
            {examSet.total_questions} ข้อ
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {examSet.duration_minutes} นาที
          </span>
          <span
            className={cn(
              "flex items-center gap-1",
              difficultyColor[examSet.difficulty] ?? "text-muted"
            )}
          >
            <TrendingUp className="h-3.5 w-3.5 shrink-0" />
            ระดับ{DIFFICULTY_LABELS[examSet.difficulty]}
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5 shrink-0" />
            ผ่าน {examSet.passing_score}%
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border p-4 pt-0">
        <div className="w-full">
          <p className="text-lg font-bold text-foreground">{price.primary}</p>
          {price.secondary && (
            <p className="text-xs text-muted">{price.secondary}</p>
          )}
        </div>
        <div className="flex w-full gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={detailHref}>ดูรายละเอียด</Link>
          </Button>
          <Button
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              onStart?.(examSet);
            }}
          >
            เริ่มทำข้อสอบ
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
