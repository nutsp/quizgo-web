"use client";

import { useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import type { BreakdownItem } from "@/lib/results/transforms";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

type BreakdownTab = "subject" | "tag" | "difficulty";

interface BreakdownTabsProps {
  subjectItems: BreakdownItem[];
  tagItems: BreakdownItem[];
  difficultyItems?: BreakdownItem[];
}

const TAB_LABELS: Record<BreakdownTab, string> = {
  subject: "รายวิชา",
  tag: "กลุ่มคำถาม",
  difficulty: "ระดับความยาก",
};

function BreakdownRows({ items }: { items: BreakdownItem[] }) {
  if (items.length === 0) {
    return <p className="py-3 text-center text-sm text-slate-500">ไม่มีข้อมูล</p>;
  }

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.id ?? item.name} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium text-slate-900">{item.name}</span>
            <span className="shrink-0 tabular-nums text-xs text-slate-500">
              <span className="font-semibold text-teal-700">
                {formatPercent(item.score_percent)}
              </span>
              <span className="mx-1 text-slate-300">·</span>
              {item.correct_count}/{item.total_count}
            </span>
          </div>
          <Progress value={item.score_percent} className="h-1" />
        </div>
      ))}
    </div>
  );
}

export function BreakdownTabs({
  subjectItems,
  tagItems,
  difficultyItems = [],
}: BreakdownTabsProps) {
  const availableTabs = useMemo(() => {
    const tabs: BreakdownTab[] = [];
    if (subjectItems.length > 0) tabs.push("subject");
    if (tagItems.length > 0) tabs.push("tag");
    if (difficultyItems.length > 0) tabs.push("difficulty");
    return tabs;
  }, [subjectItems, tagItems, difficultyItems]);

  const [activeTab, setActiveTab] = useState<BreakdownTab>(
    availableTabs[0] ?? "subject"
  );

  const activeItems =
    activeTab === "subject"
      ? subjectItems
      : activeTab === "tag"
        ? tagItems
        : difficultyItems;

  if (availableTabs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">สรุปคะแนนแยกส่วน</p>

      <div className="mt-3 space-y-3">
        {availableTabs.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  activeTab === tab
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        )}

        <BreakdownRows items={activeItems} />
      </div>
    </div>
  );
}
