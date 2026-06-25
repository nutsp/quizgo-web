import type { ExamSetItem } from "./types";
import type { ExamSet } from "@/lib/exam/format";

export function mapExamSetItemToExamSet(item: ExamSetItem): ExamSet {
  const track =
    item.exam_track ??
    (item.exam_track_code
      ? { code: item.exam_track_code, name: item.exam_track_name ?? "" }
      : undefined);

  return {
    id: item.id,
    code: item.code,
    title: item.title,
    description: item.description ?? "",
    cover_image_url: item.cover_image_url,
    duration_minutes: item.duration_minutes,
    total_questions: item.total_questions,
    passing_score: item.passing_score,
    difficulty: item.difficulty,
    access_type: item.access_type,
    price_amount: item.price_amount ?? 0,
    sale_price_amount: item.sale_price_amount,
    currency: item.currency ?? "THB",
    mode: item.mode,
    is_official: item.is_official ?? false,
    is_featured: item.is_featured,
    exam_track: track,
  };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h} ชม. ${m} นาที`;
  }
  if (m > 0) {
    return `${m} นาที ${s} วินาที`;
  }
  return `${s} วินาที`;
}
