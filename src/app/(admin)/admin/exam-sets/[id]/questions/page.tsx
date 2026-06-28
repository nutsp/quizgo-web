"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { ExamSetReadinessPanel } from "@/components/admin/exam-sets/ExamSetReadinessPanel";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AssignedQuestionsPanel } from "@/components/admin/exam-set-questions/AssignedQuestionsPanel";
import { BulkAddSummary } from "@/components/admin/exam-set-questions/BulkAddSummary";
import { QuestionBankPanel } from "@/components/admin/exam-set-questions/QuestionBankPanel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useAdminListParams } from "@/hooks/useAdminListParams";
import {
  adminExamSetsApi,
  adminSubjectsApi,
  adminQuestionTagsApi,
  type AdminExamSet,
  type AdminSubject,
  type AdminQuestionTag,
} from "@/lib/api/admin/endpoints";
import {
  adminExamSetQuestionsApi,
  type AssignedExamQuestion,
  type AdminQuestionListItem,
  type BulkAddResponse,
  type ExamSetQuestionsSummary,
} from "@/lib/api/admin/exam-set-questions";
import { toUserFriendlyError } from "@/lib/api";

type Tab = "bank" | "assigned";

export default function ExamSetQuestionsPage({ params }: { params: { id: string } }) {
  const { showToast } = useToast();
  const { params: listParams, updateParams, searchKey } = useAdminListParams(
    "subject_id",
    "tag_id",
    "difficulty",
    "status",
    "exclude_assigned"
  );
  const [examSet, setExamSet] = useState<AdminExamSet | null>(null);
  const [examSetSummary, setExamSetSummary] = useState<ExamSetQuestionsSummary | null>(null);
  const [assigned, setAssigned] = useState<AssignedExamQuestion[]>([]);
  const [localAssigned, setLocalAssigned] = useState<AssignedExamQuestion[]>([]);
  const [bank, setBank] = useState<AdminQuestionListItem[]>([]);
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [tags, setTags] = useState<AdminQuestionTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [bankLoading, setBankLoading] = useState(false);
  const [bulkAdding, setBulkAdding] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkResult, setBulkResult] = useState<BulkAddResponse | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("bank");
  const [bankPagination, setBankPagination] = useState({
    page: 1, limit: 20, total: 0, total_pages: 1, has_next: false, has_prev: false,
  });

  const excludeAssigned = listParams.exclude_assigned !== "false";
  const statusFilter = listParams.status || "published";

  const dirty = useMemo(() => {
    if (assigned.length !== localAssigned.length) return true;
    return assigned.some(
      (item, i) => item.question_id !== localAssigned[i]?.question_id
    );
  }, [assigned, localAssigned]);

  const loadAssigned = useCallback(async () => {
    const data = await adminExamSetQuestionsApi.listAssignedQuestions(params.id, {
      page: 1,
      limit: 100,
    });
    setExamSetSummary(data.exam_set);
    setAssigned(data.items);
    setLocalAssigned(data.items);
    setIsLocked(data.is_locked_by_attempts);
    return data;
  }, [params.id]);

  const loadBank = useCallback(async () => {
    setBankLoading(true);
    try {
      const data = await adminExamSetQuestionsApi.getAvailableQuestions(params.id, {
        page: listParams.page,
        limit: listParams.limit,
        exclude_assigned: excludeAssigned ? "true" : "false",
        q: listParams.q || undefined,
        subject_id: listParams.subject_id || undefined,
        tag_id: listParams.tag_id || undefined,
        difficulty: listParams.difficulty || undefined,
        status: statusFilter || undefined,
      });
      setBank(data.items);
      setBankPagination(data.pagination);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setBankLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, searchKey, showToast]);

  useEffect(() => {
    Promise.all([
      adminExamSetsApi.get(params.id),
      adminExamSetQuestionsApi.listAssignedQuestions(params.id),
      adminSubjectsApi.list({ limit: "100" }),
      adminQuestionTagsApi.list({ limit: "100", is_active: "true" }),
    ])
      .then(([set, assignedData, subs, tagData]) => {
        setExamSet(set);
        setExamSetSummary(assignedData.exam_set);
        setAssigned(assignedData.items);
        setLocalAssigned(assignedData.items);
        setIsLocked(assignedData.is_locked_by_attempts);
        setSubjects(subs.items);
        setTags(tagData.items);
      })
      .catch((e) => showToast(toUserFriendlyError(e), "error"))
      .finally(() => setLoading(false));
  }, [params.id, showToast]);

  useEffect(() => {
    if (!loading) void loadBank();
  }, [loading, loadBank]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllPage = () => {
    const selectable = bank.filter((q) => !q.already_assigned);
    const allSelected = selectable.every((q) => selectedIds.has(q.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        selectable.forEach((q) => next.delete(q.id));
      } else {
        selectable.forEach((q) => next.add(q.id));
      }
      return next;
    });
  };

  const handleBulkAdd = async () => {
    if (selectedIds.size === 0) return;
    setBulkAdding(true);
    try {
      const result = await adminExamSetQuestionsApi.bulkAdd(params.id, {
        question_ids: Array.from(selectedIds),
        score: 1,
        append_to_end: true,
      });
      setBulkResult(result);
      showToast(`เพิ่มคำถามเข้าชุดข้อสอบแล้ว ${result.added_count} ข้อ`);
      setSelectedIds(new Set());
      await loadAssigned();
      await loadBank();
      if (examSet) {
        const updated = await adminExamSetsApi.get(params.id);
        setExamSet(updated);
      }
      setActiveTab("assigned");
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setBulkAdding(false);
    }
  };

  const handleMove = (questionId: string, direction: "up" | "down") => {
    const idx = localAssigned.findIndex((a) => a.question_id === questionId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= localAssigned.length) return;
    const items = [...localAssigned];
    [items[idx], items[swapIdx]] = [items[swapIdx], items[idx]];
    setLocalAssigned(
      items.map((item, i) => ({ ...item, question_no: i + 1 }))
    );
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      await adminExamSetQuestionsApi.reorder(
        params.id,
        localAssigned.map((item, i) => ({
          question_id: item.question_id,
          question_no: i + 1,
        }))
      );
      showToast("บันทึกลำดับสำเร็จ");
      await loadAssigned();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
      setLocalAssigned(assigned);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await adminExamSetQuestionsApi.remove(params.id, removeTarget);
      showToast("ลบคำถามออกจากชุดแล้ว");
      setRemoveTarget(null);
      await loadAssigned();
      await loadBank();
      if (examSet) {
        const updated = await adminExamSetsApi.get(params.id);
        setExamSet(updated);
      }
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!examSet || !examSetSummary) {
    return <p className="text-muted">ไม่พบข้อมูล</p>;
  }

  const summary = examSetSummary;

  return (
    <div>
      <AdminPageHeader
        title="จัดคำถามในชุดข้อสอบ"
        description="เลือกคำถามจากคลังคำถามและกำหนดลำดับข้อสอบในชุดนี้"
      />

      <section className="mb-6 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">ชุดข้อสอบ</p>
            <h2 className="text-lg font-semibold">{summary.title}</h2>
            {examSet.exam_track && (
              <p className="mt-1 text-sm text-muted">{examSet.exam_track.name}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span>จำนวนคำถามในชุด: <strong>{summary.total_questions}</strong> ข้อ</span>
              <span>เวลาสอบ: <strong>{summary.duration_minutes}</strong> นาที</span>
              <span>คะแนนผ่าน: <strong>{summary.passing_score}%</strong></span>
              <AdminStatusBadge status={examSet.status ?? "draft"} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/exam-sets/${params.id}/preview`}>
                <ExternalLink className="mr-1 h-4 w-4" />
                ดูตัวอย่างชุดข้อสอบ
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/exam-sets">กลับไปหน้าชุดข้อสอบ</Link>
            </Button>
            {dirty && (
              <Button size="sm" disabled={isLocked || savingOrder} onClick={handleSaveOrder}>
                บันทึกลำดับ
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="mb-6">
        <ExamSetReadinessPanel examSetId={params.id} status={examSet.status} />
      </div>

      {isLocked && (
        <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">ชุดข้อสอบนี้มีผลสอบแล้ว</p>
            <p className="mt-1">
              เพื่อป้องกันผลสอบเดิมคลาดเคลื่อน ระบบไม่อนุญาตให้แก้ไขคำถามในชุดนี้
            </p>
          </div>
        </div>
      )}

      {bulkResult && (
        <div className="mb-4">
          <BulkAddSummary result={bulkResult} onDismiss={() => setBulkResult(null)} />
        </div>
      )}

      <div className="mb-4 flex gap-2 lg:hidden">
        <Button
          variant={activeTab === "bank" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setActiveTab("bank")}
        >
          คลังคำถาม
        </Button>
        <Button
          variant={activeTab === "assigned" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setActiveTab("assigned")}
        >
          คำถามในชุด
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={activeTab === "assigned" ? "hidden lg:block" : ""}>
          <QuestionBankPanel
            questions={bank}
            subjects={subjects}
            tags={tags}
            loading={bankLoading}
            total={bankPagination.total}
            page={bankPagination.page}
            limit={bankPagination.limit}
            totalPages={bankPagination.total_pages}
            hasNext={bankPagination.has_next}
            hasPrev={bankPagination.has_prev}
            selectedIds={selectedIds}
            disabled={isLocked}
            bulkAdding={bulkAdding}
            search={listParams.q}
            subjectFilter={listParams.subject_id}
            tagFilter={listParams.tag_id}
            difficultyFilter={listParams.difficulty}
            statusFilter={statusFilter}
            excludeAssigned={excludeAssigned}
            onSearchChange={(v) => updateParams({ q: v }, { resetPage: true })}
            onSubjectFilterChange={(v) => updateParams({ subject_id: v }, { resetPage: true })}
            onTagFilterChange={(v) => updateParams({ tag_id: v }, { resetPage: true })}
            onDifficultyFilterChange={(v) => updateParams({ difficulty: v }, { resetPage: true })}
            onStatusFilterChange={(v) => updateParams({ status: v === "published" ? "" : v }, { resetPage: true })}
            onExcludeAssignedChange={(v) => updateParams({ exclude_assigned: v ? "true" : "false" }, { resetPage: true })}
            onToggleSelect={handleToggleSelect}
            onSelectAllPage={handleSelectAllPage}
            onClearSelection={() => setSelectedIds(new Set())}
            onBulkAdd={handleBulkAdd}
            onPageChange={(page) => updateParams({ page })}
          />
        </div>
        <div className={activeTab === "bank" ? "hidden lg:block" : ""}>
          <AssignedQuestionsPanel
            items={localAssigned}
            disabled={isLocked}
            dirty={dirty}
            saving={savingOrder}
            onMoveUp={(id) => handleMove(id, "up")}
            onMoveDown={(id) => handleMove(id, "down")}
            onRemove={setRemoveTarget}
            onSaveOrder={handleSaveOrder}
          />
        </div>
      </div>

      <AdminConfirmDialog
        open={removeTarget !== null}
        title="ลบคำถามออกจากชุด"
        description="ต้องการลบคำถามนี้ออกจากชุดข้อสอบหรือไม่?"
        confirmLabel="ลบออกจากชุด"
        loading={removing}
        onConfirm={handleRemove}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}
