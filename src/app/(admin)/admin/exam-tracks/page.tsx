"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableContainer } from "@/components/admin/AdminTableContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import {
  adminExamTracksApi,
  type AdminExamTrack,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function ExamTracksListPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AdminExamTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.q = search;
      const data = await adminExamTracksApi.list(params);
      setItems(data.items);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await adminExamTracksApi.delete(deleteId);
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
        title="สายการสอบ"
        description="จัดการหมวดหมู่หรือสายการสอบ เช่น ก.พ. ตำรวจ ท้องถิ่น"
        action={{ label: "เพิ่มสายการสอบ", href: "/admin/exam-tracks/new" }}
      />
      <div className="mb-4">
        <Input
          placeholder="ค้นหาชื่อหรือรหัส..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <p className="text-muted">ไม่พบข้อมูล</p>
      ) : (
        <AdminTableContainer>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                <th className="px-5 py-3.5 font-medium">ปก</th>
                <th className="px-5 py-3.5 font-medium">ชื่อ</th>
                <th className="px-5 py-3.5 font-medium">รหัส</th>
                <th className="px-5 py-3.5 font-medium">ชุดข้อสอบ</th>
                <th className="px-5 py-3.5 font-medium">คำถาม</th>
                <th className="px-5 py-3.5 font-medium">สถานะ</th>
                <th className="px-5 py-3.5 font-medium">อัปเดต</th>
                <th className="px-5 py-3.5 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-4">
                    {t.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.cover_image_url} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                        {t.code.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium">{t.name}</td>
                  <td className="px-5 py-4 text-slate-500">{t.code}</td>
                  <td className="px-5 py-4">{t.total_exam_sets}</td>
                  <td className="px-5 py-4">{t.total_questions}</td>
                  <td className="px-5 py-4"><AdminStatusBadge active={t.is_active} /></td>
                  <td className="px-5 py-4 text-slate-500">{new Date(t.updated_at).toLocaleDateString("th-TH")}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/exam-tracks/${t.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableContainer>
      )}
      <AdminConfirmDialog
        open={!!deleteId}
        title="ลบสายการสอบ"
        description="หากมีชุดข้อสอบอยู่ ระบบจะปิดใช้งานแทนการลบถาวร"
        confirmLabel="ลบ"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
