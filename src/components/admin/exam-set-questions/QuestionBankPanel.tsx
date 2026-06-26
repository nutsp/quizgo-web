"use client";

import { Loader2 } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminQuestionListItem } from "@/lib/api/admin/exam-set-questions";
import { QuestionFilters } from "./QuestionFilters";
import type { AdminSubject } from "@/lib/api/admin/endpoints";

type QuestionBankPanelProps = {
  questions: AdminQuestionListItem[];
  subjects: AdminSubject[];
  loading: boolean;
  total: number;
  page: number;
  selectedIds: Set<string>;
  disabled: boolean;
  bulkAdding: boolean;
  search: string;
  subjectFilter: string;
  difficultyFilter: string;
  statusFilter: string;
  excludeAssigned: boolean;
  onSearchChange: (value: string) => void;
  onSubjectFilterChange: (value: string) => void;
  onDifficultyFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onExcludeAssignedChange: (value: boolean) => void;
  onToggleSelect: (id: string) => void;
  onSelectAllPage: () => void;
  onClearSelection: () => void;
  onBulkAdd: () => void;
  onPageChange: (page: number) => void;
};

function previewText(q: AdminQuestionListItem): string {
  const text = q.question_text.trim();
  if (text.length <= 120) return text;
  return `${text.slice(0, 120)}...`;
}

export function QuestionBankPanel({
  questions,
  subjects,
  loading,
  total,
  page,
  selectedIds,
  disabled,
  bulkAdding,
  search,
  subjectFilter,
  difficultyFilter,
  statusFilter,
  excludeAssigned,
  onSearchChange,
  onSubjectFilterChange,
  onDifficultyFilterChange,
  onStatusFilterChange,
  onExcludeAssignedChange,
  onToggleSelect,
  onSelectAllPage,
  onClearSelection,
  onBulkAdd,
  onPageChange,
}: QuestionBankPanelProps) {
  const allPageSelected =
    questions.length > 0 && questions.every((q) => selectedIds.has(q.id) || q.already_assigned);
  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-4 font-semibold">คลังคำถาม</h2>
      <QuestionFilters
        search={search}
        onSearchChange={onSearchChange}
        subjectFilter={subjectFilter}
        onSubjectFilterChange={onSubjectFilterChange}
        difficultyFilter={difficultyFilter}
        onDifficultyFilterChange={onDifficultyFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        excludeAssigned={excludeAssigned}
        onExcludeAssignedChange={onExcludeAssignedChange}
        subjects={subjects}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted">
          เลือกแล้ว {selectedIds.size} ข้อ
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || questions.length === 0}
            onClick={onSelectAllPage}
          >
            {allPageSelected ? "ยกเลิกเลือกหน้านี้" : "เลือกทั้งหมดในหน้านี้"}
          </Button>
          {selectedIds.size > 0 && (
            <Button variant="ghost" size="sm" disabled={disabled} onClick={onClearSelection}>
              ล้างการเลือก
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 min-h-[300px] flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : questions.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">
            <p>ไม่พบคำถามที่ตรงกับเงื่อนไข</p>
            <p className="mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => {
              const isAssigned = q.already_assigned;
              const isSelected = selectedIds.has(q.id);
              return (
                <li
                  key={q.id}
                  className={`flex items-start gap-3 rounded-lg border border-border p-3 ${
                    isAssigned ? "opacity-60" : ""
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled || isAssigned}
                    onCheckedChange={() => onToggleSelect(q.id)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{previewText(q)}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {q.subject && (
                        <span className="text-xs text-muted">{q.subject.name}</span>
                      )}
                      <AdminStatusBadge status={q.difficulty} />
                      <AdminStatusBadge status={q.status} />
                      {isAssigned && (
                        <span className="text-xs text-muted">อยู่ในชุดแล้ว</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted">
            หน้า {page} / {totalPages} ({total} ข้อ)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              ก่อนหน้า
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
            >
              ถัดไป
            </Button>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 mt-4 border-t border-border bg-surface pt-4 lg:static lg:border-0 lg:pt-3">
        <Button
          className="w-full"
          disabled={disabled || bulkAdding || selectedIds.size === 0}
          onClick={onBulkAdd}
        >
          {bulkAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังเพิ่ม...
            </>
          ) : (
            `เพิ่มคำถามที่เลือกเข้าชุด (${selectedIds.size})`
          )}
        </Button>
      </div>
    </section>
  );
}
