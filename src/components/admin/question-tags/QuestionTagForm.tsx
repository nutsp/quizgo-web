"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { QuestionTagInput } from "@/lib/api/admin/endpoints";

const schema = z.object({
  name: z.string().min(1, "กรุณาระบุชื่อกลุ่มคำถาม"),
  code: z.string().min(2, "กรุณาระบุรหัสกลุ่มคำถาม"),
  description: z.string().optional(),
  color: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type QuestionTagFormProps = {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: QuestionTagInput) => Promise<void>;
  submitLabel?: string;
};

export function QuestionTagForm({
  defaultValues,
  onSubmit,
  submitLabel = "บันทึก",
}: QuestionTagFormProps) {
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
      color: "",
      is_active: true,
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          name: values.name,
          code: values.code,
          description: values.description ?? "",
          color: values.color ?? "",
          is_active: values.is_active,
        });
      })}
      className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-surface p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">ชื่อกลุ่มคำถาม *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">รหัสกลุ่มคำถาม *</Label>
        <Input id="code" {...register("code")} placeholder="document-regulation" />
        {errors.code && <p className="text-sm text-danger">{errors.code.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">คำอธิบาย</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="color">สี</Label>
        <Input id="color" {...register("color")} placeholder="#0F766E" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={watch("is_active")}
          onCheckedChange={(v) => setValue("is_active", v === true)}
        />
        เปิดใช้งาน
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังบันทึก..." : submitLabel}
      </Button>
    </form>
  );
}
