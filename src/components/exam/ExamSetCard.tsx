import Link from "next/link";
import {
  Clock,
  FileQuestion,
  Target,
  TrendingUp,
} from "lucide-react";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import {
  COMMERCE_BADGE_BASE_CLASS,
  COMMERCE_MAIN_BADGE_CLASS,
  COMMERCE_SECONDARY_BADGE_CLASS,
  DIFFICULTY_LABELS,
  getExamSetCommerceDisplay,
  type ExamSet,
  type ExamSetDifficulty,
  type ExamSetPriceFooterDisplay,
} from "@/lib/exam/format";
import { cn } from "@/lib/utils";

export type ExamSetCardProps = {
  examSet: ExamSet;
};

const difficultyColor: Record<string, string> = {
  easy: "text-success",
  medium: "text-accent",
  hard: "text-danger",
};

function CommerceBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span className={cn(COMMERCE_BADGE_BASE_CLASS, className)}>{label}</span>
  );
}

function formatMetadataValue(value: number | undefined, suffix = ""): string {
  if (value == null || Number.isNaN(value)) return "-";
  return `${value}${suffix}`;
}

function formatDifficultyLabel(difficulty?: ExamSetDifficulty): string {
  if (!difficulty || !DIFFICULTY_LABELS[difficulty]) return "-";
  return `ระดับ${DIFFICULTY_LABELS[difficulty]}`;
}

function PriceFooter({ priceFooter }: { priceFooter: ExamSetPriceFooterDisplay }) {
  if (priceFooter.type === "premium_single_discount") {
    return (
      <div className="mt-4 min-h-[72px]">
        <div className="text-lg font-bold text-slate-950">{priceFooter.title}</div>
        <div className="mt-1 text-sm font-medium text-slate-700">
          ซื้อแยก {priceFooter.priceLineCurrent}{" "}
          <span className="text-slate-400 line-through">
            {priceFooter.priceLineOriginal}
          </span>
        </div>
        {priceFooter.subtitle && (
          <p className="mt-1 text-sm text-orange-600">{priceFooter.subtitle}</p>
        )}
      </div>
    );
  }

  if (priceFooter.type === "premium_single" || priceFooter.type === "premium") {
    return (
      <div className="mt-4 min-h-[72px]">
        <div className="text-lg font-bold text-slate-950">{priceFooter.title}</div>
        {priceFooter.subtitle && (
          <p className="mt-1 text-sm text-slate-500">{priceFooter.subtitle}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 min-h-[72px]">
      <div className="flex items-end gap-2">
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
          <span className="pb-1 text-sm text-slate-400 line-through">
            {priceFooter.originalPrice}
          </span>
        )}
      </div>
      {priceFooter.subtitle && (
        <p
          className={cn(
            "mt-1 text-sm font-medium",
            priceFooter.subtitleEmphasis ? "text-orange-600" : "text-slate-500"
          )}
        >
          {priceFooter.subtitle}
        </p>
      )}
    </div>
  );
}

export function ExamSetCard({ examSet }: ExamSetCardProps) {
  const detailHref = `/exams/${examSet.code}`;
  const { mainBadge, secondaryBadge, priceFooter, socialProofLabel } =
    getExamSetCommerceDisplay(examSet);
  const trackName = examSet.exam_track?.name ?? "ไม่ระบุสายการสอบ";

  return (
    <Link
      href={detailHref}
      aria-label={`ดูรายละเอียดชุดข้อสอบ ${examSet.title}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-teal-300 group-hover:shadow-xl group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-teal-500">
        <div className="relative h-36 shrink-0 overflow-hidden">
          {mainBadge && (
            <div className="absolute left-3 top-3 z-10">
              <CommerceBadge
                label={mainBadge.label}
                className={COMMERCE_MAIN_BADGE_CLASS[mainBadge.variant]}
              />
            </div>
          )}

          {secondaryBadge && (
            <div className="absolute right-3 top-3 z-10">
              <CommerceBadge
                label={secondaryBadge.label}
                className={COMMERCE_SECONDARY_BADGE_CLASS[secondaryBadge.variant]}
              />
            </div>
          )}

          <ExamCoverImage
            src={examSet.cover_image_url}
            alt={examSet.title}
            className="h-full w-full"
            imgClassName="transition duration-300 group-hover:scale-105"
            showOverlay={!!examSet.cover_image_url}
          />
        </div>

        <div className="flex flex-col p-4">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-950">
            {examSet.title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-teal-700">{trackName}</p>
          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">
            {examSet.description || "-"}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <FileQuestion className="h-4 w-4 shrink-0 text-slate-400" />
              {formatMetadataValue(examSet.total_questions, " ข้อ")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-slate-400" />
              {formatMetadataValue(examSet.duration_minutes, " นาที")}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5",
                examSet.difficulty
                  ? (difficultyColor[examSet.difficulty] ?? "text-slate-600")
                  : "text-slate-600"
              )}
            >
              <TrendingUp className="h-4 w-4 shrink-0 text-slate-400" />
              {formatDifficultyLabel(examSet.difficulty)}
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="h-4 w-4 shrink-0 text-slate-400" />
              {examSet.passing_score != null && !Number.isNaN(examSet.passing_score)
                ? `ผ่าน ${examSet.passing_score}%`
                : "-"}
            </span>
          </div>

          {socialProofLabel && (
            <p className="mt-1.5 text-xs text-slate-500">{socialProofLabel}</p>
          )}

          {priceFooter && <PriceFooter priceFooter={priceFooter} />}
        </div>
      </article>
    </Link>
  );
}
