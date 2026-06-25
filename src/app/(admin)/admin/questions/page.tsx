"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
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
  adminQuestionsApi,
  adminSubjectsApi,
  type AdminQuestion,
  type AdminSubject,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function QuestionsListPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AdminQuestion[]>([]);
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.q = search;
      if (subjectFilter) params.subject_id = subjectFilter;
      if (statusFilter) params.status = statusFilter;
      const data = await adminQuestionsApi.list(params);
      setItems(data.items);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setLoading(false);
    }
  }, [search, subjectFilter, statusFilter, showToast]);

  useEffect(() => {
    adminSubjectsApi.list({ limit: "100" }).then((d) => setSubjects(d.items)).catch(() => {});
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await adminQuestionsApi.delete(deleteId);
      showToast(result.archived ? "เก็บถาวรสำเร็จ" : "ลบสำเร็จ");
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
      <AdminPageHeader title="คลังคำถาม" description="จัดการโจทย์ ตัวเลือก เฉลย และคำอธิบาย" action={{ label: "เพิ่มคำถาม", href: "/admin/questions/new" }} />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={subjectFilter || "all"} onValueChange={(v) => setSubjectFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="หมวดวิชา" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกหมวด</SelectItem>
            {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="สถานะ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="draft">ฉบับร่าง</SelectItem>
            <SelectItem value="published">เผยแพร่</SelectItem>
            <SelectItem value="archived">เก็บถาวร</SelectItem>
          </SelectContent>
        </Select>
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
                <th className="p-3">คำถาม</th>
                <th className="p-3">หมวดวิชา</th>
                <th className="p-3">ระดับ</th>
                <th className="p-3">เฉลย</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((q) => (
                <tr key={q.id} className="border-b border-border last:border-0">
                  <td className="max-w-xs p-3">{q.question_preview ?? q.question_text.slice(0, 80)}</td>
                  <td className="p-3">{q.subject_name}</td>
                  <td className="p-3"><AdminStatusBadge status={q.difficulty} /></td>
                  <td className="p-3">{q.correct_answer}</td>
                  <td className="p-3"><AdminStatusBadge status={q.status} /></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon"><Link href={`/admin/questions/${q.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(q.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminConfirmDialog open={!!deleteId} title="ลบคำถาม" description="หากถูกใช้ในการสอบแล้ว ระบบจะเก็บถาวรแทน" confirmLabel="ลบ" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
