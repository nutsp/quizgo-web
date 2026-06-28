import Link from "next/link";
import {
  Clock,
  FileQuestion,
  Target,
  TrendingUp,
} from "lucide-react";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { Badge } from "@/components/ui/badge";
import {
  DIFFICULTY_LABELS,
  type ExamSetDifficulty,
} from "@/lib/exam/format";
import type { MyExamItem } from "@/lib/api/types";
import {
  getMyExamFooterActions,
  getMyExamSourceBadge,
} from "@/lib/my-exams/filters";
import { cn } from "@/lib/utils";

type MyExamSetCardProps = {
  item: MyExamItem;
  hasPremium?: boolean;
};

const difficultyColor: Record<string, string> = {
  easy: "text-success",
  medium: "text-accent",
  hard: "text-danger",
};

function formatAttemptStatus(item: MyExamItem): string | null {
  const attempt = item.latest_attempt;
  if (!attempt) return null;
  if (attempt.status === "in_progress") return "กำลังทำอยู่";
  if (attempt.status === "timeout") return "หมดเวลา";
  if (attempt.status === "submitted" && attempt.score_percent != null) {
    return `ครั้งล่าสุด: ${Math.round(attempt.score_percent)}%`;
  }
  return null;
}

export function MyExamSetCard({ item, hasPremium = false }: MyExamSetCardProps) {
  const detailHref = `/exams/${item.code}`;
  const resultHref =
    item.latest_attempt?.attempt_id &&
    (item.latest_attempt.status === "submitted" ||
      item.latest_attempt.status === "timeout")
      ? `/exams/${item.code}/result?attempt_id=${item.latest_attempt.attempt_id}`
      : null;
  const trackName = item.exam_track?.name ?? "ไม่ระบุสายการสอบ";
  const attemptLabel = formatAttemptStatus(item);
  const difficulty = item.difficulty as ExamSetDifficulty | undefined;
  const sourceBadge = getMyExamSourceBadge(item);
  const footerActions = getMyExamFooterActions(item, hasPremium);
  const primaryFooter = footerActions[0] ?? "ดูรายละเอียด";

  return (
    <Link
      href={detailHref}
      aria-label={`ดูรายละเอียดชุดข้อสอบ ${item.title}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-teal-300 group-hover:shadow-xl group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-teal-500">
        <div className="relative h-36 shrink-0 overflow-hidden">
          <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-col gap-1">
            {sourceBadge && (
              <Badge variant="secondary" className="bg-white/95 text-slate-800">
                {sourceBadge}
              </Badge>
            )}
          </div>
          <ExamCoverImage
            src={item.cover_image_url}
            alt={item.title}
            className="h-full w-full"
            imgClassName="transition duration-300 group-hover:scale-105"
            showOverlay={!!item.cover_image_url}
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-950">{item.title}</h3>
          <p className="mt-1 text-sm font-semibold text-teal-700">{trackName}</p>
          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">
            {item.description || "-"}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <FileQuestion className="h-4 w-4 shrink-0 text-slate-400" />
              {item.total_questions} ข้อ
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-slate-400" />
              {item.duration_minutes} นาที
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5",
                difficulty ? (difficultyColor[difficulty] ?? "text-slate-600") : "text-slate-600"
              )}
            >
              <TrendingUp className="h-4 w-4 shrink-0 text-slate-400" />
              {difficulty && DIFFICULTY_LABELS[difficulty]
                ? `ระดับ${DIFFICULTY_LABELS[difficulty]}`
                : "-"}
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="h-4 w-4 shrink-0 text-slate-400" />
              {item.passing_score != null ? `ผ่าน ${item.passing_score}%` : "-"}
            </span>
          </div>

          <div className="mt-auto pt-4">
            {attemptLabel && (
              <p className="mb-1 text-xs text-slate-500">{attemptLabel}</p>
            )}
            <p className="text-sm font-semibold text-teal-700">{primaryFooter}</p>
            {footerActions.length > 1 && (
              <p className="mt-1 text-xs text-slate-500">
                {footerActions.slice(1).join(" · ")}
              </p>
            )}
            {resultHref && footerActions.includes("ดูผลสอบ") && (
              <p
                className="mt-1 text-xs text-teal-600"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={resultHref}>เปิดผลสอบล่าสุด</Link>
              </p>
            )}
            <p className="mt-1 text-xs text-slate-400 transition-colors group-hover:text-teal-600">
              คลิกเพื่อดูรายละเอียด
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
