"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ClipboardCheck,
  Eye,
  MoreHorizontal,
  Pencil,
  ListOrdered,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminDataTable } from "@/components/admin/common/AdminDataTable";
import { AdminPaginatedListCard } from "@/components/admin/common/AdminPaginatedListCard";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { ExamSetPublishDialog } from "@/components/admin/exam-sets/ExamSetPublishDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  adminExamSetsApi,
  adminExamTracksApi,
  type AdminExamSet,
  type AdminExamTrack,
  type ExamSetStatus,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";
import { paginationRowOffset } from "@/lib/api/pagination";

export default function ExamSetsListPage() {
  const { showToast } = useToast();
  const { params, updateParams, searchKey } = useAdminListParams("exam_track_id", "access_type", "status");
  const [tracks, setTracks] = useState<AdminExamTrack[]>([]);
  const { items, loading, error, pagination, reload, isEmpty } = useAdminPaginatedList<AdminExamSet>({
    reloadKey: searchKey,
    onError: (msg) => showToast(msg, "error"),
    fetchPage: () =>
      adminExamSetsApi.list({
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
        exam_track_id: params.exam_track_id || undefined,
        access_type: params.access_type || undefined,
        status: params.status || undefined,
      }),
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [publishTarget, setPublishTarget] = useState<AdminExamSet | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<AdminExamSet | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [unpublishTarget, setUnpublishTarget] = useState<AdminExamSet | null>(null);
  const [unpublishing, setUnpublishing] = useState(false);

  const hasFilters = Boolean(params.q || params.exam_track_id || params.access_type || params.status);

  useEffect(() => {
    adminExamTracksApi.list({ limit: 100 }).then((d) => setTracks(d.items)).catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await adminExamSetsApi.delete(deleteId);
      showToast(result.deactivated ? "ปิดใช้งานสำเร็จ" : "ลบสำเร็จ");
      setDeleteId(null);
      reload();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setDeleting(false);
    }
  };

  const handlePublishClick = async (set: AdminExamSet) => {
    try {
      const readiness = await adminExamSetsApi.getReadiness(set.id);
      if (!readiness.ready) {
        showToast("ชุดข้อสอบยังไม่พร้อมเผยแพร่ กรุณาตรวจความพร้อมก่อน", "error");
        return;
      }
      setPublishTarget(set);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    }
  };

  const handlePublishConfirm = async () => {
    if (!publishTarget) return;
    setPublishing(true);
    try {
      await adminExamSetsApi.publish(publishTarget.id);
      showToast("เผยแพร่ชุดข้อสอบสำเร็จ");
      setPublishTarget(null);
      reload();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!unpublishTarget) return;
    setUnpublishing(true);
    try {
      await adminExamSetsApi.unpublish(unpublishTarget.id);
      showToast("ยกเลิกเผยแพร่สำเร็จ");
      setUnpublishTarget(null);
      reload();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setUnpublishing(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      await adminExamSetsApi.archive(archiveTarget.id);
      showToast("เก็บถาวรชุดข้อสอบสำเร็จ");
      setArchiveTarget(null);
      reload();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setArchiving(false);
    }
  };

  const getStatus = (s: AdminExamSet): ExamSetStatus => s.status ?? "draft";

  return (
    <div>
      <AdminPageHeader
        title="ชุดข้อสอบ"
        description="จัดการชุดข้อสอบที่ผู้ใช้สามารถเลือกทำได้"
        action={{ label: "เพิ่มชุดข้อสอบ", href: "/admin/exam-sets/new" }}
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
            onSearchChange={(v) => updateParams({ q: v }, { resetPage: true })}
            limit={params.limit}
            onLimitChange={(limit) => updateParams({ limit, page: 1 })}
            filters={
              <>
                <Select value={params.exam_track_id || "all"} onValueChange={(v) => updateParams({ exam_track_id: v === "all" ? "" : v }, { resetPage: true })}>
                  <SelectTrigger className="w-44"><SelectValue placeholder="สายการสอบ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสายการสอบ</SelectItem>
                    {tracks.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={params.access_type || "all"} onValueChange={(v) => updateParams({ access_type: v === "all" ? "" : v }, { resetPage: true })}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="ประเภท" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="free">ฟรี</SelectItem>
                    <SelectItem value="paid">ซื้อรายชุด</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="private">เฉพาะผู้ได้รับสิทธิ์</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={params.status || "all"} onValueChange={(v) => updateParams({ status: v === "all" ? "" : v }, { resetPage: true })}>
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
          rowKey={(s) => s.id}
          tableClassName="min-w-[1000px]"
          columns={[
            { key: "title", header: "ชื่อ", className: "font-medium", cell: (s) => s.title },
            { key: "code", header: "รหัส", className: "text-slate-500", cell: (s) => s.code },
            { key: "track", header: "สายการสอบ", cell: (s) => s.exam_track?.name },
            { key: "total_questions", header: "ข้อ", cell: (s) => s.total_questions },
            { key: "duration", header: "เวลา", cell: (s) => `${s.duration_minutes} น.` },
            { key: "access_type", header: "ประเภท", cell: (s) => <AdminStatusBadge status={s.access_type} /> },
            {
              key: "status",
              header: "สถานะเผยแพร่",
              cell: (s) => <AdminStatusBadge status={getStatus(s)} />,
            },
            {
              key: "actions",
              header: "จัดการ",
              cell: (s) => {
                const status = getStatus(s);
                return (
                  <div className="flex items-center gap-1">
                    <Button asChild variant="ghost" size="icon"><Link href={`/admin/exam-sets/${s.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                    <Button asChild variant="ghost" size="icon"><Link href={`/admin/exam-sets/${s.id}/questions`}><ListOrdered className="h-4 w-4" /></Link></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/admin/exam-sets/${s.id}/preview`}><Eye className="mr-2 h-4 w-4" />ดูตัวอย่าง</Link></DropdownMenuItem>
                        {(status === "draft" || status === "published") && (
                          <DropdownMenuItem asChild><Link href={`/admin/exam-sets/${s.id}/edit#readiness`}><ClipboardCheck className="mr-2 h-4 w-4" />ตรวจความพร้อม</Link></DropdownMenuItem>
                        )}
                        {status === "draft" && (
                          <DropdownMenuItem onClick={() => handlePublishClick(s)}><UploadCloud className="mr-2 h-4 w-4" />เผยแพร่</DropdownMenuItem>
                        )}
                        {status === "published" && (
                          <DropdownMenuItem onClick={() => setUnpublishTarget(s)}><Upload className="mr-2 h-4 w-4" />ยกเลิกเผยแพร่</DropdownMenuItem>
                        )}
                        {(status === "draft" || status === "published") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setArchiveTarget(s)}><Archive className="mr-2 h-4 w-4" />เก็บถาวร</DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteId(s.id)} className="text-danger"><Trash2 className="mr-2 h-4 w-4" />ลบ</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              },
            },
          ]}
        />
      </AdminPaginatedListCard>

      <AdminConfirmDialog open={!!deleteId} title="ลบชุดข้อสอบ" description="หากมีประวัติการสอบ ระบบจะปิดใช้งานแทน" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <AdminConfirmDialog open={!!unpublishTarget} title="ยกเลิกเผยแพร่ชุดข้อสอบ?" description="ผู้ใช้งานจะไม่เห็นชุดข้อสอบนี้และไม่สามารถเริ่มทำข้อสอบใหม่ได้ ผลสอบที่ส่งแล้วยังคงอยู่" confirmLabel="ยกเลิกเผยแพร่" loading={unpublishing} onConfirm={handleUnpublish} onCancel={() => setUnpublishTarget(null)} />
      <AdminConfirmDialog open={!!archiveTarget} title="เก็บถาวรชุดข้อสอบ?" description="ชุดข้อสอบจะถูกซ่อนจากผู้ใช้และไม่สามารถเริ่มทำข้อสอบใหม่ได้ ผลสอบที่มีอยู่ยังคงเข้าถึงได้" confirmLabel="เก็บถาวร" loading={archiving} onConfirm={handleArchive} onCancel={() => setArchiveTarget(null)} />
      <ExamSetPublishDialog examSet={publishTarget} open={!!publishTarget} loading={publishing} onConfirm={handlePublishConfirm} onCancel={() => setPublishTarget(null)} />
    </div>
  );
}
