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
import type { RadarChartItem } from "@/lib/results/transforms";
import { formatPercent } from "@/lib/format";

interface PerformanceRadarChartProps {
  data: RadarChartItem[];
  chartLabel: string;
  compact?: boolean;
}

function truncateLabel(label: string, max = 12): string {
  if (label.length <= max) return label;
  return `${label.slice(0, max).trim()}…`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RadarChartItem }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-slate-900">{item.label}</p>
      <p className="mt-1 text-teal-700">{formatPercent(item.score_percent)}</p>
      <p className="text-slate-500">
        ถูก {item.correct_count}/{item.total_count} ข้อ
      </p>
    </div>
  );
}

export function PerformanceRadarChart({
  data,
  chartLabel,
  compact = false,
}: PerformanceRadarChartProps) {
  if (data.length === 0) {
    return (
      <div className={compact ? "py-8" : "py-10"}>
        <p className="text-center text-sm text-slate-500">
          ยังมีข้อมูลไม่พอสำหรับแสดงกราฟภาพรวม
        </p>
      </div>
    );
  }

  const chartHeight = compact ? 220 : 260;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-900">{chartLabel}</p>

      <div className="w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={data.length > 6 ? "62%" : "68%"}
            margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
          >
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => truncateLabel(String(value), 14)}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tickCount={5}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="คะแนน"
              dataKey="score_percent"
              stroke="#0f766e"
              fill="#14b8a6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 3, fill: "#0f766e", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#0f766e" }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {data.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
            title={item.label}
          >
            <span className="max-w-[8rem] truncate font-medium">{item.label}</span>
            <span className="font-semibold text-teal-700">
              {formatPercent(item.score_percent)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
