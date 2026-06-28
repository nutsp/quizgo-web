import Link from "next/link";
import { AttemptHistoryCard } from "./AttemptHistoryCard";
import { ResultStatusBadge } from "./ResultStatusBadge";
import { ResultViewLink } from "./ResultViewLink";
import { ScoreBadge } from "./ScoreBadge";
import { formatDuration, formatThaiDate } from "@/lib/format";
import type { AttemptHistoryItem } from "@/lib/api/types";

interface AttemptHistoryTableProps {
  items: AttemptHistoryItem[];
}

export function AttemptHistoryTable({ items }: AttemptHistoryTableProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
        ไม่พบประวัติผลสอบตามเงื่อนไขที่เลือก
      </p>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
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
                <tr key={item.attempt_id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-slate-500">
                    {item.submitted_at ? formatThaiDate(item.submitted_at) : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.exam_track.name}</td>
                  <td className="px-4 py-3 font-medium text-slate-950">{item.exam_set.title}</td>
                  <td className="px-4 py-3">
                    <ScoreBadge percent={item.score_percent} passed={item.passed} />
                  </td>
                  <td className="px-4 py-3">
                    <ResultStatusBadge passed={item.passed} status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatDuration(item.duration_seconds)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <ResultViewLink href={resultUrl} />
                      <Link
                        href={`${resultUrl}#review`}
                        className="inline-flex h-8 items-center rounded-lg px-2 text-xs font-medium text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                      >
                        ดูเฉลย
                      </Link>
                      <Link
                        href={`/exams/${item.exam_set.code}`}
                        className="inline-flex h-8 items-center rounded-lg px-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        สอบใหม่
                      </Link>
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
