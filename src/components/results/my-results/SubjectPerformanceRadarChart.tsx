"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SubjectPerformanceItem } from "@/lib/api/types";
import { formatPercent } from "@/lib/format";
import {
  buildSubjectPerformanceRadarData,
  type RadarSubjectItem,
} from "@/lib/my-results/chartData";

type SubjectPerformanceRadarChartProps = {
  data: SubjectPerformanceItem[];
};

function RadarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RadarSubjectItem }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-semibold text-slate-950">หมวด: {item.subject_name}</p>
      <p className="mt-1 text-slate-600">
        คะแนนเฉลี่ย: {formatPercent(item.score_percent)}
      </p>
      {item.total_questions ? (
        <p className="text-slate-500">จำนวนข้อ: {item.total_questions} ข้อ</p>
      ) : null}
    </div>
  );
}

function SubjectRadarEmptyState() {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-50 px-6 text-center">
      <div>
        <p className="font-semibold text-slate-900">
          ยังมีข้อมูลไม่พอสำหรับแสดงกราฟหมวดวิชา
        </p>
        <p className="mt-2 text-sm text-slate-500">
          ลองทำข้อสอบเพิ่มเพื่อให้ระบบวิเคราะห์ได้แม่นยำขึ้น
        </p>
      </div>
    </div>
  );
}

export function SubjectPerformanceRadarChart({ data }: SubjectPerformanceRadarChartProps) {
  const chartData = buildSubjectPerformanceRadarData(data);

  if (chartData.length < 3) {
    return <SubjectRadarEmptyState />;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={chartData.length > 6 ? "62%" : "70%"}
          margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
        >
          <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={5}
            tick={{ fill: "#94A3B8", fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="คะแนน"
            dataKey="score_percent"
            stroke="#0F766E"
            fill="#0F766E"
            fillOpacity={0.22}
            strokeWidth={2}
            dot={{ r: 3, fill: "#0F766E", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#0F766E" }}
          />
          <Tooltip content={<RadarTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
