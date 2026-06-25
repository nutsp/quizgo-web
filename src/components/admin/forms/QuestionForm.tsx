"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminSubject, QuestionInput } from "@/lib/api/admin/endpoints";

const choiceSchema = z.object({
  choice_key: z.string(),
  choice_label: z.string(),
  choice_text: z.string().min(1, "กรุณากรอกตัวเลือก"),
  is_correct: z.boolean(),
});

const schema = z
  .object({
    subject_id: z.string().min(1, "กรุณาเลือกหมวดวิชา"),
    question_text: z.string().min(1, "กรุณากรอกคำถาม"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    explanation: z.string().optional(),
    status: z.enum(["draft", "published", "archived"]),
    choices: z.array(choiceSchema).length(4),
  })
  .refine((d) => d.choices.filter((c) => c.is_correct).length === 1, {
    message: "ต้องมีคำตอบที่ถูกต้องเพียง 1 ตัวเลือก",
    path: ["choices"],
  });

type FormValues = z.infer<typeof schema>;

const DEFAULT_CHOICES = [
  { choice_key: "A", choice_label: "ก", choice_text: "", is_correct: false },
  { choice_key: "B", choice_label: "ข", choice_text: "", is_correct: false },
  { choice_key: "C", choice_label: "ค", choice_text: "", is_correct: false },
  { choice_key: "D", choice_label: "ง", choice_text: "", is_correct: false },
];

type QuestionFormProps = {
  subjects: AdminSubject[];
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: QuestionInput) => Promise<void>;
  submitLabel?: string;
};

export function QuestionForm({
  subjects,
  defaultValues,
  onSubmit,
  submitLabel = "บันทึก",
}: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject_id: "",
      question_text: "",
      difficulty: "medium",
      explanation: "",
      status: "draft",
      choices: DEFAULT_CHOICES,
      ...defaultValues,
    },
  });

  const choices = watch("choices");

  const setCorrect = (index: number) => {
    const next = choices.map((c, i) => ({ ...c, is_correct: i === index }));
    setValue("choices", next);
  };

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="mx-auto max-w-3xl space-y-5 rounded-xl border border-border bg-surface p-6"
    >
      <div className="space-y-2">
        <Label>หมวดวิชา *</Label>
        <Select value={watch("subject_id")} onValueChange={(v) => setValue("subject_id", v)}>
          <SelectTrigger><SelectValue placeholder="เลือกหมวดวิชา" /></SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subject_id && <p className="text-sm text-danger">{errors.subject_id.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="question_text">คำถาม *</Label>
        <Textarea id="question_text" rows={4} {...register("question_text")} />
        {errors.question_text && <p className="text-sm text-danger">{errors.question_text.message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>ระดับความยาก</Label>
          <Select value={watch("difficulty")} onValueChange={(v) => setValue("difficulty", v as FormValues["difficulty"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">ง่าย</SelectItem>
              <SelectItem value="medium">ปานกลาง</SelectItem>
              <SelectItem value="hard">ยาก</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>สถานะ</Label>
          <Select value={watch("status")} onValueChange={(v) => setValue("status", v as FormValues["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">ฉบับร่าง</SelectItem>
              <SelectItem value="published">เผยแพร่</SelectItem>
              <SelectItem value="archived">เก็บถาวร</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-3">
        <Label>ตัวเลือก (4 ข้อ) *</Label>
        {choices.map((choice, index) => (
          <div key={choice.choice_key} className="flex items-start gap-3 rounded-lg border border-border p-3">
            <span className="mt-2 text-sm font-semibold text-primary">
              {choice.choice_key}/{choice.choice_label}
            </span>
            <Input {...register(`choices.${index}.choice_text`)} placeholder="ข้อความตัวเลือก" className="flex-1" />
            <label className="flex shrink-0 items-center gap-2 text-sm">
              <Checkbox checked={choice.is_correct} onCheckedChange={() => setCorrect(index)} />
              ถูก
            </label>
          </div>
        ))}
        {errors.choices && <p className="text-sm text-danger">{errors.choices.message ?? "ตรวจสอบตัวเลือก"}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="explanation">คำอธิบายเฉลย</Label>
        <Textarea id="explanation" rows={3} {...register("explanation")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังบันทึก..." : submitLabel}
      </Button>
    </form>
  );
}
