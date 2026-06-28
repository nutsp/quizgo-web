"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Power, Trash2 } from "lucide-react";
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
import { adminQuestionTagsApi, type AdminQuestionTag } from "@/lib/api/admin/endpoints";
import { paginationRowOffset } from "@/lib/api/pagination";
import { toUserFriendlyError } from "@/lib/api";

export default function QuestionTagsListPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams("is_active");
  const { items, loading, error, pagination, reload, isEmpty } = useAdminPaginatedList<AdminQuestionTag>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminQuestionTagsApi.list({
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
        is_active: params.is_active || undefined,
      }),
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const hasFilters = Boolean(params.q || params.is_active);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await adminQuestionTagsApi.delete(deleteId);
      if (result.status === "deactivated") {
        showToast(result.message ?? "ปิดใช้งานแทนการลบ");
      } else {
        showToast("ลบสำเร็จ");
      }
      setDeleteId(null);
      reload();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (tag: AdminQuestionTag) => {
    setTogglingId(tag.id);
    try {
      await adminQuestionTagsApi.update(tag.id, {
        name: tag.name,
        code: tag.code,
        description: tag.description,
        color: tag.color,
        is_active: !tag.is_active,
      });
      showToast(tag.is_active ? "ปิดใช้งานแล้ว" : "เปิดใช้งานแล้ว");
      reload();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader title="กลุ่มคำถาม" description="จัดการหัวข้อย่อยหรือกลุ่มคำถามสำหรับใช้ค้นหาและวิเคราะห์ผลสอบ" action={{ label: "เพิ่มกลุ่มคำถาม", href: "/admin/question-tags/new" }} />
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
          rowKey={(tag) => tag.id}
          columns={[
            { key: "name", header: "ชื่อกลุ่มคำถาม", className: "font-medium", cell: (tag) => tag.name },
            { key: "code", header: "Code", className: "text-slate-500", cell: (tag) => tag.code },
            { key: "question_count", header: "จำนวนคำถาม", cell: (tag) => tag.question_count },
            {
              key: "status",
              header: "สถานะ",
              cell: (tag) => <AdminStatusBadge status={tag.is_active ? "published" : "archived"} />,
            },
            {
              key: "updated_at",
              header: "อัปเดตล่าสุด",
              className: "text-slate-500",
              cell: (tag) => new Date(tag.updated_at).toLocaleDateString("th-TH"),
            },
            {
              key: "actions",
              header: "จัดการ",
              cell: (tag) => (
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="icon"><Link href={`/admin/question-tags/${tag.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button variant="ghost" size="icon" disabled={togglingId === tag.id} onClick={() => handleToggleActive(tag)}><Power className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(tag.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                </div>
              ),
            },
          ]}
        />
      </AdminPaginatedListCard>
      <AdminConfirmDialog open={!!deleteId} title="ลบกลุ่มคำถาม" description="หากกลุ่มคำถามถูกใช้งานอยู่ ระบบจะปิดใช้งานแทนการลบ" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
