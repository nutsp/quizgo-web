import type {
  ResultResponse,
  ReviewQuestion,
  SubjectBreakdownItem,
} from "@/lib/api/types";

export type BreakdownItem = {
  id?: string;
  name: string;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  total_count: number;
  score_percent: number;
};

export type RadarChartItem = {
  label: string;
  score_percent: number;
  correct_count: number;
  total_count: number;
};

export type QuestionStatus = "correct" | "wrong" | "unanswered";
export type ReviewFilter = "all" | "correct" | "wrong" | "unanswered";

export function mapSubjectBreakdown(items: SubjectBreakdownItem[]): BreakdownItem[] {
  return items.map((item) => ({
    name: item.subject_name,
    correct_count: item.correct,
    wrong_count: item.wrong,
    unanswered_count: item.unanswered,
    total_count: item.total,
    score_percent: item.score_percent,
  }));
}

export function buildTagBreakdownFromReview(questions: ReviewQuestion[]): BreakdownItem[] {
  const map = new Map<string, BreakdownItem>();

  for (const question of questions) {
    const tags = question.tags ?? [];
    if (tags.length === 0) continue;

    for (const tag of tags) {
      const existing = map.get(tag.code) ?? {
        id: tag.code,
        name: tag.name,
        correct_count: 0,
        wrong_count: 0,
        unanswered_count: 0,
        total_count: 0,
        score_percent: 0,
      };

      existing.total_count += 1;
      if (question.is_unanswered) {
        existing.unanswered_count += 1;
      } else if (question.is_correct) {
        existing.correct_count += 1;
      } else {
        existing.wrong_count += 1;
      }

      map.set(tag.code, existing);
    }
  }

  return Array.from(map.values()).map((item) => ({
    ...item,
    score_percent:
      item.total_count > 0 ? Math.round((item.correct_count / item.total_count) * 1000) / 10 : 0,
  }));
}

function breakdownToRadarItems(items: BreakdownItem[]): RadarChartItem[] {
  const sorted = [...items].sort((a, b) => b.total_count - a.total_count);
  const limited = sorted.length > 8 ? sorted.slice(0, 8) : sorted;

  return limited.map((item) => ({
    label: item.name,
    score_percent: item.score_percent,
    correct_count: item.correct_count,
    total_count: item.total_count,
  }));
}

export function buildRadarData(
  result: ResultResponse,
  reviewQuestions: ReviewQuestion[] = []
): { data: RadarChartItem[]; chartLabel: string; source: BreakdownItem[] } {
  const subjectItems = mapSubjectBreakdown(result.subject_breakdown);
  const tagItems = buildTagBreakdownFromReview(reviewQuestions);

  if (tagItems.length >= 3) {
    return {
      data: breakdownToRadarItems(tagItems),
      chartLabel: "คะแนนตามหัวข้อ",
      source: tagItems,
    };
  }

  if (subjectItems.length >= 3) {
    return {
      data: breakdownToRadarItems(subjectItems),
      chartLabel: "คะแนนตามหมวดวิชา",
      source: subjectItems,
    };
  }

  if (subjectItems.length > 0) {
    return {
      data: breakdownToRadarItems(subjectItems),
      chartLabel: "คะแนนตามหมวดวิชา",
      source: subjectItems,
    };
  }

  if (tagItems.length > 0) {
    return {
      data: breakdownToRadarItems(tagItems),
      chartLabel: "คะแนนตามหัวข้อ",
      source: tagItems,
    };
  }

  return { data: [], chartLabel: "คะแนนตามหมวดวิชา", source: [] };
}

export function getWeakestItems(items: BreakdownItem[], limit = 3): BreakdownItem[] {
  return [...items]
    .filter((item) => item.total_count > 0)
    .sort((a, b) => a.score_percent - b.score_percent)
    .slice(0, limit);
}

export function getQuestionStatus(question: ReviewQuestion): QuestionStatus {
  if (question.is_unanswered) return "unanswered";
  if (question.is_correct) return "correct";
  return "wrong";
}

export function filterReviewQuestions(
  questions: ReviewQuestion[],
  filter: ReviewFilter
): ReviewQuestion[] {
  if (filter === "all") return questions;
  return questions.filter((q) => getQuestionStatus(q) === filter);
}

export function truncateText(text: string, maxLength = 80): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}

export function getChoiceShortLabel(question: ReviewQuestion, choiceKey: string | null): string {
  if (!choiceKey) return "-";
  const choice = question.choices.find((c) => c.choice_key === choiceKey);
  return choice?.choice_label ?? choiceKey;
}
