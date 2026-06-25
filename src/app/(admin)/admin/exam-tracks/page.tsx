"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
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
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background text-left text-muted">
                <th className="p-3">ปก</th>
                <th className="p-3">ชื่อ</th>
                <th className="p-3">รหัส</th>
                <th className="p-3">ชุดข้อสอบ</th>
                <th className="p-3">คำถาม</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3">อัปเดต</th>
                <th className="p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    {t.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.cover_image_url} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                        {t.code.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3 text-muted">{t.code}</td>
                  <td className="p-3">{t.total_exam_sets}</td>
                  <td className="p-3">{t.total_questions}</td>
                  <td className="p-3"><AdminStatusBadge active={t.is_active} /></td>
                  <td className="p-3 text-muted">{new Date(t.updated_at).toLocaleDateString("th-TH")}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/exam-tracks/${t.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
