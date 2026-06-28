"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/lib/api/pagination";

type AdminPageSizeSelectProps = {
  limit: number;
  onLimitChange: (limit: number) => void;
};

export function AdminPageSizeSelect({ limit, onLimitChange }: AdminPageSizeSelectProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="whitespace-nowrap">รายการต่อหน้า</span>
      <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
        <SelectTrigger className="h-9 w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
