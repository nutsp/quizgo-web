import Link from "next/link";
import { ResultStatusBadge } from "./ResultStatusBadge";
import { ResultViewLink } from "./ResultViewLink";
import { ScoreBadge } from "./ScoreBadge";
import { formatDuration, formatThaiDate } from "@/lib/format";
import type { AttemptHistoryItem } from "@/lib/api/types";

interface AttemptHistoryCardProps {
  item: AttemptHistoryItem;
}

export function AttemptHistoryCard({ item }: AttemptHistoryCardProps) {
  const resultUrl = `/exams/${item.exam_set.code}/result?attempt_id=${item.attempt_id}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-950">{item.exam_set.title}</p>
          <p className="mt-1 text-sm text-slate-500">{item.exam_track.name}</p>
        </div>
        <ResultViewLink href={resultUrl} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <ScoreBadge percent={item.score_percent} passed={item.passed} />
        <span className="text-slate-400">|</span>
        <ResultStatusBadge passed={item.passed} status={item.status} />
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>{formatDuration(item.duration_seconds)}</span>
        {item.submitted_at && <span>{formatThaiDate(item.submitted_at)}</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`${resultUrl}#review`}
          className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          ดูเฉลย
        </Link>
        <Link
          href={`/exams/${item.exam_set.code}`}
          className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium text-teal-700 hover:bg-teal-50"
        >
          สอบใหม่
        </Link>
      </div>
    </div>
  );
}
