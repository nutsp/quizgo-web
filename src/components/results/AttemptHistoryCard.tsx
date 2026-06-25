import { ResultStatusBadge } from "./ResultStatusBadge";
import { ScoreBadge } from "./ScoreBadge";
import { formatDuration, formatThaiDate } from "@/lib/format";
import type { AttemptHistoryItem } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AttemptHistoryCardProps {
  item: AttemptHistoryItem;
}

export function AttemptHistoryCard({ item }: AttemptHistoryCardProps) {
  const resultUrl = `/exams/${item.exam_set.code}/result?attempt_id=${item.attempt_id}`;

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{item.exam_set.title}</p>
          <p className="text-sm text-muted">{item.exam_track.name}</p>
        </div>
        <ScoreBadge percent={item.score_percent} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
        <ResultStatusBadge passed={item.passed} />
        <span>
          ถูก {item.correct_count} / ผิด {item.wrong_count} / ไม่ตอบ {item.unanswered_count}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
        <span>{formatDuration(item.duration_seconds)}</span>
        {item.submitted_at && <span>{formatThaiDate(item.submitted_at)}</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="default">
          <Link href={resultUrl}>ดูผล</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`${resultUrl}#review`}>ดูเฉลย</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href={`/exams/${item.exam_set.code}`}>สอบใหม่</Link>
        </Button>
      </div>
    </div>
  );
}
