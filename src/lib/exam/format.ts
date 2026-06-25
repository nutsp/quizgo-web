export type ExamSetDifficulty = "easy" | "medium" | "hard";
export type ExamSetAccessType = "free" | "premium";
export type ExamSetMode = "practice" | "mock_exam";

export type ExamSet = {
  id?: string;
  code: string;
  title: string;
  description: string;
  cover_image_url?: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  difficulty: ExamSetDifficulty;
  access_type: ExamSetAccessType;
  price_amount: number;
  sale_price_amount?: number | null;
  currency: string;
  mode: ExamSetMode;
  is_official: boolean;
  is_featured?: boolean;
  exam_track?: {
    code: string;
    name: string;
  };
};

export const DIFFICULTY_LABELS: Record<ExamSetDifficulty, string> = {
  easy: "ง่าย",
  medium: "กลาง",
  hard: "ยาก",
};

export const MODE_LABELS: Record<ExamSetMode, string> = {
  practice: "ฝึกทำข้อสอบ",
  mock_exam: "จำลองสนามสอบ",
};

export const ACCESS_LABELS: Record<ExamSetAccessType, string> = {
  free: "ฟรี",
  premium: "Premium",
};

export function formatBaht(amount: number, currency = "THB"): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatExamPrice(examSet: Pick<
  ExamSet,
  "access_type" | "price_amount" | "sale_price_amount" | "currency"
>): { primary: string; secondary?: string } {
  if (examSet.access_type === "free") {
    return { primary: "ฟรี" };
  }

  const sale = examSet.sale_price_amount;
  if (sale != null && sale < examSet.price_amount) {
    return {
      primary: formatBaht(sale, examSet.currency),
      secondary: `จากปกติ ${formatBaht(examSet.price_amount, examSet.currency)}`,
    };
  }

  return { primary: formatBaht(examSet.price_amount, examSet.currency) };
}
