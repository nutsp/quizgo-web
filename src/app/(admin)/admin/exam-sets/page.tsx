"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, ListOrdered, Loader2, Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
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
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border bg-background text-left text-muted">
                <th className="p-3">ชื่อ</th>
                <th className="p-3">รหัส</th>
                <th className="p-3">สายการสอบ</th>
                <th className="p-3">ข้อ</th>
                <th className="p-3">เวลา</th>
                <th className="p-3">ประเภท</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium">{s.title}</td>
                  <td className="p-3 text-muted">{s.code}</td>
                  <td className="p-3">{s.exam_track?.name}</td>
                  <td className="p-3">{s.total_questions}</td>
                  <td className="p-3">{s.duration_minutes} น.</td>
                  <td className="p-3"><AdminStatusBadge status={s.access_type} /></td>
                  <td className="p-3"><AdminStatusBadge active={s.is_active} /></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/exam-sets/${s.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/exam-sets/${s.id}/questions`}><ListOrdered className="h-4 w-4" /></Link></Button>
                      <Button asChild variant="ghost" size="icon"><Link href={`/exams/${s.code}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminConfirmDialog open={!!deleteId} title="ลบชุดข้อสอบ" description="หากมีประวัติการสอบ ระบบจะปิดใช้งานแทน" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
