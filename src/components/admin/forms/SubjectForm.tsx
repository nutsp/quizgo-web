"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SubjectInput } from "@/lib/api/admin/endpoints";

const schema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  code: z.string().min(2, "รหัสต้องมีอย่างน้อย 2 ตัวอักษร"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type SubjectFormProps = {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: SubjectInput) => Promise<void>;
  submitLabel?: string;
};

export function SubjectForm({ defaultValues, onSubmit, submitLabel = "บันทึก" }: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "", description: "", ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          name: values.name,
          code: values.code,
          description: values.description ?? "",
        });
      })}
      className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-surface p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">ชื่อหมวดวิชา *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">รหัส *</Label>
        <Input id="code" {...register("code")} placeholder="law" />
        {errors.code && <p className="text-sm text-danger">{errors.code.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">คำอธิบาย</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังบันทึก..." : submitLabel}
      </Button>
    </form>
  );
}
