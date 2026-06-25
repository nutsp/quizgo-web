import Link from "next/link";
import Image from "next/image";
import type { ExamSetProgressItem } from "@/lib/api/types";
import { formatPercent, formatThaiDate } from "@/lib/format";
import { ResultStatusBadge } from "./ResultStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ExamSetProgressCardProps {
  item: ExamSetProgressItem;
}

export function ExamSetProgressCard({ item }: ExamSetProgressCardProps) {
  const { exam_set: set } = item;
  const improved = item.improvement_percent > 0;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-background sm:h-16 sm:w-24">
          {set.cover_image_url ? (
            <Image
              src={set.cover_image_url}
              alt={set.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary/10 text-xs text-primary">
              {set.code}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{set.title}</h3>
            <ResultStatusBadge passed={item.passed} />
          </div>
          <p className="mt-1 text-sm text-muted">ทำแล้ว {item.attempt_count} ครั้ง</p>

          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
            <span>
              ครั้งแรก: <strong>{formatPercent(item.first_score_percent)}</strong>
            </span>
            <span>
              ล่าสุด: <strong>{formatPercent(item.latest_score_percent)}</strong>
            </span>
            <span>
              ดีที่สุด: <strong className="text-success">{formatPercent(item.best_score_percent)}</strong>
            </span>
            <span className={improved ? "text-success" : "text-muted"}>
              {improved ? "+" : ""}
              {formatPercent(item.improvement_percent)} พัฒนาการ
            </span>
          </div>

          {item.last_attempt_at && (
            <p className="mt-1 text-xs text-muted">
              ล่าสุด: {formatThaiDate(item.last_attempt_at)}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/my-results/exam-sets/${set.code}`}>ดูประวัติ</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/exams/${set.code}`}>
              <TrendingUp className="mr-1 h-4 w-4" />
              สอบใหม่
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
