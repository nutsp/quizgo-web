"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTableContainer } from "@/components/admin/AdminTableContainer";
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
        <AdminTableContainer>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                <th className="px-5 py-3.5 font-medium">ชื่อ</th>
                <th className="px-5 py-3.5 font-medium">รหัส</th>
                <th className="px-5 py-3.5 font-medium">คำอธิบาย</th>
                <th className="px-5 py-3.5 font-medium">จำนวนคำถาม</th>
                <th className="px-5 py-3.5 font-medium">อัปเดต</th>
                <th className="px-5 py-3.5 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-4 font-medium">{s.name}</td>
                  <td className="px-5 py-4 text-slate-500">{s.code}</td>
                  <td className="px-5 py-4 text-slate-500">{s.description || "-"}</td>
                  <td className="px-5 py-4">{s.question_count}</td>
                  <td className="px-5 py-4 text-slate-500">{new Date(s.updated_at).toLocaleDateString("th-TH")}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/subjects/${s.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableContainer>
      )}
      <AdminConfirmDialog open={!!deleteId} title="ลบหมวดวิชา" description="ไม่สามารถลบหมวดวิชาที่มีคำถามอยู่" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
