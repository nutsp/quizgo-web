"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Crown, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  getExamAccessCardStatus,
  getExamDetailAccessOptions,
  getExamDetailCTA,
  hasSubmittedHistory,
  pastResultHref,
} from "@/lib/exam/access";
import {
  getExamSetPriceFooterDisplay,
  type ExamSet,
} from "@/lib/exam/format";

type ExamAccessCardProps = {
  examSet: ExamSet;
  onStartExam: () => void;
  compact?: boolean;
};

const ACCESS_BENEFITS = [
  "ทำข้อสอบแบบจับเวลา",
  "ใช้กระดาษคำตอบ OMR เสมือนจริง",
  "ดูคะแนนหลังส่งคำตอบ",
  "ดูเฉลยรายข้อ",
  "ดูประวัติผลสอบย้อนหลัง",
];

function StatusIcon({ variant }: { variant: ReturnType<typeof getExamAccessCardStatus>["variant"] }) {
  if (
    variant === "premium_locked" ||
    variant === "premium_active" ||
    variant === "premium_dual" ||
    variant === "premium_unlocked"
  ) {
    return <Crown className="h-5 w-5" />;
  }
  if (variant === "paid_locked") {
    return <Lock className="h-5 w-5" />;
  }
  return <Sparkles className="h-5 w-5" />;
}

export function ExamAccessCard({ examSet, onStartExam, compact = false }: ExamAccessCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const status = getExamAccessCardStatus(examSet);
  const cta = getExamDetailCTA(examSet, isAuthenticated);
  const accessOptions = getExamDetailAccessOptions(examSet);
  const showDualOptions =
    status.variant === "premium_dual" && accessOptions.length > 1;
  const isBlockedState =
    status.variant === "unavailable" || status.variant === "private_denied";
  const priceFooter =
    examSet.access_type === "private" || showDualOptions || isBlockedState
      ? null
      : getExamSetPriceFooterDisplay(examSet);
  const resultHref = pastResultHref(examSet);
  const showPastResultsLink = hasSubmittedHistory(examSet) && !!resultHref;

  const handleCTA = () => {
    if (cta.action === "start_exam") {
      onStartExam();
      return;
    }
    if (cta.action === "login") {
      router.push(`/login?redirect=${encodeURIComponent(`/exams/${examSet.code}`)}`);
      return;
    }
    if (cta.href) {
      router.push(cta.href);
    }
  };

  const handleOption = (option: (typeof accessOptions)[number]) => {
    if (option.type === "start") {
      onStartExam();
      return;
    }
    if (option.href) {
      router.push(option.href);
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-md">
      <CardContent className={compact ? "space-y-4 p-5" : "space-y-5 p-6"}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <StatusIcon variant={status.variant} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900">{status.headline}</p>
            {status.subtext && (
              <p className="mt-1 text-sm text-slate-500">{status.subtext}</p>
            )}
          </div>
        </div>

        {priceFooter && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            {priceFooter.type === "premium_single_discount" ? (
              <>
                <div className="text-lg font-bold text-slate-950">{priceFooter.title}</div>
                <div className="mt-1 text-sm font-medium text-slate-700">
                  ซื้อแยก {priceFooter.priceLineCurrent}{" "}
                  <span className="text-slate-400 line-through">
                    {priceFooter.priceLineOriginal}
                  </span>
                </div>
                {priceFooter.subtitle && (
                  <p className="mt-1 text-sm font-medium text-orange-600">
                    {priceFooter.subtitle}
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-end gap-2">
                  <span
                    className={
                      priceFooter.titleClassName ??
                      (priceFooter.titleLarge
                        ? "text-2xl font-extrabold text-slate-950"
                        : "text-xl font-bold text-slate-950")
                    }
                  >
                    {priceFooter.title}
                  </span>
                  {priceFooter.originalPrice && (
                    <span className="pb-0.5 text-sm text-slate-400 line-through">
                      จาก {priceFooter.originalPrice}
                    </span>
                  )}
                </div>
                {priceFooter.subtitle && (
                  <p
                    className={
                      priceFooter.subtitleEmphasis
                        ? "mt-1 text-sm font-medium text-orange-600"
                        : "mt-1 text-sm text-slate-500"
                    }
                  >
                    {priceFooter.subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {showDualOptions ? (
          <div className="space-y-3">
            {accessOptions.map((option) => (
              <div
                key={option.type}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="font-semibold text-slate-900">
                  {option.type === "unlock" ? "ซื้อเฉพาะชุดนี้" : "สมัคร Premium"}
                </p>
                {option.priceLabel && (
                  <p className="mt-1 text-lg font-bold text-slate-950">{option.priceLabel}</p>
                )}
                {option.description && (
                  <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                )}
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  variant={option.type === "premium" ? "outline" : "default"}
                  onClick={() => handleOption(option)}
                >
                  {option.label}
                </Button>
              </div>
            ))}
          </div>
        ) : isBlockedState ? (
          cta.href ? (
            <Button size="lg" className="w-full" variant="outline" onClick={handleCTA}>
              {cta.label}
            </Button>
          ) : null
        ) : (
          <Button size="lg" className="w-full" onClick={handleCTA}>
            {cta.label}
          </Button>
        )}

        {showPastResultsLink && resultHref && (
          <Button asChild size="sm" variant="ghost" className="h-auto px-0 text-teal-700 hover:bg-transparent">
            <Link href={resultHref}>ดูผลสอบย้อนหลัง</Link>
          </Button>
        )}

        {!compact && (
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-semibold text-slate-900">สิ่งที่คุณจะได้รับ</p>
            <ul className="mt-3 space-y-2">
              {ACCESS_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
