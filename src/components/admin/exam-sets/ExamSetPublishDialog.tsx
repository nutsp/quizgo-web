"use client";

import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { ACCESS_LABELS } from "@/lib/exam/format";
import type { AdminExamSet } from "@/lib/api/admin/endpoints";

type ExamSetPublishDialogProps = {
  examSet: AdminExamSet | null;
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExamSetPublishDialog({
  examSet,
  open,
  loading,
  onConfirm,
  onCancel,
}: ExamSetPublishDialogProps) {
  if (!examSet) return null;

  return (
    <AdminConfirmDialog
      open={open}
      title="ยืนยันการเผยแพร่ชุดข้อสอบ?"
      description={
        <div className="space-y-3 text-left text-sm text-slate-600">
          <p>เมื่อเผยแพร่แล้ว ผู้ใช้งานจะสามารถเห็นและเริ่มทำข้อสอบชุดนี้ได้</p>
          <dl className="space-y-1.5 rounded-lg bg-slate-50 p-3">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">ชุดข้อสอบ</dt>
              <dd className="font-medium text-slate-900">{examSet.title}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">จำนวนคำถาม</dt>
              <dd className="font-medium">{examSet.total_questions} ข้อ</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">เวลา</dt>
              <dd className="font-medium">{examSet.duration_minutes} นาที</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">คะแนนผ่าน</dt>
              <dd className="font-medium">{examSet.passing_score}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">ประเภท</dt>
              <dd className="font-medium">{ACCESS_LABELS[examSet.access_type as "free" | "premium"]}</dd>
            </div>
          </dl>
        </div>
      }
      confirmLabel={loading ? undefined : "เผยแพร่"}
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
