import { Clock, FileQuestion, Target, TrendingUp } from "lucide-react";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { Badge } from "@/components/ui/badge";
import {
  COMMERCE_MAIN_BADGE_CLASS,
  COMMERCE_SECONDARY_BADGE_CLASS,
  COMMERCE_BADGE_BASE_CLASS,
  DIFFICULTY_LABELS,
  getExamSetCommerceDisplay,
  type ExamSet,
} from "@/lib/exam/format";
import { cn } from "@/lib/utils";

type ExamDetailHeroProps = {
  examSet: ExamSet;
};

function formatDifficultyLabel(difficulty: ExamSet["difficulty"]): string {
  return `ระดับ${DIFFICULTY_LABELS[difficulty]}`;
}

export function ExamDetailHero({ examSet }: ExamDetailHeroProps) {
  const trackName = examSet.exam_track?.name ?? "ไม่ระบุสายการสอบ";
  const { mainBadge, secondaryBadge } = getExamSetCommerceDisplay(examSet);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-48 sm:h-64">
        {mainBadge && (
          <div className="absolute left-4 top-4 z-10">
            <span
              className={cn(
                COMMERCE_BADGE_BASE_CLASS,
                COMMERCE_MAIN_BADGE_CLASS[mainBadge.variant]
              )}
            >
              {mainBadge.label}
            </span>
          </div>
        )}

        {secondaryBadge && (
          <div className="absolute right-4 top-4 z-10">
            <span
              className={cn(
                COMMERCE_BADGE_BASE_CLASS,
                COMMERCE_SECONDARY_BADGE_CLASS[secondaryBadge.variant]
              )}
            >
              {secondaryBadge.label}
            </span>
          </div>
        )}

        <ExamCoverImage
          src={examSet.cover_image_url}
          alt={examSet.title}
          className="h-full w-full"
          showOverlay={!!examSet.cover_image_url}
          priority
          iconClassName="h-16 w-16"
        />
      </div>

      <div className="space-y-4 p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {examSet.is_official && <Badge variant="secondary">Official</Badge>}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {examSet.title}
          </h1>
          <p className="mt-1 text-sm font-semibold text-teal-700">{trackName}</p>
        </div>

        {examSet.description && (
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            {examSet.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <FileQuestion className="h-4 w-4 text-slate-400" />
            {examSet.total_questions} ข้อ
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            {examSet.duration_minutes} นาที
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            {formatDifficultyLabel(examSet.difficulty)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Target className="h-4 w-4 text-slate-400" />
            ผ่าน {examSet.passing_score}%
          </span>
        </div>
      </div>
    </div>
  );
}
