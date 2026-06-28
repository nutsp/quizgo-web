"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PublicDisplayPreview } from "@/components/profile/PublicDisplayPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/lib/api/types";
import { formatThaiDateTime } from "@/lib/format";

const ROLE_LABELS: Record<string, string> = {
  user: "ผู้ใช้งาน",
  admin: "ผู้ดูแลระบบ",
};

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

interface ProfileInfoCardProps {
  profile: UserProfile;
  onSubmit: (displayName: string) => Promise<void>;
  onDisplayNameChange?: (displayName: string) => void;
}

export function ProfileInfoCard({
  profile,
  onSubmit,
  onDisplayNameChange,
}: ProfileInfoCardProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { display_name: profile.display_name ?? "" },
  });

  const currentName = watch("display_name");

  useEffect(() => {
    onDisplayNameChange?.(currentName);
  }, [currentName, onDisplayNameChange]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-950">ข้อมูลโปรไฟล์</h2>
        <p className="text-sm text-slate-500">
          จัดการข้อมูลบัญชีและชื่อที่ใช้แสดงในระบบ
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <h3 className="text-sm font-semibold text-slate-900">ข้อมูลบัญชี</h3>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm text-slate-500">อีเมล</p>
              <p className="mt-1 font-semibold text-slate-950">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">บทบาท</p>
              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {ROLE_LABELS[profile.role] ?? profile.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500">วันที่สมัคร</p>
              <p className="mt-1 font-semibold text-slate-950">
                {formatThaiDateTime(profile.created_at)}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-900">ชื่อที่แสดง</h3>
          <p className="mt-2 text-sm text-slate-500">
            ชื่อนี้จะแสดงบนกระดานอันดับและพื้นที่สาธารณะในระบบ
          </p>

          <form
            className="mt-5"
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
            </div>

            <PublicDisplayPreview displayName={currentName} email={profile.email} />

            <div className="mt-5">
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
            </div>

            <p className="sr-only" aria-live="polite">
              {currentName}
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
