"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminExamSetQuestion } from "@/lib/api/admin/endpoints";

type AssignedQuestionsPanelProps = {
  items: AdminExamSetQuestion[];
  onRemove: (questionId: string) => void;
  onMoveUp: (questionId: string) => void;
  onMoveDown: (questionId: string) => void;
};

export function AssignedQuestionsPanel({
  items,
  onRemove,
  onMoveUp,
  onMoveDown,
}: AssignedQuestionsPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-4 font-semibold">คำถามในชุดนี้ ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted">ยังไม่มีคำถามในชุดนี้</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="p-2">ข้อ</th>
                <th className="p-2">คำถาม</th>
                <th className="p-2">หมวด</th>
                <th className="p-2">คะแนน</th>
                <th className="p-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.question_id} className="border-b border-border last:border-0">
                  <td className="p-2 font-medium">{item.question_no}</td>
                  <td className="max-w-xs p-2">{item.question_preview}</td>
                  <td className="p-2 text-muted">{item.subject_name}</td>
                  <td className="p-2">{item.score}</td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => onMoveUp(item.question_id)}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled={index === items.length - 1} onClick={() => onMoveDown(item.question_id)}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onRemove(item.question_id)}>
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
