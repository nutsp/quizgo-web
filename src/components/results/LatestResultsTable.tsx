import Link from "next/link";
import { AttemptHistoryTable } from "./AttemptHistoryTable";
import { formatThaiDate } from "@/lib/format";
import type { AttemptHistoryItem } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "./ScoreBadge";
import { ResultStatusBadge } from "./ResultStatusBadge";

interface LatestResultsTableProps {
  items: AttemptHistoryItem[];
}

export function LatestResultsTable({ items }: LatestResultsTableProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
        ยังไม่มีผลสอบล่าสุด
      </p>
    );
  }

  return (
    <div>
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background text-left text-muted">
                <th className="px-4 py-3 font-medium">วันที่</th>
                <th className="px-4 py-3 font-medium">สายสอบ</th>
                <th className="px-4 py-3 font-medium">ชุดข้อสอบ</th>
                <th className="px-4 py-3 font-medium">คะแนน</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">เวลา</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.attempt_id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted">
                    {item.submitted_at ? formatThaiDate(item.submitted_at) : "-"}
                  </td>
                  <td className="px-4 py-3">{item.exam_track.name}</td>
                  <td className="px-4 py-3">{item.exam_set.title}</td>
                  <td className="px-4 py-3">
                    <ScoreBadge percent={item.score_percent} />
                  </td>
                  <td className="px-4 py-3">
                    <ResultStatusBadge passed={item.passed} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {Math.floor(item.duration_seconds / 60)} นาที
                  </td>
                  <td className="px-4 py-3">
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={`/exams/${item.exam_set.code}/result?attempt_id=${item.attempt_id}`}
                      >
                        ดูผล
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:hidden">
        <AttemptHistoryTable items={items} />
      </div>
    </div>
  );
}
