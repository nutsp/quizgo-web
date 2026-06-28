"use client";

import { useEffect } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
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
import { AnswerSheetLayoutSection } from "@/components/admin/forms/AnswerSheetLayoutSection";
import { ExamSetCoverImageField } from "@/components/admin/forms/ExamSetCoverImageField";
import { useToast } from "@/hooks/useToast";
import type { AdminExamTrack, ExamSetInput } from "@/lib/api/admin/endpoints";
import { coverImageUrlSchema } from "@/lib/exam/coverImageUrl";
import {
  answerSheetLayoutFormSchema,
  defaultLayoutConfig,
  normalizeLayoutConfig,
  resolveOMRLayout,
  type AnswerSheetLayoutConfig,
} from "@/lib/exam/answerSheetLayout";

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number" && Number.isNaN(value)) return undefined;
  return value;
}, z.number().optional());

const requiredNumber = z.preprocess(
  (value) => Number(value),
  z.number()
);

const schema = z
  .object({
    exam_track_id: z.string().min(1, "กรุณาเลือกสายการสอบ"),
    title: z.string().min(1, "กรุณากรอกชื่อชุดข้อสอบ"),
    code: z.string().min(2, "รหัสต้องมีอย่างน้อย 2 ตัวอักษร"),
    description: z.string().optional(),
    cover_image_url: coverImageUrlSchema,
    duration_minutes: requiredNumber.pipe(z.number().min(1, "ต้องมากกว่า 0")),
    total_questions: requiredNumber.pipe(z.number().min(1, "ต้องมากกว่า 0")),
    passing_score: requiredNumber.pipe(z.number().min(0).max(100)),
    difficulty: z.enum(["easy", "medium", "hard"]),
    access_type: z.enum(["free", "paid", "premium", "private"]),
    allow_single_purchase: z.preprocess(
      (value) => (value === undefined || value === null ? false : value),
      z.boolean()
    ),
    price_amount: requiredNumber.pipe(z.number().min(0)),
    original_price_amount: optionalNumber,
    sale_price_amount: optionalNumber,
    currency: z.string().optional(),
    mode: z.enum(["practice", "mock_exam"]),
    is_official: z.boolean(),
    is_featured: z.boolean(),
    is_active: z.boolean(),
    answer_sheet_layout: answerSheetLayoutFormSchema,
  })
  .refine(
    (d) => d.access_type !== "free" || d.price_amount === 0,
    { message: "ชุดฟรีต้องมีราคา 0", path: ["price_amount"] }
  )
  .refine(
    (d) => d.access_type !== "paid" || d.price_amount > 0,
    { message: "ชุดซื้อรายชุดต้องมีราคามากกว่า 0", path: ["price_amount"] }
  )
  .refine(
    (d) => d.access_type !== "private" || d.price_amount === 0,
    { message: "ชุดเฉพาะผู้ได้รับสิทธิ์ต้องมีราคา 0", path: ["price_amount"] }
  )
  .refine(
    (d) =>
      d.access_type !== "premium" ||
      !d.allow_single_purchase ||
      d.price_amount > 0,
    { message: "ชุด Premium ที่เปิดซื้อแยกต้องมีราคามากกว่า 0", path: ["price_amount"] }
  );

type FormValues = z.infer<typeof schema>;

