"use client";

import Link from "next/link";
import { ArrowLeft, Crown, Lock } from "lucide-react";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatBaht,
  getDiscountPercent,
  getEffectivePriceAmount,
  type ExamSet,
} from "@/lib/exam/format";

type ExamUnlockContentProps = {
  examSet: ExamSet;
};

export function ExamUnlockContent({ examSet }: ExamUnlockContentProps) {
  const isPremiumSingle =
    examSet.access_type === "premium" && examSet.allow_single_purchase;
  const isPaid = examSet.access_type === "paid";
  const canUnlock = isPaid || isPremiumSingle;
  const price = getEffectivePriceAmount(examSet);
  const discountPercent = getDiscountPercent(
    price,
    examSet.original_price_amount ?? examSet.price_amount
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href={`/exams/${examSet.code}`}>
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้าชุดข้อสอบ
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <div className="relative h-36">
          <ExamCoverImage
            src={examSet.cover_image_url}
            alt={examSet.title}
            className="h-full w-full"
            showOverlay={!!examSet.cover_image_url}
          />
        </div>
        <CardContent className="space-y-6 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {isPremiumSingle ? <Crown className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">
              {isPremiumSingle ? "ปลดล็อกชุดข้อสอบนี้" : examSet.title}
            </h1>
            {!isPremiumSingle && (
              <p className="text-muted">{examSet.title}</p>
            )}
            {canUnlock ? (
              <>
                <p className="text-2xl font-bold text-foreground">
                  {formatBaht(price, examSet.currency)}
                </p>
                {examSet.original_price_amount != null &&
                  examSet.original_price_amount > price && (
                    <>
                      <p className="text-sm text-muted line-through">
                        จาก {formatBaht(examSet.original_price_amount, examSet.currency)}
                      </p>
                      {discountPercent != null && (
                        <p className="text-sm font-medium text-orange-600">
                          ประหยัด {discountPercent}%
                        </p>
                      )}
                    </>
                  )}
              </>
            ) : (
              <p className="text-muted">ชุดข้อสอบนี้สำหรับสมาชิก Premium เท่านั้น</p>
            )}
          </div>

          {isPremiumSingle && (
            <p className="text-sm text-muted">
              หรือสมัคร Premium เพื่อเข้าถึงข้อสอบ Premium ทั้งหมด
            </p>
          )}

          {canUnlock && (
            <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted">
              <p>ระบบชำระเงินออนไลน์จะเปิดให้ใช้งานเร็ว ๆ นี้</p>
              <p className="mt-1">กรุณาติดต่อผู้ดูแลระบบเพื่อปลดล็อกสิทธิ์</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {canUnlock ? (
              <Button size="lg" disabled>
                ปลดล็อกชุดนี้
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/pricing">ดูแพ็กเกจ Premium</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">ดูแพ็กเกจ Premium</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href={`/exams/${examSet.code}`}>กลับไปหน้าชุดข้อสอบ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
