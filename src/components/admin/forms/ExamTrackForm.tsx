"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { ExamTrackInput } from "@/lib/api/admin/endpoints";

const schema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  code: z
    .string()
    .min(2, "รหัสต้องมีอย่างน้อย 2 ตัวอักษร")
    .regex(/^[a-z0-9-]+$/, "รหัสต้องเป็นตัวพิมพ์เล็ก a-z, 0-9 หรือ - เท่านั้น"),
  description: z.string().optional(),
  cover_image_url: z.string().url("URL ไม่ถูกต้อง").optional().or(z.literal("")),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type ExamTrackFormProps = {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: ExamTrackInput) => Promise<void>;
  submitLabel?: string;
};

export function ExamTrackForm({
  defaultValues,
  onSubmit,
  submitLabel = "บันทึก",
}: ExamTrackFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      cover_image_url: "",
      is_active: true,
      ...defaultValues,
    },
  });

  const isActive = watch("is_active");

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          name: values.name,
          code: values.code,
          description: values.description ?? "",
          cover_image_url: values.cover_image_url || null,
          is_active: values.is_active,
        });
      })}
      className="mx-auto max-w-2xl space-y-5 rounded-xl border border-border bg-surface p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">ชื่อสายการสอบ *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">รหัส (URL-safe) *</Label>
        <Input id="code" {...register("code")} placeholder="gpor" />
        {errors.code && <p className="text-sm text-danger">{errors.code.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">คำอธิบาย</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cover_image_url">URL รูปปก</Label>
        <Input id="cover_image_url" {...register("cover_image_url")} placeholder="https://..." />
        {errors.cover_image_url && (
          <p className="text-sm text-danger">{errors.cover_image_url.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={isActive} onCheckedChange={(v) => setValue("is_active", v)} id="is_active" />
        <Label htmlFor="is_active">เปิดใช้งาน</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังบันทึก..." : submitLabel}
      </Button>
    </form>
  );
}
