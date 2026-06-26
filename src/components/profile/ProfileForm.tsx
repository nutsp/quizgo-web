"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, "กรุณาระบุชื่อที่ต้องการแสดง")
    .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร")
    .refine((value) => !/[<>"'&/\\]/.test(value), {
      message: "ชื่อมีอักขระที่ไม่รองรับ",
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultDisplayName: string;
  onSubmit: (displayName: string) => Promise<void>;
  onDisplayNameChange?: (displayName: string) => void;
}

export function ProfileForm({
  defaultDisplayName,
  onSubmit,
  onDisplayNameChange,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { display_name: defaultDisplayName },
  });

  const currentName = watch("display_name");

  useEffect(() => {
    onDisplayNameChange?.(currentName);
  }, [currentName, onDisplayNameChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">แก้ไขชื่อที่แสดง</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values.display_name.trim());
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="display_name">ชื่อที่แสดง</Label>
            <Input
              id="display_name"
              placeholder="เช่น สมชาย ใจดี"
              {...register("display_name")}
              aria-invalid={Boolean(errors.display_name)}
            />
            {errors.display_name && (
              <p className="text-sm text-danger">{errors.display_name.message}</p>
            )}
            <p className="text-xs text-muted">
              ชื่อนี้จะแสดงบนกระดานอันดับ แทนอีเมลของคุณ
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกโปรไฟล์"
            )}
          </Button>

          <p className="sr-only" aria-live="polite">
            {currentName}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
