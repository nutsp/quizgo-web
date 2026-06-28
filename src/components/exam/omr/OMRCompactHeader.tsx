"use client";

import { ExamPanelHeader } from "@/components/exam/ExamPanelHeader";

export type OMRCompactHeaderProps = {
  examTitle: string;
  className?: string;
};

export function OMRCompactHeader({ examTitle, className }: OMRCompactHeaderProps) {
  return (
    <ExamPanelHeader
      className={className}
      title="กระดาษคำตอบ"
      subtitle={examTitle}
    />
  );
}
