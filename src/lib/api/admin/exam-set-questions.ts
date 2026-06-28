import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { PaginatedResponse, PaginationParams } from "@/lib/api/pagination";

function listQuery(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [k, String(v)] as [string, string]);
  return entries.length ? `?${new URLSearchParams(entries)}` : "";
}

export type AdminQuestionListItem = {
  id: string;
  question_text: string;
  subject?: {
    id: string;
    name: string;
  };
  tags?: {
    id: string;
    name: string;
    code: string;
    color?: string;
  }[];
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  correct_choice_key?: "A" | "B" | "C" | "D";
  already_assigned?: boolean;
  created_at?: string;
};

export type AssignedExamQuestion = {
  question_id: string;
  question_no: number;
  score: number;
  question_text: string;
  subject?: {
    id: string;
    name: string;
  };
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
};

export type ExamSetQuestionsSummary = {
  id: string;
  code: string;
  title: string;
  total_questions: number;
  duration_minutes: number;
  passing_score: number;
};

export type AvailableQuestionsResponse = PaginatedResponse<AdminQuestionListItem>;

export type AssignedQuestionsResponse = {
  exam_set: ExamSetQuestionsSummary;
  items: AssignedExamQuestion[];
  pagination: PaginatedResponse<AssignedExamQuestion>["pagination"];
  is_locked_by_attempts: boolean;
};

export type BulkAddResponse = {
  exam_set_id: string;
  added_count: number;
  skipped_count: number;
  total_questions: number;
  added_questions?: { question_id: string; question_no: number }[];
  skipped_questions?: { question_id: string; reason: string }[];
};

export const adminExamSetQuestionsApi = {
  getAvailableQuestions: (examSetId: string, params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AvailableQuestionsResponse>(
      `/admin/exam-sets/${examSetId}/available-questions${listQuery(params)}`,
      true
    );
  },
  listAssignedQuestions: (examSetId: string, params?: PaginationParams & Record<string, string | number | undefined>) =>
    apiGet<AssignedQuestionsResponse>(
      `/admin/exam-sets/${examSetId}/questions${listQuery(params)}`,
      true
    ),
  bulkAdd: (
    examSetId: string,
    input: { question_ids: string[]; score?: number; append_to_end?: boolean }
  ) =>
    apiPost<BulkAddResponse>(`/admin/exam-sets/${examSetId}/questions/bulk`, input, true),
  reorder: (examSetId: string, items: { question_id: string; question_no: number }[]) =>
    apiPut<{ status: string }>(
      `/admin/exam-sets/${examSetId}/questions/reorder`,
      { items },
      true
    ),
  remove: (examSetId: string, questionId: string) =>
    apiDelete<{ removed: boolean; total_questions: number }>(
      `/admin/exam-sets/${examSetId}/questions/${questionId}`,
      true
    ),
  clearAll: (examSetId: string) =>
    apiDelete<{ cleared: boolean; total_questions: number }>(
      `/admin/exam-sets/${examSetId}/questions`,
      true,
      { confirm: true }
    ),
};
