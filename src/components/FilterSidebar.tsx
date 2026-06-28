"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { filterOptions } from "@/data/exams";
import type { ExamLibraryFilters, FilterGroupKey } from "@/lib/exam/libraryFilters";
import { toggleFilterValue } from "@/lib/exam/libraryFilters";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: ExamLibraryFilters;
  onFiltersChange: (filters: ExamLibraryFilters) => void;
  className?: string;
  showHeader?: boolean;
}

type FilterGroupConfig = {
  key: FilterGroupKey;
  title: string;
  options: readonly string[];
  defaultOpen: boolean;
};

const FILTER_GROUPS: FilterGroupConfig[] = [
  {
    key: "examTypes",
    title: "ประเภทข้อสอบ",
    options: filterOptions.examTypes,
    defaultOpen: true,
  },
  {
    key: "subjects",
    title: "หมวดวิชา",
    options: filterOptions.subjects,
    defaultOpen: true,
  },
  {
    key: "formats",
    title: "รูปแบบ",
    options: filterOptions.formats,
    defaultOpen: false,
  },
  {
    key: "difficulties",
    title: "ระดับความยาก",
    options: filterOptions.difficulties,
    defaultOpen: false,
  },
  {
    key: "prices",
    title: "ราคา",
    options: filterOptions.prices,
    defaultOpen: true,
  },
  {
    key: "statuses",
    title: "สถานะ",
    options: filterOptions.statuses,
    defaultOpen: false,
  },
];

function CollapsibleFilterGroup({
  title,
  options,
  selected,
  defaultOpen,
  onToggle,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  defaultOpen: boolean;
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-slate-900"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="space-y-1 pb-3">
          {options.map((option) => {
            const checked = selected.includes(option);
            const id = `filter-${title}-${option}`;

            return (
              <label
                key={option}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() => onToggle(option)}
                />
                <span className="flex-1">{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  className,
  showHeader = true,
}: FilterSidebarProps) {
  const handleToggle = (group: FilterGroupKey, value: string) => {
    onFiltersChange(toggleFilterValue(filters, group, value));
  };

  return (
    <aside className={cn("space-y-1", className)}>
      {showHeader && (
        <h2 className="mb-2 text-sm font-bold text-slate-900">ตัวกรอง</h2>
      )}
      {FILTER_GROUPS.map((group) => (
        <CollapsibleFilterGroup
          key={group.key}
          title={group.title}
          options={group.options}
          selected={filters[group.key]}
          defaultOpen={group.defaultOpen}
          onToggle={(value) => handleToggle(group.key, value)}
        />
      ))}
    </aside>
  );
}
