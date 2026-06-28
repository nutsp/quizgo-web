"use client";

import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/common/AdminDataTable";
import { formatDateTime } from "@/lib/admin/labels";
import type { AdminAuditLog } from "@/lib/api/admin/endpoints";

type AuditLogTableProps = {
  items: AdminAuditLog[];
  rowOffset?: number;
  onViewDetail: (item: AdminAuditLog) => void;
};

export function AuditLogTable({ items, rowOffset = 0, onViewDetail }: AuditLogTableProps) {
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
          key: "actor",
          header: "ผู้ดำเนินการ",
          className: "text-slate-600",
          cell: (item) => item.actor_email || item.actor_user_id || "-",
        },
        {
          key: "action",
          header: "Action",
          className: "font-medium",
          cell: (item) => item.action,
        },
        {
          key: "resource_type",
          header: "Resource",
          className: "text-slate-500",
          cell: (item) => item.resource_type,
        },
        {
          key: "resource_name",
          header: "Resource Name",
          className: "max-w-[200px] truncate",
          cell: (item) => item.resource_name || "-",
        },
        {
          key: "ip_address",
          header: "IP Address",
          className: "text-slate-500",
          cell: (item) => item.ip_address || "-",
        },
        {
          key: "detail",
          header: "รายละเอียด",
          cell: (item) => (
            <Button variant="ghost" size="sm" onClick={() => onViewDetail(item)}>
              ดู
            </Button>
          ),
        },
      ]}
    />
  );
}
