import type { ScoreTrendPoint, SubjectPerformanceItem } from "@/lib/api/types";

export type ScoreTrendChartPoint = {
  label: string;
  score_percent: number;
  exam_set_title: string;
  submitted_at: string;
  passed: boolean;
};

export type SubjectPerformanceChartPoint = {
  label: string;
  score_percent: number;
  subject_name: string;
  total_questions?: number;
};

export type RadarSubjectItem = {
  label: string;
  subject_name: string;
  score_percent: number;
  total_questions?: number;
};

export function buildScoreTrendChartData(
  points: ScoreTrendPoint[] = []
): ScoreTrendChartPoint[] {
  return points.map((item, index) => ({
    label: `ครั้งที่ ${index + 1}`,
    score_percent: item.score_percent,
    exam_set_title: item.exam_set_title,
    submitted_at: item.submitted_at,
    passed: item.passed,
  }));
}

export function buildSubjectPerformanceRadarData(
  items: SubjectPerformanceItem[] = []
): RadarSubjectItem[] {
  return items
    .filter((item) => item.total_questions === undefined || item.total_questions > 0)
    .sort((a, b) => (b.total_questions ?? 0) - (a.total_questions ?? 0))
    .slice(0, 8)
    .map((item) => ({
      label: truncateChartLabel(item.subject_name, 12),
      subject_name: item.subject_name,
      score_percent: Math.round(item.score_percent ?? 0),
      total_questions: item.total_questions,
    }));
}

export function buildSubjectPerformanceChartData(
  items: SubjectPerformanceItem[] = []
): SubjectPerformanceChartPoint[] {
  return buildSubjectPerformanceRadarData(items).map((item) => ({
    label: item.label,
    score_percent: item.score_percent,
    subject_name: item.subject_name,
    total_questions: item.total_questions,
  }));
}

export function truncateChartLabel(label: string, max = 10): string {
  if (label.length <= max) return label;
  return `${label.slice(0, max).trim()}…`;
}
