"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminDataTable } from "@/components/admin/common/AdminDataTable";
import { AdminPaginatedListCard } from "@/components/admin/common/AdminPaginatedListCard";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
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
import {
  adminQuestionsApi,
  adminSubjectsApi,
  adminQuestionTagsApi,
  type AdminQuestion,
  type AdminSubject,
  type AdminQuestionTag,
} from "@/lib/api/admin/endpoints";
import { QuestionTagBadge } from "@/components/admin/question-tags/QuestionTagBadge";
import { paginationRowOffset } from "@/lib/api/pagination";
import { toUserFriendlyError } from "@/lib/api";

export default function QuestionsListPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams("subject_id", "tag_id", "status");
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [tags, setTags] = useState<AdminQuestionTag[]>([]);
  const { items, loading, error, pagination, reload, isEmpty } = useAdminPaginatedList<AdminQuestion>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminQuestionsApi.list({
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
        subject_id: params.subject_id || undefined,
        tag_id: params.tag_id || undefined,
        status: params.status || undefined,
      }),
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasFilters = Boolean(params.q || params.subject_id || params.tag_id || params.status);

  useEffect(() => {
    adminSubjectsApi.list({ limit: 100 }).then((d) => setSubjects(d.items)).catch(() => {});
    adminQuestionTagsApi.list({ limit: 100, is_active: "true" }).then((d) => setTags(d.items)).catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await adminQuestionsApi.delete(deleteId);
      showToast(result.archived ? "เก็บถาวรสำเร็จ" : "ลบสำเร็จ");
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
      <AdminPageContainer
        title="คลังคำถาม"
        description="จัดการโจทย์ ตัวเลือก เฉลย และคำอธิบาย"
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/questions/import">นำเข้าคำถาม</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/questions/new">เพิ่มคำถาม</Link>
            </Button>
          </>
        }
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
            searchPlaceholder="ค้นหาคำถาม..."
            onSearchChange={(v) => updateParams({ q: v }, { resetPage: true })}
            limit={params.limit}
            onLimitChange={(limit) => updateParams({ limit, page: 1 })}
            filters={
              <>
                <Select
                  value={params.subject_id || "all"}
                  onValueChange={(v) => updateParams({ subject_id: v === "all" ? "" : v }, { resetPage: true })}
                >
                  <SelectTrigger className="w-40"><SelectValue placeholder="หมวดวิชา" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกหมวด</SelectItem>
                    {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select
                  value={params.tag_id || "all"}
                  onValueChange={(v) => updateParams({ tag_id: v === "all" ? "" : v }, { resetPage: true })}
                >
                  <SelectTrigger className="w-44"><SelectValue placeholder="กลุ่มคำถาม" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกกลุ่ม</SelectItem>
                    {tags.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select
                  value={params.status || "all"}
                  onValueChange={(v) => updateParams({ status: v === "all" ? "" : v }, { resetPage: true })}
                >
                  <SelectTrigger className="w-36"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="draft">ฉบับร่าง</SelectItem>
                    <SelectItem value="published">เผยแพร่</SelectItem>
                    <SelectItem value="archived">เก็บถาวร</SelectItem>
                  </SelectContent>
                </Select>
              </>
            }
          />
        }
      >
        <AdminDataTable
          items={items}
          rowOffset={paginationRowOffset(pagination.page, pagination.limit)}
          rowKey={(q) => q.id}
          columns={[
            {
              key: "question",
              header: "คำถาม",
              className: "max-w-xs",
              cell: (q) => q.question_preview ?? q.question_text.slice(0, 80),
            },
            { key: "subject", header: "หมวดวิชา", cell: (q) => q.subject_name },
            {
              key: "tags",
              header: "กลุ่มคำถาม",
              cell: (q) => (
                <div className="flex flex-wrap gap-1">
                  {(q.tags ?? []).map((t) => (
                    <QuestionTagBadge key={t.id} name={t.name} color={t.color} />
                  ))}
                  {(q.tags ?? []).length === 0 && <span className="text-slate-400">-</span>}
                </div>
              ),
            },
            { key: "difficulty", header: "ระดับ", cell: (q) => <AdminStatusBadge status={q.difficulty} /> },
            { key: "correct_answer", header: "เฉลย", cell: (q) => q.correct_answer },
            { key: "status", header: "สถานะ", cell: (q) => <AdminStatusBadge status={q.status} /> },
            {
              key: "actions",
              header: "จัดการ",
              cell: (q) => (
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="icon"><Link href={`/admin/questions/${q.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(q.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                </div>
              ),
            },
          ]}
        />
      </AdminPaginatedListCard>
      <AdminConfirmDialog open={!!deleteId} title="ลบคำถาม" description="หากถูกใช้ในการสอบแล้ว ระบบจะเก็บถาวรแทน" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
