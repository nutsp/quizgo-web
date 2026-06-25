"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  chips?: string[];
  onChipClick?: (chip: string) => void;
  activeChip?: string | null;
}

export function SearchBar({
  placeholder = "ค้นหา...",
  className,
  chips,
  onChipClick,
  activeChip,
}: SearchBarProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input placeholder={placeholder} className="pl-10" />
      </div>
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChipClick?.(chip)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeChip === chip
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface text-muted hover:border-primary/30 hover:text-primary"
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
