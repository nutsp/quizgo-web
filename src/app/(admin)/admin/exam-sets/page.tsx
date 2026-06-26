"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ClipboardCheck,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  ListOrdered,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { ExamSetPublishDialog } from "@/components/admin/exam-sets/ExamSetPublishDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableContainer } from "@/components/admin/AdminTableContainer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import {
  adminExamSetsApi,
  adminExamTracksApi,
  type AdminExamSet,
  type AdminExamTrack,
  type ExamSetStatus,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function ExamSetsListPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AdminExamSet[]>([]);
  const [tracks, setTracks] = useState<AdminExamTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [publishTarget, setPublishTarget] = useState<AdminExamSet | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<AdminExamSet | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [unpublishTarget, setUnpublishTarget] = useState<AdminExamSet | null>(null);
  const [unpublishing, setUnpublishing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.q = search;
      if (trackFilter) params.exam_track_id = trackFilter;
      if (accessFilter) params.access_type = accessFilter;
      const data = await adminExamSetsApi.list(params);
      setItems(data.items);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setLoading(false);
    }
  }, [search, trackFilter, accessFilter, showToast]);

  useEffect(() => {
    adminExamTracksApi.list({ limit: "100" }).then((d) => setTracks(d.items)).catch(() => {});
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await adminExamSetsApi.delete(deleteId);
      showToast(result.deactivated ? "ปิดใช้งานสำเร็จ" : "ลบสำเร็จ");
      setDeleteId(null);
      load();
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
      load();
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
      load();
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
      load();
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
      <div className="mb-4 flex flex-wrap gap-3">
        <Input placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={trackFilter || "all"} onValueChange={(v) => setTrackFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="สายการสอบ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสายการสอบ</SelectItem>
            {tracks.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={accessFilter || "all"} onValueChange={(v) => setAccessFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="ประเภท" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="free">ฟรี</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <p className="text-muted">ไม่พบข้อมูล</p>
      ) : (
        <AdminTableContainer>
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                <th className="px-5 py-3.5 font-medium">ชื่อ</th>
                <th className="px-5 py-3.5 font-medium">รหัส</th>
                <th className="px-5 py-3.5 font-medium">สายการสอบ</th>
                <th className="px-5 py-3.5 font-medium">ข้อ</th>
                <th className="px-5 py-3.5 font-medium">เวลา</th>
                <th className="px-5 py-3.5 font-medium">ประเภท</th>
                <th className="px-5 py-3.5 font-medium">สถานะเผยแพร่</th>
                <th className="px-5 py-3.5 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => {
                const status = getStatus(s);
                return (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-4 font-medium">{s.title}</td>
                    <td className="px-5 py-4 text-slate-500">{s.code}</td>
                    <td className="px-5 py-4">{s.exam_track?.name}</td>
                    <td className="px-5 py-4">{s.total_questions}</td>
                    <td className="px-5 py-4">{s.duration_minutes} น.</td>
                    <td className="px-5 py-4"><AdminStatusBadge status={s.access_type} /></td>
                    <td className="px-5 py-4"><AdminStatusBadge status={status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="icon" title="แก้ไข">
                          <Link href={`/admin/exam-sets/${s.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" title="จัดคำถาม">
                          <Link href={`/admin/exam-sets/${s.id}/questions`}><ListOrdered className="h-4 w-4" /></Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/exam-sets/${s.id}/preview`}>
                                <Eye className="mr-2 h-4 w-4" />ดูตัวอย่าง
                              </Link>
                            </DropdownMenuItem>
                            {(status === "draft" || status === "published") && (
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/exam-sets/${s.id}/edit#readiness`}>
                                  <ClipboardCheck className="mr-2 h-4 w-4" />ตรวจความพร้อม
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {status === "draft" && (
                              <DropdownMenuItem onClick={() => handlePublishClick(s)}>
                                <UploadCloud className="mr-2 h-4 w-4" />เผยแพร่
                              </DropdownMenuItem>
                            )}
                            {status === "published" && (
                              <DropdownMenuItem onClick={() => setUnpublishTarget(s)}>
                                <Upload className="mr-2 h-4 w-4" />ยกเลิกเผยแพร่
                              </DropdownMenuItem>
                            )}
                            {(status === "draft" || status === "published") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setArchiveTarget(s)}>
                                  <Archive className="mr-2 h-4 w-4" />เก็บถาวร
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(s.id)} className="text-danger">
                              <Trash2 className="mr-2 h-4 w-4" />ลบ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AdminTableContainer>
      )}

      <AdminConfirmDialog
        open={!!deleteId}
        title="ลบชุดข้อสอบ"
        description="หากมีประวัติการสอบ ระบบจะปิดใช้งานแทน"
        confirmLabel="ลบ"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <AdminConfirmDialog
        open={!!unpublishTarget}
        title="ยกเลิกเผยแพร่ชุดข้อสอบ?"
        description="ผู้ใช้งานจะไม่เห็นชุดข้อสอบนี้และไม่สามารถเริ่มทำข้อสอบใหม่ได้ ผลสอบที่ส่งแล้วยังคงอยู่"
        confirmLabel="ยกเลิกเผยแพร่"
        loading={unpublishing}
        onConfirm={handleUnpublish}
        onCancel={() => setUnpublishTarget(null)}
      />

      <AdminConfirmDialog
        open={!!archiveTarget}
        title="เก็บถาวรชุดข้อสอบ?"
        description="ชุดข้อสอบจะถูกซ่อนจากผู้ใช้และไม่สามารถเริ่มทำข้อสอบใหม่ได้ ผลสอบที่มีอยู่ยังคงเข้าถึงได้"
        confirmLabel="เก็บถาวร"
        loading={archiving}
        onConfirm={handleArchive}
        onCancel={() => setArchiveTarget(null)}
      />

      <ExamSetPublishDialog
        examSet={publishTarget}
        open={!!publishTarget}
        loading={publishing}
        onConfirm={handlePublishConfirm}
        onCancel={() => setPublishTarget(null)}
      />
    </div>
  );
}
