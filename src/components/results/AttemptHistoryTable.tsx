import Link from "next/link";
import { AttemptHistoryCard } from "./AttemptHistoryCard";
import { ResultStatusBadge } from "./ResultStatusBadge";
import { ScoreBadge } from "./ScoreBadge";
import { formatDuration, formatThaiDate } from "@/lib/format";
import type { AttemptHistoryItem } from "@/lib/api/types";
import { Button } from "@/components/ui/button";

interface AttemptHistoryTableProps {
  items: AttemptHistoryItem[];
}

export function AttemptHistoryTable({ items }: AttemptHistoryTableProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background text-left text-muted">
              <th className="px-4 py-3 font-medium">วันที่</th>
              <th className="px-4 py-3 font-medium">สายสอบ</th>
              <th className="px-4 py-3 font-medium">ชุดข้อสอบ</th>
              <th className="px-4 py-3 font-medium">คะแนน</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">เวลา</th>
              <th className="px-4 py-3 font-medium">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const resultUrl = `/exams/${item.exam_set.code}/result?attempt_id=${item.attempt_id}`;
              return (
                <tr key={item.attempt_id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted">
                    {item.submitted_at ? formatThaiDate(item.submitted_at) : "-"}
                  </td>
                  <td className="px-4 py-3">{item.exam_track.name}</td>
                  <td className="px-4 py-3 font-medium">{item.exam_set.title}</td>
                  <td className="px-4 py-3">
                    <ScoreBadge percent={item.score_percent} />
                  </td>
                  <td className="px-4 py-3">
                    <ResultStatusBadge passed={item.passed} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDuration(item.duration_seconds)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                        <Link href={resultUrl}>ดูผล</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                        <Link href={`${resultUrl}#review`}>ดูเฉลย</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                        <Link href={`/exams/${item.exam_set.code}`}>สอบใหม่</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <AttemptHistoryCard key={item.attempt_id} item={item} />
        ))}
      </div>
    </>
  );
}
