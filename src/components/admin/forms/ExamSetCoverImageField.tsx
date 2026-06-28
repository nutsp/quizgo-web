"use client";

import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidCoverImageUrl } from "@/lib/exam/coverImageUrl";

type ExamSetCoverImageFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  previewTitle?: string;
};

export function ExamSetCoverImageField({
  value,
  error,
  onChange,
  onBlur,
  previewTitle = "ตัวอย่างรูปภาพปก",
}: ExamSetCoverImageFieldProps) {
  const trimmed = value.trim();
  const previewSrc = isValidCoverImageUrl(trimmed) ? trimmed : null;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4 md:col-span-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">รูปภาพปกชุดข้อสอบ</h3>
        <p className="mt-1 text-xs text-muted">
          ใช้สำหรับแสดงรูปภาพบนการ์ดชุดข้อสอบและหน้ารายละเอียด หากไม่ระบุ ระบบจะแสดงพื้นหลังเริ่มต้น
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image_url">URL รูปภาพปก</Label>
        <Input
          id="cover_image_url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="https://example.com/exam-cover.jpg"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted">ตัวอย่างการแสดงผล</p>
        <div className="overflow-hidden rounded-2xl border border-border">
          <ExamCoverImage
            src={previewSrc}
            alt={previewTitle}
            className="h-40"
            showOverlay
            iconClassName="h-10 w-10"
          />
        </div>
      </div>
    </div>
  );
}
