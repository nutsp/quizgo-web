"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScoreTrendPoint } from "@/lib/api/types";
import { formatPercent, formatThaiDateTime } from "@/lib/format";
import {
  buildScoreTrendChartData,
  type ScoreTrendChartPoint,
} from "@/lib/my-results/chartData";

type ScoreTrendChartProps = {
  data: ScoreTrendPoint[];
};

function ScoreTrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ScoreTrendChartPoint }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-slate-950">ชุดข้อสอบ: {item.exam_set_title}</p>
      <p className="mt-1 text-teal-700">คะแนน: {formatPercent(item.score_percent)}</p>
      <p className="text-slate-500">วันที่: {formatThaiDateTime(item.submitted_at)}</p>
    </div>
  );
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const chartData = buildScoreTrendChartData(data);

  if (chartData.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
        <p className="text-sm text-slate-500">
          {chartData.length === 1
            ? "ทำข้อสอบเพิ่มอีกครั้งเพื่อดูแนวโน้มคะแนน"
            : "ยังไม่มีข้อมูลเพียงพอสำหรับแสดงแนวโน้มคะแนน"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748B", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E2E8F0" }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#64748B", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip content={<ScoreTrendTooltip />} />
          <Line
            type="monotone"
            dataKey="score_percent"
            stroke="#0F766E"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#0F766E", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#0F766E" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
