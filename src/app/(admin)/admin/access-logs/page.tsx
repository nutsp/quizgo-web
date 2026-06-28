"use client";

import { useState } from "react";
import { AdminPaginatedListCard } from "@/components/admin/common/AdminPaginatedListCard";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AccessLogTable } from "@/components/admin/logs/AccessLogTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminListParams } from "@/hooks/useAdminListParams";
import { useAdminPaginatedList } from "@/hooks/useAdminPaginatedList";
import { useToast } from "@/hooks/useToast";
import { accessLogEventLabels, formatDateTime } from "@/lib/admin/labels";
import { adminAccessLogsApi, type AdminAccessLog } from "@/lib/api/admin/endpoints";
import { paginationRowOffset } from "@/lib/api/pagination";

function toRFC3339(localValue: string) {
  if (!localValue) return "";
  return new Date(localValue).toISOString();
}

export default function AdminAccessLogsPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams(
    "email",
    "event_type",
    "success",
    "date_from",
    "date_to"
  );
  const { items, loading, error, pagination, isEmpty } = useAdminPaginatedList<AdminAccessLog>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminAccessLogsApi.list({
        page: params.page,
        limit: params.limit,
        email: params.email || undefined,
        event_type: params.event_type || undefined,
        success: params.success || undefined,
        date_from: params.date_from ? toRFC3339(params.date_from) : undefined,
        date_to: params.date_to ? toRFC3339(params.date_to) : undefined,
        sort: params.sort || undefined,
        order: params.order || undefined,
      }),
  });
  const [selected, setSelected] = useState<AdminAccessLog | null>(null);

  const hasFilters = Boolean(
    params.email || params.event_type || params.success || params.date_from || params.date_to
  );

  return (
    <div>
      <AdminPageHeader
        title="Access Logs"
        description="ตรวจสอบประวัติการเข้าสู่ระบบและกิจกรรมการเข้าถึงบัญชี"
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
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Input
                  placeholder="อีเมล"
                  value={params.email}
                  onChange={(e) => updateParams({ email: e.target.value }, { resetPage: true })}
                />
                <Select
                  value={params.event_type || "all"}
                  onValueChange={(v) => updateParams({ event_type: v === "all" ? "" : v }, { resetPage: true })}
                >
                  <SelectTrigger><SelectValue placeholder="เหตุการณ์" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกเหตุการณ์</SelectItem>
                    {Object.entries(accessLogEventLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={params.success || "all"}
                  onValueChange={(v) => updateParams({ success: v === "all" ? "" : v }, { resetPage: true })}
                >
                  <SelectTrigger><SelectValue placeholder="สถานะ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="true">สำเร็จ</SelectItem>
                    <SelectItem value="false">ไม่สำเร็จ</SelectItem>
                  </SelectContent>
                </Select>
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
        <AccessLogTable
          items={items}
          rowOffset={paginationRowOffset(pagination.page, pagination.limit)}
          onViewDetail={setSelected}
        />
      </AdminPaginatedListCard>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>รายละเอียด Access Log</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">เวลา:</span> {formatDateTime(selected.created_at)}</p>
              <p><span className="text-slate-500">เหตุการณ์:</span> {accessLogEventLabels[selected.event_type] ?? selected.event_type}</p>
              <p><span className="text-slate-500">อีเมล:</span> {selected.email || "-"}</p>
              <p><span className="text-slate-500">สถานะ:</span> {selected.success ? "สำเร็จ" : "ไม่สำเร็จ"}</p>
              <p><span className="text-slate-500">IP:</span> {selected.ip_address || "-"}</p>
              <p className="break-all"><span className="text-slate-500">User Agent:</span> {selected.user_agent || "-"}</p>
              <p><span className="text-slate-500">ข้อความ:</span> {selected.message || "-"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
