"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPaginatedListCard } from "@/components/admin/common/AdminPaginatedListCard";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UserRoleBadge } from "@/components/admin/users/UserRoleBadge";
import { UserStatusBadge } from "@/components/admin/users/UserStatusBadge";
import { UserEntitlementsSection } from "@/components/admin/users/UserEntitlementsSection";
import { UserTable } from "@/components/admin/users/UserTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { formatDateTime } from "@/lib/admin/labels";
import { toUserFriendlyError } from "@/lib/api";
import {
  adminUsersApi,
  type AdminUser,
  type AdminUserDetail,
} from "@/lib/api/admin/endpoints";
import { paginationRowOffset } from "@/lib/api/pagination";

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams("role", "status");
  const { items, loading, error, pagination, reload, isEmpty } = useAdminPaginatedList<AdminUser>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminUsersApi.list({
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
        role: params.role || undefined,
        status: params.status || undefined,
        sort: params.sort || undefined,
        order: params.order || undefined,
      }),
  });
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    user: AdminUser;
    type: "status" | "role";
    value: string;
  } | null>(null);
  const [acting, setActing] = useState(false);

  const hasFilters = Boolean(params.q || params.role || params.status);

  const openDetail = async (user: AdminUser) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const data = await adminUsersApi.get(user.id);
      setDetail(data);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const confirmAction = async () => {
    if (!pendingAction) return;
    setActing(true);
    try {
      if (pendingAction.type === "status") {
        await adminUsersApi.updateStatus(pendingAction.user.id, pendingAction.value);
        showToast("อัปเดตสถานะสำเร็จ");
      } else {
        await adminUsersApi.updateRole(pendingAction.user.id, pendingAction.value);
        showToast("อัปเดตบทบาทสำเร็จ");
      }
      setPendingAction(null);
      reload();
      if (detail?.id === pendingAction.user.id) {
        const updated = await adminUsersApi.get(pendingAction.user.id);
        setDetail(updated);
      }
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setActing(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="ผู้ใช้งาน"
        description="จัดการบัญชีผู้ใช้งาน บทบาท และสถานะการใช้งาน"
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
            search={params.q}
            searchPlaceholder="ค้นหาชื่อหรืออีเมล..."
            onSearchChange={(v) => updateParams({ q: v }, { resetPage: true })}
            limit={params.limit}
            onLimitChange={(limit) => updateParams({ limit, page: 1 })}
            filters={
              <>
                <Select
                  value={params.role || "all"}
                  onValueChange={(v) => updateParams({ role: v === "all" ? "" : v }, { resetPage: true })}
                >
                  <SelectTrigger className="w-40"><SelectValue placeholder="บทบาท" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกบทบาท</SelectItem>
                    <SelectItem value="user">ผู้ใช้งาน</SelectItem>
                    <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={params.status || "all"}
                  onValueChange={(v) => updateParams({ status: v === "all" ? "" : v }, { resetPage: true })}
                >
                  <SelectTrigger className="w-44"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="active">ใช้งานอยู่</SelectItem>
                    <SelectItem value="suspended">ระงับชั่วคราว</SelectItem>
                    <SelectItem value="disabled">ปิดใช้งาน</SelectItem>
                  </SelectContent>
                </Select>
              </>
            }
          />
        }
      >
        <UserTable
          items={items}
          rowOffset={paginationRowOffset(pagination.page, pagination.limit)}
          onView={openDetail}
          onChangeStatus={(user, value) => setPendingAction({ user, type: "status", value })}
          onChangeRole={(user, value) => setPendingAction({ user, type: "role", value })}
        />
      </AdminPaginatedListCard>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>ข้อมูลผู้ใช้งาน</DialogTitle></DialogHeader>
          {detailLoading || !detail ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-6 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <p><span className="text-slate-500">ชื่อ:</span> {detail.display_name}</p>
                <p><span className="text-slate-500">อีเมล:</span> {detail.email}</p>
                <p className="flex items-center gap-2"><span className="text-slate-500">บทบาท:</span> <UserRoleBadge role={detail.role} /></p>
                <p className="flex items-center gap-2"><span className="text-slate-500">สถานะ:</span> <UserStatusBadge status={detail.status} /></p>
                <p><span className="text-slate-500">วันที่สมัคร:</span> {formatDateTime(detail.created_at)}</p>
                <p><span className="text-slate-500">เข้าสู่ระบบล่าสุด:</span> {formatDateTime(detail.last_login_at)}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={detail.role} onValueChange={(v) => { if (v !== detail.role) setPendingAction({ user: detail, type: "role", value: v }); }}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">ผู้ใช้งาน</SelectItem>
                    <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={detail.status} onValueChange={(v) => { if (v !== detail.status) setPendingAction({ user: detail, type: "status", value: v }); }}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">ใช้งานอยู่</SelectItem>
                    <SelectItem value="suspended">ระงับชั่วคราว</SelectItem>
                    <SelectItem value="disabled">ปิดใช้งาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <UserEntitlementsSection userId={detail.id} />

              <div>
                <h3 className="mb-2 font-medium">ประวัติการเข้าใช้งานล่าสุด</h3>
                {detail.recent_access_logs.length === 0 ? (
                  <p className="text-slate-500">ไม่มีข้อมูล</p>
                ) : (
                  <ul className="space-y-2 rounded-xl border border-slate-200 p-3">
                    {detail.recent_access_logs.map((log) => (
                      <li key={log.id} className="flex justify-between gap-3 text-slate-600">
                        <span>{formatDateTime(log.created_at)} — {log.event_type}</span>
                        <span>{log.success ? "สำเร็จ" : "ไม่สำเร็จ"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-medium">ประวัติการเปลี่ยนแปลงล่าสุด</h3>
                {detail.recent_audit_logs.length === 0 ? (
                  <p className="text-slate-500">ไม่มีข้อมูล</p>
                ) : (
                  <ul className="space-y-2 rounded-xl border border-slate-200 p-3">
                    {detail.recent_audit_logs.map((log) => (
                      <li key={log.id} className="text-slate-600">
                        {formatDateTime(log.created_at)} — {log.action}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={!!pendingAction}
        title={pendingAction?.type === "role" ? "เปลี่ยนบทบาทผู้ใช้งาน" : "เปลี่ยนสถานะผู้ใช้งาน"}
        description="ยืนยันการเปลี่ยนแปลงข้อมูลผู้ใช้งานนี้"
        confirmLabel="ยืนยัน"
        loading={acting}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
