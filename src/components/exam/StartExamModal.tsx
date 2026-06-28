"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ApiError, toUserFriendlyError } from "@/lib/api";
import { startAttempt } from "@/lib/api/endpoints";
import {
  ACCESS_LABELS,
  formatExamPrice,
  MODE_LABELS,
  type ExamSet,
} from "@/lib/exam/format";

const INSTRUCTIONS = [
  "เมื่อเริ่มสอบ ระบบจะเริ่มจับเวลาทันที",
  "ให้กดค้างที่วงกลมคำตอบเพื่อฝนคำตอบ",
  "ระบบจะบันทึกคำตอบอัตโนมัติระหว่างทำข้อสอบ",
  "สามารถเปลี่ยนคำตอบได้ก่อนส่งคำตอบ",
  "เมื่อส่งคำตอบแล้วจะไม่สามารถกลับมาแก้ไขได้",
  "หากเวลาหมด ระบบจะถือว่าส่งคำตอบโดยอัตโนมัติ",
  "หลังส่งคำตอบ คุณจะเห็นคะแนน ผลสอบ และเฉลย",
];

type StartExamModalProps = {
  examSet: ExamSet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StartExamModal({ examSet, open, onOpenChange }: StartExamModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setConfirmed(false);
      setError(null);
    }
    onOpenChange(next);
  };

  const handleStart = async () => {
    if (!examSet) return;

    if (!isAuthenticated) {
      showToast("กรุณาเข้าสู่ระบบก่อนเริ่มทำข้อสอบ", "error");
      router.push(`/login?redirect=${encodeURIComponent(`/exams/${examSet.code}`)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await startAttempt(examSet.code);
      onOpenChange(false);
      setConfirmed(false);
      router.push(`/exams/${examSet.code}/take?attempt_id=${data.attempt_id}`);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 401 || e.code === "LOGIN_REQUIRED") {
          showToast("กรุณาเข้าสู่ระบบก่อนเริ่มทำข้อสอบ", "error");
          onOpenChange(false);
          router.push(`/login?redirect=${encodeURIComponent(`/exams/${examSet.code}`)}`);
        } else if (e.code === "ACCESS_REQUIRED_OR_PREMIUM") {
          showToast(
            "ชุดข้อสอบนี้สามารถปลดล็อกเฉพาะชุด หรือใช้งานผ่าน Premium ได้",
            "error"
          );
          onOpenChange(false);
          const unlockUrl =
            (e.details?.unlock_url as string) ?? `/exams/${examSet.code}/unlock`;
          router.push(unlockUrl);
        } else if (e.code === "PREMIUM_REQUIRED") {
          showToast("ชุดข้อสอบนี้สำหรับสมาชิก Premium เท่านั้น", "error");
          onOpenChange(false);
          router.push("/pricing");
        } else if (e.code === "ACCESS_REQUIRED") {
          showToast("ชุดข้อสอบนี้ต้องปลดล็อกก่อนเริ่มทำข้อสอบ", "error");
          onOpenChange(false);
          const unlockUrl = (e.details?.unlock_url as string) ?? `/exams/${examSet.code}/unlock`;
          router.push(unlockUrl);
        } else if (e.code === "PRIVATE_EXAM_ACCESS_REQUIRED") {
          showToast("ชุดข้อสอบนี้เปิดให้เฉพาะผู้ได้รับสิทธิ์เท่านั้น", "error");
          onOpenChange(false);
          router.push("/exams");
        } else if (e.code === "EXAM_NOT_AVAILABLE") {
          showToast("ชุดข้อสอบนี้ยังไม่พร้อมให้ใช้งาน", "error");
          onOpenChange(false);
        } else {
          setError(toUserFriendlyError(e));
        }
      } else {
        setError(toUserFriendlyError(e));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!examSet) return null;

  const price = formatExamPrice(examSet);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ก่อนเริ่มทำข้อสอบ</DialogTitle>
          <p className="text-sm text-muted">
            โปรดอ่านคำแนะนำเพื่อให้การสอบเสมือนจริงใกล้เคียงสนามจริงที่สุด
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-4 text-sm">
            <dl className="space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">ชุดข้อสอบ</dt>
                <dd className="text-right font-medium text-foreground">{examSet.title}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">จำนวนข้อ</dt>
                <dd className="font-medium">{examSet.total_questions} ข้อ</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">เวลา</dt>
                <dd className="font-medium">{examSet.duration_minutes} นาที</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">คะแนนผ่าน</dt>
                <dd className="font-medium">{examSet.passing_score}%</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">รูปแบบ</dt>
                <dd className="font-medium">{MODE_LABELS[examSet.mode]}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">ราคา</dt>
                <dd className="font-medium">
                  {examSet.access_type === "free" ? ACCESS_LABELS.free : price.primary}
                </dd>
              </div>
            </dl>
          </div>

          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
            {INSTRUCTIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground">ฉันอ่านและเข้าใจคำแนะนำแล้ว</span>
          </label>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            ยกเลิก
          </Button>
          <Button onClick={handleStart} disabled={!confirmed || loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังสร้างการสอบ…
              </>
            ) : (
              "เริ่มสอบ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
