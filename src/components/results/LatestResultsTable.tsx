import { formatThaiDate } from "@/lib/format";
import type { AttemptHistoryItem } from "@/lib/api/types";
import { ResultStatusBadge } from "./ResultStatusBadge";
import { ResultViewLink } from "./ResultViewLink";
import { ScoreBadge } from "./ScoreBadge";

interface LatestResultsTableProps {
  items: AttemptHistoryItem[];
}

function LatestResultMobileCard({ item }: { item: AttemptHistoryItem }) {
  const resultUrl = `/exams/${item.exam_set.code}/result?attempt_id=${item.attempt_id}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
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

      <p className="mt-2 text-xs text-slate-500">
        {item.submitted_at ? formatThaiDate(item.submitted_at) : "-"}
      </p>
    </div>
  );
}

export function LatestResultsTable({ items }: LatestResultsTableProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
        ยังไม่มีผลสอบล่าสุด
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
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
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
                  {Math.floor(item.duration_seconds / 60)} นาที
                </td>
                <td className="px-4 py-3">
                  <ResultViewLink
                    href={`/exams/${item.exam_set.code}/result?attempt_id=${item.attempt_id}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <LatestResultMobileCard key={item.attempt_id} item={item} />
        ))}
      </div>
    </>
  );
}
