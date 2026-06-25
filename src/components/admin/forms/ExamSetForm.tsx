"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminExamTrack, ExamSetInput } from "@/lib/api/admin/endpoints";

const schema = z
  .object({
    exam_track_id: z.string().min(1, "กรุณาเลือกสายการสอบ"),
    title: z.string().min(1, "กรุณากรอกชื่อชุดข้อสอบ"),
    code: z.string().min(2, "รหัสต้องมีอย่างน้อย 2 ตัวอักษร"),
    description: z.string().optional(),
    cover_image_url: z.string().optional(),
    duration_minutes: z.number().min(1, "ต้องมากกว่า 0"),
    total_questions: z.number().min(1, "ต้องมากกว่า 0"),
    passing_score: z.number().min(0).max(100),
    difficulty: z.enum(["easy", "medium", "hard"]),
    access_type: z.enum(["free", "premium"]),
    price_amount: z.number().min(0),
    sale_price_amount: z.number().optional(),
    currency: z.string().optional(),
    mode: z.enum(["practice", "mock_exam"]),
    is_official: z.boolean(),
    is_featured: z.boolean(),
    is_active: z.boolean(),
  })
  .refine(
    (d) => d.access_type !== "free" || d.price_amount === 0,
    { message: "ชุดฟรีต้องมีราคา 0", path: ["price_amount"] }
  );

type FormValues = z.infer<typeof schema>;

type ExamSetFormProps = {
  tracks: AdminExamTrack[];
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: ExamSetInput) => Promise<void>;
  submitLabel?: string;
};

export function ExamSetForm({
  tracks,
  defaultValues,
  onSubmit,
  submitLabel = "บันทึก",
}: ExamSetFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      exam_track_id: "",
      title: "",
      code: "",
      description: "",
      cover_image_url: "",
      duration_minutes: 60,
      total_questions: 20,
      passing_score: 60,
      difficulty: "medium",
      access_type: "free",
      price_amount: 0,
      currency: "THB",
      mode: "mock_exam",
      is_official: false,
      is_featured: false,
      is_active: true,
      ...defaultValues,
    },
  });

  const accessType = watch("access_type");

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          exam_track_id: values.exam_track_id,
          title: values.title,
          code: values.code,
          description: values.description ?? "",
          cover_image_url: values.cover_image_url || null,
          duration_minutes: values.duration_minutes,
          total_questions: values.total_questions,
          passing_score: values.passing_score,
          difficulty: values.difficulty,
          access_type: values.access_type,
          price_amount: values.price_amount,
          sale_price_amount: values.sale_price_amount || null,
          currency: values.currency || "THB",
          mode: values.mode,
          is_official: values.is_official,
          is_featured: values.is_featured,
          is_active: values.is_active,
        });
      })}
      className="mx-auto max-w-3xl space-y-5 rounded-xl border border-border bg-surface p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>สายการสอบ *</Label>
          <Select
            value={watch("exam_track_id")}
            onValueChange={(v) => setValue("exam_track_id", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกสายการสอบ" />
            </SelectTrigger>
            <SelectContent>
              {tracks.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.exam_track_id && (
            <p className="text-sm text-danger">{errors.exam_track_id.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">ชื่อชุดข้อสอบ *</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-sm text-danger">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">รหัส *</Label>
          <Input id="code" {...register("code")} />
          {errors.code && <p className="text-sm text-danger">{errors.code.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">คำอธิบาย</Label>
          <Textarea id="description" rows={2} {...register("description")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cover_image_url">URL รูปปก</Label>
          <Input id="cover_image_url" {...register("cover_image_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration_minutes">เวลา (นาที) *</Label>
          <Input id="duration_minutes" type="number" {...register("duration_minutes", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_questions">จำนวนข้อ *</Label>
          <Input id="total_questions" type="number" {...register("total_questions", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passing_score">คะแนนผ่าน (%) *</Label>
          <Input id="passing_score" type="number" {...register("passing_score", { valueAsNumber: true })} />
        </div>
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
          <Label>ประเภทการเข้าถึง</Label>
          <Select value={accessType} onValueChange={(v) => setValue("access_type", v as FormValues["access_type"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="free">ฟรี</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_amount">ราคา (บาท)</Label>
          <Input id="price_amount" type="number" {...register("price_amount", { valueAsNumber: true })} />
          {errors.price_amount && <p className="text-sm text-danger">{errors.price_amount.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sale_price_amount">ราคาลด (บาท)</Label>
          <Input id="sale_price_amount" type="number" {...register("sale_price_amount", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>โหมด</Label>
          <Select value={watch("mode")} onValueChange={(v) => setValue("mode", v as FormValues["mode"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="practice">ฝึกหัด</SelectItem>
              <SelectItem value="mock_exam">จำลองสอบ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        {(["is_official", "is_featured", "is_active"] as const).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <Switch checked={watch(key)} onCheckedChange={(v) => setValue(key, v)} />
            <Label>
              {key === "is_official" ? "เป็นชุดทางการ" : key === "is_featured" ? "แนะนำ" : "เปิดใช้งาน"}
            </Label>
          </div>
        ))}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังบันทึก..." : submitLabel}
      </Button>
    </form>
  );
}
