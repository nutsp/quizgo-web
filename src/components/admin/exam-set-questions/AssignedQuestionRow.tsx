"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import type { AssignedExamQuestion } from "@/lib/api/admin/exam-set-questions";

type AssignedQuestionRowProps = {
  item: AssignedExamQuestion;
  index: number;
  total: number;
  disabled: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

function previewText(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= 100) return trimmed;
  return `${trimmed.slice(0, 100)}...`;
}

export function AssignedQuestionRow({
  item,
  index,
  total,
  disabled,
  onMoveUp,
  onMoveDown,
  onRemove,
}: AssignedQuestionRowProps) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="p-2 font-medium">{item.question_no}</td>
      <td className="max-w-xs p-2">{previewText(item.question_text)}</td>
      <td className="p-2 text-muted">{item.subject?.name ?? "—"}</td>
      <td className="p-2">
        <AdminStatusBadge status={item.difficulty} />
      </td>
      <td className="p-2">{item.score}</td>
      <td className="p-2">
        <div className="flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled || index === 0}
            onClick={onMoveUp}
            title="เลื่อนขึ้น"
          >
            <ArrowUp className="mr-1 h-3 w-3" />
            เลื่อนขึ้น
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled || index === total - 1}
            onClick={onMoveDown}
            title="เลื่อนลง"
          >
            <ArrowDown className="mr-1 h-3 w-3" />
            เลื่อนลง
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={onRemove}
            className="text-danger"
            title="ลบออกจากชุด"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            ลบออกจากชุด
          </Button>
        </div>
      </td>
    </tr>
  );
}
