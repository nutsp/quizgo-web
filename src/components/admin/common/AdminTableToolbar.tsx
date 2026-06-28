"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminPageSizeSelect } from "./AdminPageSizeSelect";

type AdminTableToolbarProps = {
  search?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  filters?: ReactNode;
  actions?: ReactNode;
};

export function AdminTableToolbar({
  search = "",
  searchPlaceholder = "ค้นหา...",
  onSearchChange,
  limit,
  onLimitChange,
  filters,
  actions,
}: AdminTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {onSearchChange && (
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {filters}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {limit !== undefined && onLimitChange && (
            <AdminPageSizeSelect limit={limit} onLimitChange={onLimitChange} />
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}
