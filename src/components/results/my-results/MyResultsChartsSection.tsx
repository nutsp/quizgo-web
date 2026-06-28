import type { ScoreTrendPoint, SubjectPerformanceItem } from "@/lib/api/types";
import { ScoreTrendChart } from "./ScoreTrendChart";
import { SubjectPerformanceRadarChart } from "./SubjectPerformanceRadarChart";

type MyResultsChartsSectionProps = {
  scoreTrend: ScoreTrendPoint[];
  subjectPerformance: SubjectPerformanceItem[];
};

export function MyResultsChartsSection({
  scoreTrend,
  subjectPerformance,
}: MyResultsChartsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-950">แนวโน้มคะแนน</h2>
          <p className="mt-1 text-sm text-slate-500">
            คะแนนย้อนหลังจากการทำข้อสอบล่าสุด
          </p>
        </div>
        <ScoreTrendChart data={scoreTrend} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-950">คะแนนตามหมวดวิชา</h2>
          <p className="mt-1 text-sm text-slate-500">
            ดูจุดแข็งและจุดที่ควรฝึกเพิ่มในแต่ละหมวด
          </p>
        </div>
        <SubjectPerformanceRadarChart data={subjectPerformance} />
      </div>
    </section>
  );
}
