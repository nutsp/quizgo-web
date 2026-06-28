"use client";

import { useMemo } from "react";
import { RealisticOMRAnswerSheet } from "@/components/exam/omr/RealisticOMRAnswerSheet";
import type { OMRAnswer } from "@/components/exam/omr/types";
import {
  computeQuestionsPerBlock,
  normalizeLayoutConfig,
  resolveOMRLayout,
  type AnswerSheetLayoutConfig,
} from "@/lib/exam/answerSheetLayout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AnswerSheetLayoutSectionProps = {
  value: AnswerSheetLayoutConfig;
  onChange: (value: AnswerSheetLayoutConfig) => void;
  totalQuestions?: number;
  errors?: Partial<Record<keyof AnswerSheetLayoutConfig, string>>;
};

function AnswerSheetLayoutPreview({
  layout,
  totalQuestions,
}: {
  layout: AnswerSheetLayoutConfig;
  totalQuestions: number;
}) {
  const resolved = resolveOMRLayout(totalQuestions, layout);
  const sampleTotal = totalQuestions;

  const answers: OMRAnswer[] = useMemo(() => {
    return Array.from({ length: sampleTotal }, (_, i) => {
      const questionNo = i + 1;
      let selected: OMRAnswer["selected_choice_key"] = null;
      if (questionNo === 3) selected = "ค";
      if (questionNo === 7) selected = "ก";
      return {
        question_no: questionNo,
        selected_choice_key: selected,
        marked: questionNo === 5,
      };
    });
  }, [sampleTotal]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-sm font-semibold text-slate-900">ตัวอย่างกระดาษคำตอบ</p>
      <div className="pointer-events-none max-h-[420px] overflow-y-auto">
        <RealisticOMRAnswerSheet
          variant="preview"
          readonly
          examTitle="ตัวอย่างชุดข้อสอบ"
          examSetCode="A"
          candidateName="ผู้สอบตัวอย่าง"
          totalQuestions={sampleTotal}
          currentQuestionNo={3}
          answers={answers}
          layoutConfig={layout}
          onSelectQuestion={() => {}}
          className="max-h-none shadow-none"
        />
      </div>
      <p className="mt-2 text-[10px] text-slate-500">
        {sampleTotal} ข้อ · แถวละ {resolved.block_columns} ช่อง (สูงสุด 4) · ช่องละ{" "}
        {resolved.questions_per_block} ข้อ (คำนวณอัตโนมัติ)
      </p>
    </div>
  );
}

export function AnswerSheetLayoutSection({
  value,
  onChange,
  totalQuestions = 20,
  errors,
}: AnswerSheetLayoutSectionProps) {
  const layout = normalizeLayoutConfig(value);
  const resolved = resolveOMRLayout(totalQuestions, layout);
  const autoQuestionsPerBlock = computeQuestionsPerBlock(
    totalQuestions,
    layout.block_columns
  );

  const patch = (partial: Partial<AnswerSheetLayoutConfig>) => {
    onChange({ ...layout, ...partial });
  };

  return (
    <section className="space-y-5 rounded-xl border border-border bg-background/50 p-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">ตั้งค่ากระดาษคำตอบ</h3>
        <p className="mt-1 text-sm text-muted">
          กำหนดรูปแบบการแสดงกระดาษคำตอบ OMR ระหว่างทำข้อสอบ — จำนวนข้อต่อช่องคำนวณจากจำนวนข้อในชุด
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>จำนวนช่องกระดาษคำตอบต่อแถว</Label>
          <Select
            value={String(layout.block_columns)}
            onValueChange={(v) =>
              patch({
                block_columns: Number(v) as AnswerSheetLayoutConfig["block_columns"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ช่อง</SelectItem>
              <SelectItem value="2">2 ช่อง</SelectItem>
              <SelectItem value="3">3 ช่อง</SelectItem>
              <SelectItem value="4">4 ช่อง</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted">
            สูงสุด 4 ช่องต่อแถว — จำนวนข้อต่อช่องจะถูกคำนวณจากจำนวนข้อทั้งหมด ÷ จำนวนช่อง
          </p>
          {errors?.block_columns && (
            <p className="text-sm text-danger">{errors.block_columns}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>จำนวนข้อต่อช่อง (อัตโนมัติ)</Label>
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm">
            <span className="font-semibold tabular-nums text-foreground">
              {autoQuestionsPerBlock}
            </span>
            <span className="text-muted">
              {" "}
              ข้อ/ช่อง จาก {totalQuestions} ข้อ ÷ {layout.block_columns} ช่อง
            </span>
          </div>
          <p className="text-xs text-muted">
            ตัวอย่าง: {totalQuestions} ข้อ · {layout.block_columns} ช่อง → ช่องละ{" "}
            {resolved.questions_per_block} ข้อ
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>รูปแบบตัวเลือก</Label>
          <Select
            value={layout.choice_label_style}
            onValueChange={(v) =>
              patch({ choice_label_style: v as "thai" | "english" })
            }
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thai">ก ข ค ง</SelectItem>
              <SelectItem value="english">A B C D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {(
          [
            ["show_header", "แสดงหัวกระดาษ"],
            ["show_instructions", "แสดงคำชี้แจง"],
            ["show_candidate_info", "แสดงข้อมูลผู้สอบ"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <Switch
              checked={layout[key]}
              onCheckedChange={(checked) => patch({ [key]: checked })}
            />
            <Label>{label}</Label>
          </div>
        ))}
      </div>

      <AnswerSheetLayoutPreview layout={layout} totalQuestions={totalQuestions} />
    </section>
  );
}
