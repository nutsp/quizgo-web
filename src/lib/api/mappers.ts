import type { Exam, Difficulty, ExamFormat } from "@/data/exams";
import type { ExamSetItem } from "./types";

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  easy: "ง่าย",
  medium: "กลาง",
  hard: "ยาก",
};

const MODE_MAP: Record<string, ExamFormat> = {
  mock_exam: "Mock Exam",
  practice: "Practice",
};

export function mapExamSetToExam(set: ExamSetItem): Exam {
  return {
    id: set.id,
    title: set.title,
    description: set.description ?? "",
    category: (set.exam_track_name as Exam["category"]) ?? "เสมือนจริง",
    subjects: [],
    format: MODE_MAP[set.mode] ?? "Mock Exam",
    questionCount: set.total_questions,
    durationMinutes: set.duration_minutes,
    difficulty: DIFFICULTY_MAP[set.difficulty] ?? "กลาง",
    passingScore: set.passing_score,
    attemptCount: 0,
    isFree: set.access_type === "free",
    slug: set.code,
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
