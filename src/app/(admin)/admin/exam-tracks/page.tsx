"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminDataTable } from "@/components/admin/common/AdminDataTable";
import { AdminPaginatedListCard } from "@/components/admin/common/AdminPaginatedListCard";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
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
import { adminExamTracksApi, type AdminExamTrack } from "@/lib/api/admin/endpoints";
import { paginationRowOffset } from "@/lib/api/pagination";
import { toUserFriendlyError } from "@/lib/api";

export default function ExamTracksListPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams("is_active");
  const { items, loading, error, pagination, reload, isEmpty } = useAdminPaginatedList<AdminExamTrack>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminExamTracksApi.list({
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
        is_active: params.is_active || undefined,
      }),
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasFilters = Boolean(params.q || params.is_active);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await adminExamTracksApi.delete(deleteId);
      showToast(result.deactivated ? "ปิดใช้งานสำเร็จ" : "ลบสำเร็จ");
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
      <AdminPageHeader title="สายการสอบ" description="จัดการหมวดหมู่หรือสายการสอบ เช่น ก.พ. ตำรวจ ท้องถิ่น" action={{ label: "เพิ่มสายการสอบ", href: "/admin/exam-tracks/new" }} />
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
            searchPlaceholder="ค้นหาชื่อหรือรหัส..."
            onSearchChange={(v) => updateParams({ q: v }, { resetPage: true })}
            limit={params.limit}
            onLimitChange={(limit) => updateParams({ limit, page: 1 })}
            filters={
              <Select value={params.is_active || "all"} onValueChange={(v) => updateParams({ is_active: v === "all" ? "" : v }, { resetPage: true })}>
                <SelectTrigger className="w-36"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="true">ใช้งาน</SelectItem>
                  <SelectItem value="false">ปิดใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        }
      >
        <AdminDataTable
          items={items}
          rowOffset={paginationRowOffset(pagination.page, pagination.limit)}
          rowKey={(t) => t.id}
          columns={[
            {
              key: "cover",
              header: "ปก",
              cell: (t) =>
                t.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.cover_image_url} alt="" className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                    {t.code.slice(0, 2).toUpperCase()}
                  </div>
                ),
            },
            { key: "name", header: "ชื่อ", className: "font-medium", cell: (t) => t.name },
            { key: "code", header: "รหัส", className: "text-slate-500", cell: (t) => t.code },
            { key: "total_exam_sets", header: "ชุดข้อสอบ", cell: (t) => t.total_exam_sets },
            { key: "total_questions", header: "คำถาม", cell: (t) => t.total_questions },
            { key: "status", header: "สถานะ", cell: (t) => <AdminStatusBadge active={t.is_active} /> },
            {
              key: "updated_at",
              header: "อัปเดต",
              className: "text-slate-500",
              cell: (t) => new Date(t.updated_at).toLocaleDateString("th-TH"),
            },
            {
              key: "actions",
              header: "จัดการ",
              cell: (t) => (
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="icon"><Link href={`/admin/exam-tracks/${t.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                </div>
              ),
            },
          ]}
        />
      </AdminPaginatedListCard>
      <AdminConfirmDialog open={!!deleteId} title="ลบสายการสอบ" description="หากมีชุดข้อสอบอยู่ ระบบจะปิดใช้งานแทนการลบถาวร" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
