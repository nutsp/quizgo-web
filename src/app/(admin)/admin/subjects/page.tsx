"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminDataTable } from "@/components/admin/common/AdminDataTable";
import { AdminPaginatedListCard } from "@/components/admin/common/AdminPaginatedListCard";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { useAdminListParams } from "@/hooks/useAdminListParams";
import { useAdminPaginatedList } from "@/hooks/useAdminPaginatedList";
import { useToast } from "@/hooks/useToast";
import { adminSubjectsApi, type AdminSubject } from "@/lib/api/admin/endpoints";
import { paginationRowOffset } from "@/lib/api/pagination";
import { toUserFriendlyError } from "@/lib/api";

export default function SubjectsListPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams();
  const { items, loading, error, pagination, reload, isEmpty } = useAdminPaginatedList<AdminSubject>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminSubjectsApi.list({
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
      }),
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminSubjectsApi.delete(deleteId);
      showToast("ลบสำเร็จ");
      setDeleteId(null);
      reload();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="หมวดวิชา" description="จัดการหมวดวิชาที่ใช้จัดกลุ่มคำถาม" action={{ label: "เพิ่มหมวดวิชา", href: "/admin/subjects/new" }} />
      <AdminPaginatedListCard
        loading={loading}
        error={error}
        empty={isEmpty}
        filtered={Boolean(params.q)}
        pagination={pagination}
        onPageChange={(page) => updateParams({ page })}
        toolbar={
          <AdminTableToolbar
            search={params.q}
            onSearchChange={(v) => updateParams({ q: v }, { resetPage: true })}
            limit={params.limit}
            onLimitChange={(limit) => updateParams({ limit, page: 1 })}
          />
        }
      >
        <AdminDataTable
          items={items}
          rowOffset={paginationRowOffset(pagination.page, pagination.limit)}
          rowKey={(s) => s.id}
          columns={[
            { key: "name", header: "ชื่อ", className: "font-medium", cell: (s) => s.name },
            { key: "code", header: "รหัส", className: "text-slate-500", cell: (s) => s.code },
            { key: "description", header: "คำอธิบาย", className: "text-slate-500", cell: (s) => s.description || "-" },
            { key: "question_count", header: "จำนวนคำถาม", cell: (s) => s.question_count },
            {
              key: "updated_at",
              header: "อัปเดต",
              className: "text-slate-500",
              cell: (s) => new Date(s.updated_at).toLocaleDateString("th-TH"),
            },
            {
              key: "actions",
              header: "จัดการ",
              cell: (s) => (
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="icon"><Link href={`/admin/subjects/${s.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                </div>
              ),
            },
          ]}
        />
      </AdminPaginatedListCard>
      <AdminConfirmDialog open={!!deleteId} title="ลบหมวดวิชา" description="ไม่สามารถลบหมวดวิชาที่มีคำถามอยู่" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
