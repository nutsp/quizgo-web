"use client";

import { X } from "lucide-react";
import type { ActiveFilterChip } from "@/lib/exam/libraryFilters";
import { cn } from "@/lib/utils";

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onRemove: (chip: ActiveFilterChip) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilterChips({
  chips,
  onRemove,
  onClearAll,
  className,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-slate-500">ตัวกรองที่เลือก:</span>
      {chips.map((chip) => (
        <button
          key={`${chip.group}-${chip.value}`}
          type="button"
          onClick={() => onRemove(chip)}
          className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
        >
          {chip.value}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-teal-700 hover:underline"
      >
        ล้างทั้งหมด
      </button>
    </div>
  );
}
