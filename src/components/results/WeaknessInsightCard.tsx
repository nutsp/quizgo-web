import type { BreakdownItem } from "@/lib/results/transforms";
import { formatPercent } from "@/lib/format";

interface WeaknessInsightCardProps {
  items: BreakdownItem[];
  compact?: boolean;
}

export function WeaknessInsightCard({ items, compact = false }: WeaknessInsightCardProps) {
  const weakest = items.slice(0, 3);
  const allHighScore =
    items.length > 0 && items.every((item) => item.score_percent >= 80);

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-900">จุดที่ควรฝึกเพิ่ม</p>

      {weakest.length === 0 ? (
        <p className="text-sm text-slate-500">ยังไม่มีข้อมูลวิเคราะห์จุดอ่อน</p>
      ) : (
        <ol className={compact ? "space-y-2" : "space-y-2.5"}>
          {weakest.map((item, index) => (
            <li key={item.id ?? item.name} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-600">
                  {index + 1}
                </span>
                <span className="truncate text-sm text-slate-900">{item.name}</span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-amber-600">
                {formatPercent(item.score_percent)}
              </span>
            </li>
          ))}
        </ol>
      )}

      <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
        {allHighScore
          ? "ภาพรวมดีมาก ควรรักษาความสม่ำเสมอและทบทวนข้อที่ผิดเล็กน้อย"
          : "ควรทบทวนหัวข้อที่ได้คะแนนต่ำก่อนเริ่มทำชุดถัดไป"}
      </p>
    </div>
  );
}
