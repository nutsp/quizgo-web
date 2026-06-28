"use client";

import { useState } from "react";
import { AdminPaginatedListCard } from "@/components/admin/common/AdminPaginatedListCard";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AuditLogDetail } from "@/components/admin/logs/AuditLogDetail";
import { AuditLogTable } from "@/components/admin/logs/AuditLogTable";
import { Input } from "@/components/ui/input";
import { useAdminListParams } from "@/hooks/useAdminListParams";
import { useAdminPaginatedList } from "@/hooks/useAdminPaginatedList";
import { useToast } from "@/hooks/useToast";
import { toUserFriendlyError } from "@/lib/api";
import { adminAuditLogsApi, type AdminAuditLog } from "@/lib/api/admin/endpoints";
import { paginationRowOffset } from "@/lib/api/pagination";

function toRFC3339(localValue: string) {
  if (!localValue) return "";
  return new Date(localValue).toISOString();
}

export default function AdminAuditLogsPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams(
    "action",
    "resource_type",
    "date_from",
    "date_to"
  );
  const { items, loading, error, pagination, isEmpty } = useAdminPaginatedList<AdminAuditLog>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminAuditLogsApi.list({
        page: params.page,
        limit: params.limit,
        action: params.action || undefined,
        resource_type: params.resource_type || undefined,
        date_from: params.date_from ? toRFC3339(params.date_from) : undefined,
        date_to: params.date_to ? toRFC3339(params.date_to) : undefined,
        sort: params.sort || undefined,
        order: params.order || undefined,
      }),
  });
  const [selected, setSelected] = useState<AdminAuditLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const hasFilters = Boolean(
    params.action || params.resource_type || params.date_from || params.date_to
  );

  const openDetail = async (item: AdminAuditLog) => {
    try {
      const detail = await adminAuditLogsApi.get(item.id);
      setSelected(detail);
      setDetailOpen(true);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Audit Logs"
        description="ตรวจสอบประวัติการเปลี่ยนแปลงข้อมูลสำคัญในระบบ"
      />
      <AdminPaginatedListCard
        loading={loading}
        error={error}
        empty={isEmpty}
        filtered={hasFilters}
        pagination={pagination}
        onPageChange={(page) => updateParams({ page })}
        toolbar={
          <AdminTableToolbar
            limit={params.limit}
            onLimitChange={(limit) => updateParams({ limit, page: 1 })}
            filters={
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  placeholder="Action"
                  value={params.action}
                  onChange={(e) => updateParams({ action: e.target.value }, { resetPage: true })}
                />
                <Input
                  placeholder="Resource type"
                  value={params.resource_type}
                  onChange={(e) => updateParams({ resource_type: e.target.value }, { resetPage: true })}
                />
                <Input
                  type="datetime-local"
                  value={params.date_from}
                  onChange={(e) => updateParams({ date_from: e.target.value }, { resetPage: true })}
                />
                <Input
                  type="datetime-local"
                  value={params.date_to}
                  onChange={(e) => updateParams({ date_to: e.target.value }, { resetPage: true })}
                />
              </div>
            }
          />
        }
      >
        <AuditLogTable
          items={items}
          rowOffset={paginationRowOffset(pagination.page, pagination.limit)}
          onViewDetail={openDetail}
        />
      </AdminPaginatedListCard>

      <AuditLogDetail log={selected} open={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); }} />
    </div>
  );
}
