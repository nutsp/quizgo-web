"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AssignedQuestionsPanel } from "@/components/admin/exam-set-questions/AssignedQuestionsPanel";
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
  adminExamSetQuestionsApi,
  adminQuestionsApi,
  adminSubjectsApi,
  type AdminExamSet,
  type AdminExamSetQuestion,
  type AdminQuestion,
  type AdminSubject,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function ExamSetQuestionsPage({ params }: { params: { id: string } }) {
  const { showToast } = useToast();
  const [examSet, setExamSet] = useState<AdminExamSet | null>(null);
  const [assigned, setAssigned] = useState<AdminExamSetQuestion[]>([]);
  const [bank, setBank] = useState<AdminQuestion[]>([]);
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("published");

  const loadAssigned = useCallback(async () => {
    const data = await adminExamSetQuestionsApi.list(params.id);
    setAssigned(data.items);
    return data.items;
  }, [params.id]);

  const loadBank = useCallback(async (currentAssigned?: AdminExamSetQuestion[]) => {
    const p: Record<string, string> = { limit: "50" };
    if (search) p.q = search;
    if (subjectFilter) p.subject_id = subjectFilter;
    if (statusFilter) p.status = statusFilter;
    const data = await adminQuestionsApi.list(p);
    const list = currentAssigned ?? assigned;
    const assignedIds = new Set(list.map((a) => a.question_id));
    setBank(data.items.filter((q) => !assignedIds.has(q.id)));
  }, [search, subjectFilter, statusFilter, assigned]);

  useEffect(() => {
    Promise.all([
      adminExamSetsApi.get(params.id),
      adminExamSetQuestionsApi.list(params.id),
      adminSubjectsApi.list({ limit: "100" }),
    ])
      .then(([set, qs, subs]) => {
        setExamSet(set);
        setAssigned(qs.items);
        setSubjects(subs.items);
      })
      .catch((e) => showToast(toUserFriendlyError(e), "error"))
      .finally(() => setLoading(false));
  }, [params.id, showToast]);

  useEffect(() => {
    if (!loading) loadBank().catch(() => {});
  }, [loading, loadBank]);

  const handleAdd = async (questionId: string) => {
    try {
      await adminExamSetQuestionsApi.add(params.id, { question_id: questionId });
      showToast("เพิ่มเข้าชุดสำเร็จ");
      const items = await loadAssigned();
      await loadBank(items);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    }
  };

  const handleRemove = async (questionId: string) => {
    try {
      await adminExamSetQuestionsApi.remove(params.id, questionId);
      showToast("นำออกสำเร็จ");
      const items = await loadAssigned();
      await loadBank(items);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    }
  };

  const handleMove = async (questionId: string, direction: "up" | "down") => {
    const idx = assigned.findIndex((a) => a.question_id === questionId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= assigned.length) return;
    const items = [...assigned];
    [items[idx], items[swapIdx]] = [items[swapIdx], items[idx]];
    try {
      await adminExamSetQuestionsApi.reorder(
        params.id,
        items.map((item, i) => ({ question_id: item.question_id, question_no: i + 1 }))
      );
      await loadAssigned();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!examSet) return <p className="text-muted">ไม่พบข้อมูล</p>;

  return (
    <div>
      <AdminPageHeader
        title="จัดคำถามในชุดข้อสอบ"
        description={`${examSet.title} — เลือกคำถามจากคลังและกำหนดลำดับข้อสอบ`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-4 font-semibold">คลังคำถาม</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            <Input placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
            <Select value={subjectFilter || "all"} onValueChange={(v) => setSubjectFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="หมวดวิชา" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกหมวด</SelectItem>
                {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="published">เผยแพร่</SelectItem>
                <SelectItem value="draft">ฉบับร่าง</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ul className="max-h-[500px] space-y-2 overflow-y-auto">
            {bank.length === 0 ? (
              <li className="text-sm text-muted">ไม่พบคำถาม</li>
            ) : (
              bank.map((q) => (
                <li key={q.id} className="flex items-start justify-between gap-2 rounded-lg border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{q.question_preview ?? q.question_text.slice(0, 100)}</p>
                    <div className="mt-1 flex gap-2">
                      <span className="text-xs text-muted">{q.subject_name}</span>
                      <AdminStatusBadge status={q.difficulty} />
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleAdd(q.id)}>
                    <Plus className="mr-1 h-3 w-3" />เพิ่มเข้าชุด
                  </Button>
                </li>
              ))
            )}
          </ul>
        </section>
        <AssignedQuestionsPanel
          items={assigned}
          onRemove={handleRemove}
          onMoveUp={(id) => handleMove(id, "up")}
          onMoveDown={(id) => handleMove(id, "down")}
        />
      </div>
    </div>
  );
}
