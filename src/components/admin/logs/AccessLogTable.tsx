"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/common/AdminDataTable";
import { accessLogEventLabels, formatDateTime } from "@/lib/admin/labels";
import type { AdminAccessLog } from "@/lib/api/admin/endpoints";

type AccessLogTableProps = {
  items: AdminAccessLog[];
  rowOffset?: number;
  onViewDetail?: (item: AdminAccessLog) => void;
};

export function AccessLogTable({ items, rowOffset = 0, onViewDetail }: AccessLogTableProps) {
  return (
    <AdminDataTable
      items={items}
      rowOffset={rowOffset}
      rowKey={(item) => item.id}
      columns={[
        {
          key: "created_at",
          header: "เวลา",
          className: "whitespace-nowrap text-slate-500",
          cell: (item) => formatDateTime(item.created_at),
        },
        {
          key: "event_type",
          header: "เหตุการณ์",
          cell: (item) => accessLogEventLabels[item.event_type] ?? item.event_type,
        },
        {
          key: "email",
          header: "ผู้ใช้งาน/อีเมล",
          className: "text-slate-600",
          cell: (item) => item.email || item.user_id || "-",
        },
        {
          key: "success",
          header: "สถานะ",
          cell: (item) => (
            <Badge
              variant="secondary"
              className={item.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
            >
              {item.success ? "สำเร็จ" : "ไม่สำเร็จ"}
            </Badge>
          ),
        },
        {
          key: "ip_address",
          header: "IP Address",
          className: "text-slate-500",
          cell: (item) => item.ip_address || "-",
        },
        {
          key: "user_agent",
          header: "User Agent",
          className: "max-w-[180px] truncate text-slate-500",
          cell: (item) => (
            <span title={item.user_agent}>{item.user_agent || "-"}</span>
          ),
        },
        {
          key: "detail",
          header: "รายละเอียด",
          cell: (item) =>
            onViewDetail ? (
              <Button variant="ghost" size="sm" onClick={() => onViewDetail(item)}>
                ดู
              </Button>
            ) : (
              <span className="text-slate-500">{item.message || "-"}</span>
            ),
        },
      ]}
    />
  );
}
