"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { filterOptions } from "@/data/exams";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  className?: string;
}

function FilterGroup({
  title,
  options,
}: {
  title: string;
  options: readonly string[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-foreground"
          >
            <Checkbox id={`filter-${title}-${option}`} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  return (
    <aside className={cn("space-y-6", className)}>
      <FilterGroup title="ประเภทข้อสอบ" options={filterOptions.examTypes} />
      <FilterGroup title="หมวดวิชา" options={filterOptions.subjects} />
      <FilterGroup title="รูปแบบ" options={filterOptions.formats} />
      <FilterGroup title="ระดับความยาก" options={filterOptions.difficulties} />
      <FilterGroup title="ราคา" options={filterOptions.prices} />
      <FilterGroup title="สถานะ" options={filterOptions.statuses} />
    </aside>
  );
}
