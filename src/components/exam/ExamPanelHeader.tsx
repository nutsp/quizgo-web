"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const examPanelHeaderClass =
  "flex min-h-[88px] items-center justify-between border-b border-slate-200 px-6 py-4";

export type ExamPanelHeaderProps = {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function ExamPanelHeader({
  title,
  subtitle,
  meta,
  actions,
  className,
}: ExamPanelHeaderProps) {
  return (
    <div className={cn(examPanelHeaderClass, "shrink-0 bg-white", className)}>
      <div className="min-w-0 flex-1 pr-4">
        <h2 className="truncate text-lg font-bold text-slate-950">{title}</h2>
        {(subtitle || meta) && (
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
            {subtitle && (
              <p className="truncate text-sm text-slate-500">{subtitle}</p>
            )}
            {meta}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
