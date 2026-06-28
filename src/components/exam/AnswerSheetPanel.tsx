"use client";

import { type Ref } from "react";
import { RealisticOMRAnswerSheet } from "@/components/exam/omr/RealisticOMRAnswerSheet";
import type { RealisticOMRAnswerSheetProps } from "@/components/exam/omr/RealisticOMRAnswerSheet";
import { cn } from "@/lib/utils";

export interface AnswerSheetPanelProps extends RealisticOMRAnswerSheetProps {
  className?: string;
  scrollContainerRef?: Ref<HTMLDivElement>;
}

export function AnswerSheetPanel({
  className,
  scrollContainerRef,
  fillContainer = true,
  hint = "กดค้างที่วงกลมเพื่อฝนคำตอบ",
  ...omrProps
}: AnswerSheetPanelProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      <RealisticOMRAnswerSheet
        {...omrProps}
        fillContainer={fillContainer}
        showSummary={false}
        scrollContainerRef={scrollContainerRef}
        hint={hint}
        className="h-full min-h-0 flex-1 rounded-none border-0 shadow-none"
      />
    </div>
  );
}