function getFirstFormErrorMessage(errors: FieldErrors<FormValues>): string | null {
  for (const err of Object.values(errors)) {
    if (!err || typeof err !== "object") continue;
    if ("message" in err && err.message) {
      return String(err.message);
    }
    const nested = getFirstFormErrorMessage(err as FieldErrors<FormValues>);
    if (nested) return nested;
  }
  return null;
}

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
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    shouldUnregister: false,
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
      allow_single_purchase: false,
      price_amount: 0,
      currency: "THB",
      mode: "mock_exam",
      is_official: false,
      is_featured: false,
      is_active: true,
      answer_sheet_layout: { ...defaultLayoutConfig },
      ...defaultValues,
    },
  });

  const layoutValue = normalizeLayoutConfig(
    watch("answer_sheet_layout") as Partial<AnswerSheetLayoutConfig> | undefined
  );

  const accessType = watch("access_type");
  const allowSinglePurchase = watch("allow_single_purchase");
  const showSinglePurchasePrice =
    accessType === "paid" || (accessType === "premium" && allowSinglePurchase);

  const handleInvalid = (fieldErrors: FieldErrors<FormValues>) => {
    const message = getFirstFormErrorMessage(fieldErrors);
    showToast(message ?? "กรุณาตรวจสอบข้อมูลในฟอร์ม", "error");
  };

  useEffect(() => {
    if (accessType === "paid") {
      setValue("allow_single_purchase", true, { shouldValidate: false });
    } else if (accessType === "free" || accessType === "private") {
      setValue("allow_single_purchase", false, { shouldValidate: false });
    }
  }, [accessType, setValue]);

  const totalQuestions = watch("total_questions") || 20;

  return (
    <form
      onSubmit={handleSubmit(
        async (values) => {
          await onSubmit({
            exam_track_id: values.exam_track_id,
            title: values.title,
            code: values.code,
            description: values.description ?? "",
            cover_image_url: values.cover_image_url?.trim() || null,
            duration_minutes: values.duration_minutes,
            total_questions: values.total_questions,
            passing_score: values.passing_score,
            difficulty: values.difficulty,
            access_type: values.access_type,
            allow_single_purchase:
              values.access_type === "paid" ? true : values.allow_single_purchase,
            price_amount: values.price_amount,
            original_price_amount: showSinglePurchasePrice
              ? values.original_price_amount ?? null
              : null,
            sale_price_amount: values.sale_price_amount ?? null,
            currency: values.currency || "THB",
            mode: values.mode,
            is_official: values.is_official,
            is_featured: values.is_featured,
            is_active: values.is_active,
            answer_sheet_layout: resolveOMRLayout(
              values.total_questions,
              values.answer_sheet_layout
            ),
          });
        },
        handleInvalid
      )}
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
        <ExamSetCoverImageField
          value={watch("cover_image_url") ?? ""}
          error={errors.cover_image_url?.message}
          previewTitle={watch("title") || "ตัวอย่างรูปภาพปก"}
          onChange={(value) =>
            setValue("cover_image_url", value, { shouldValidate: true })
          }
          onBlur={() => void trigger("cover_image_url")}
        />
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
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">การเข้าถึงและราคา</h3>
        </div>
        <div className="space-y-2">
          <Label>ระดับการเข้าถึง</Label>
          <Select value={accessType} onValueChange={(v) => {
            setValue("access_type", v as FormValues["access_type"]);
            if (v === "free" || v === "private") {
              setValue("price_amount", 0);
              setValue("sale_price_amount", undefined);
              setValue("original_price_amount", undefined);
              setValue("allow_single_purchase", false);
            }
            if (v === "paid") {
              setValue("allow_single_purchase", true);
            }
            if (v === "premium") {
              setValue("allow_single_purchase", false);
            }
          }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="free">ฟรี</SelectItem>
              <SelectItem value="paid">ซื้อรายชุด</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="private">เฉพาะผู้ได้รับสิทธิ์</SelectItem>
            </SelectContent>
          </Select>
          {accessType === "private" && (
            <p className="text-xs text-muted">
              ชุดข้อสอบนี้จะไม่แสดงในคลังข้อสอบ และเข้าได้เฉพาะผู้ใช้งานที่ได้รับสิทธิ์จากผู้ดูแลระบบเท่านั้น
            </p>
          )}
        </div>
        {accessType === "premium" && (
          <div className="flex items-center gap-2 md:col-span-2">
            <Controller
              name="allow_single_purchase"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={(v) => {
                    field.onChange(v);
                    if (!v) {
                      setValue("original_price_amount", undefined, { shouldValidate: true });
                    }
                  }}
                />
              )}
            />
            <div>
              <Label>เปิดให้ซื้อเฉพาะชุดนี้</Label>
              <p className="text-xs text-muted">
                เปิดตัวเลือกนี้เมื่อชุด Premium สามารถซื้อแยกได้โดยไม่ต้องสมัคร Premium
              </p>
            </div>
          </div>
        )}
        {showSinglePurchasePrice && (
          <div className="space-y-2">
            <Label htmlFor="price_amount">ราคาขายรายชุด</Label>
            <Input
              id="price_amount"
              type="number"
              min={1}
              {...register("price_amount", { valueAsNumber: true })}
            />
            {errors.price_amount && <p className="text-sm text-danger">{errors.price_amount.message}</p>}
          </div>
        )}
        {showSinglePurchasePrice && (
          <div className="space-y-2">
            <Label htmlFor="original_price_amount">ราคาปกติ</Label>
            <Input
              id="original_price_amount"
              type="number"
              min={0}
              {...register("original_price_amount", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted">ไม่บังคับ — ใช้แสดงส่วนลดเมื่อมากกว่าราคาขาย</p>
          </div>
        )}
        {accessType === "paid" && (
          <div className="space-y-2">
            <Label htmlFor="sale_price_amount">ราคาลด (บาท)</Label>
            <Input id="sale_price_amount" type="number" {...register("sale_price_amount", { valueAsNumber: true })} />
          </div>
        )}
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
      <AnswerSheetLayoutSection
        value={layoutValue}
        totalQuestions={totalQuestions}
        onChange={(layout) => setValue("answer_sheet_layout", layout, { shouldValidate: true })}
        errors={{
          block_columns: errors.answer_sheet_layout?.block_columns?.message,
        }}
      />
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
