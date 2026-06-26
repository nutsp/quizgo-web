"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssignedExamQuestion } from "@/lib/api/admin/exam-set-questions";
import { AssignedQuestionRow } from "./AssignedQuestionRow";

type AssignedQuestionsPanelProps = {
  items: AssignedExamQuestion[];
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onMoveUp: (questionId: string) => void;
  onMoveDown: (questionId: string) => void;
  onRemove: (questionId: string) => void;
  onSaveOrder: () => void;
};

export function AssignedQuestionsPanel({
  items,
  disabled,
  dirty,
  saving,
  onMoveUp,
  onMoveDown,
  onRemove,
  onSaveOrder,
}: AssignedQuestionsPanelProps) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-semibold">คำถามในชุดข้อสอบ ({items.length})</h2>
        {dirty && (
          <Button size="sm" disabled={disabled || saving} onClick={onSaveOrder}>
            {saving ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกลำดับ"
            )}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-sm text-muted">
          <p>ยังไม่มีคำถามในชุดข้อสอบนี้</p>
          <p className="mt-1">เลือกคำถามจากคลังด้านซ้ายเพื่อเพิ่มเข้าชุดข้อสอบ</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="p-2">ข้อ</th>
                <th className="p-2">คำถาม</th>
                <th className="p-2">หมวด</th>
                <th className="p-2">ความยาก</th>
                <th className="p-2">คะแนน</th>
                <th className="p-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <AssignedQuestionRow
                  key={item.question_id}
                  item={item}
                  index={index}
                  total={items.length}
                  disabled={disabled}
                  onMoveUp={() => onMoveUp(item.question_id)}
                  onMoveDown={() => onMoveDown(item.question_id)}
                  onRemove={() => onRemove(item.question_id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
