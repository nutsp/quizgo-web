"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  chips?: string[];
  onChipClick?: (chip: string) => void;
  activeChip?: string | null;
}

export function SearchBar({
  placeholder = "ค้นหา...",
  title,
  subtitle,
  className,
  value,
  onChange,
  chips,
  onChipClick,
  activeChip,
}: SearchBarProps) {
  return (
    <div className={cn("w-full", className)}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="h-11 rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-none focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-100"
        />
      </div>

      {chips && chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChipClick?.(chip)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeChip === chip
                  ? "border-teal-200 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              )}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
