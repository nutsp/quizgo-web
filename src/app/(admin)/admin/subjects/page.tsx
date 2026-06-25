"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import {
  adminSubjectsApi,
  type AdminSubject,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function SubjectsListPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.q = search;
      const data = await adminSubjectsApi.list(params);
      setItems(data.items);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminSubjectsApi.delete(deleteId);
      showToast("ลบสำเร็จ");
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
      <AdminPageHeader title="หมวดวิชา" description="จัดการหมวดวิชาที่ใช้จัดกลุ่มคำถาม" action={{ label: "เพิ่มหมวดวิชา", href: "/admin/subjects/new" }} />
      <div className="mb-4"><Input placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" /></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <p className="text-muted">ไม่พบข้อมูล</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background text-left text-muted">
                <th className="p-3">ชื่อ</th>
                <th className="p-3">รหัส</th>
                <th className="p-3">คำอธิบาย</th>
                <th className="p-3">จำนวนคำถาม</th>
                <th className="p-3">อัปเดต</th>
                <th className="p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-muted">{s.code}</td>
                  <td className="p-3 text-muted">{s.description || "-"}</td>
                  <td className="p-3">{s.question_count}</td>
                  <td className="p-3 text-muted">{new Date(s.updated_at).toLocaleDateString("th-TH")}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/subjects/${s.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminConfirmDialog open={!!deleteId} title="ลบหมวดวิชา" description="ไม่สามารถลบหมวดวิชาที่มีคำถามอยู่" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
