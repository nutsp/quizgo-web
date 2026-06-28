"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accessLogEventLabels } from "@/lib/admin/labels";

type LogFiltersProps = {
  mode: "access" | "audit";
  email?: string;
  eventType?: string;
  success?: string;
  action?: string;
  resourceType?: string;
  dateFrom?: string;
  dateTo?: string;
  onEmailChange?: (value: string) => void;
  onEventTypeChange?: (value: string) => void;
  onSuccessChange?: (value: string) => void;
  onActionChange?: (value: string) => void;
  onResourceTypeChange?: (value: string) => void;
  onDateFromChange?: (value: string) => void;
  onDateToChange?: (value: string) => void;
};

export function LogFilters(props: LogFiltersProps) {
  const {
    mode,
    email = "",
    eventType = "",
    success = "",
    action = "",
    resourceType = "",
    dateFrom = "",
    dateTo = "",
    onEmailChange,
    onEventTypeChange,
    onSuccessChange,
    onActionChange,
    onResourceTypeChange,
    onDateFromChange,
    onDateToChange,
  } = props;

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {mode === "access" && onEmailChange && (
        <Input placeholder="อีเมล" value={email} onChange={(e) => onEmailChange(e.target.value)} />
      )}
      {mode === "access" && onEventTypeChange && (
        <Select value={eventType || "all"} onValueChange={(v) => onEventTypeChange(v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="เหตุการณ์" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกเหตุการณ์</SelectItem>
            {Object.entries(accessLogEventLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {mode === "access" && onSuccessChange && (
        <Select value={success || "all"} onValueChange={(v) => onSuccessChange(v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="สถานะ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="true">สำเร็จ</SelectItem>
            <SelectItem value="false">ไม่สำเร็จ</SelectItem>
          </SelectContent>
        </Select>
      )}
      {mode === "audit" && onActionChange && (
        <Input placeholder="Action" value={action} onChange={(e) => onActionChange(e.target.value)} />
      )}
      {mode === "audit" && onResourceTypeChange && (
        <Input placeholder="Resource type" value={resourceType} onChange={(e) => onResourceTypeChange(e.target.value)} />
      )}
      {onDateFromChange && (
        <Input type="datetime-local" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
      )}
      {onDateToChange && (
        <Input type="datetime-local" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
      )}
    </div>
  );
}
