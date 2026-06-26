"use client";

import type { BulkAddResponse } from "@/lib/api/admin/exam-set-questions";

type BulkAddSummaryProps = {
  result: BulkAddResponse | null;
  onDismiss: () => void;
};

export function BulkAddSummary({ result, onDismiss }: BulkAddSummaryProps) {
  if (!result) return null;

  return (
    <div className="rounded-lg border border-border bg-surface p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">
            เพิ่มคำถามสำเร็จ {result.added_count} ข้อ
            {result.skipped_count > 0 && ` (ข้าม ${result.skipped_count} ข้อ)`}
          </p>
          <p className="mt-1 text-muted">
            คำถามในชุดทั้งหมด {result.total_questions} ข้อ
          </p>
          {(result.skipped_count ?? 0) > 0 && (
            <p className="mt-1 text-xs text-muted">
              ไม่สามารถเพิ่มคำถามซ้ำในชุดเดิมได้ ({result.skipped_count} ข้อ)
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-muted hover:text-foreground"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
