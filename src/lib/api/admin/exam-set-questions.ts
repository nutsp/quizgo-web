import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";

export type AdminQuestionListItem = {
  id: string;
  question_text: string;
  subject?: {
    id: string;
    name: string;
  };
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

export type AvailableQuestionsResponse = {
  items: AdminQuestionListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type AssignedQuestionsResponse = {
  exam_set: ExamSetQuestionsSummary;
  items: AssignedExamQuestion[];
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
  getAvailableQuestions: (examSetId: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return apiGet<AvailableQuestionsResponse>(
      `/admin/exam-sets/${examSetId}/available-questions${query}`,
      true
    );
  },
  listAssignedQuestions: (examSetId: string) =>
    apiGet<AssignedQuestionsResponse>(`/admin/exam-sets/${examSetId}/questions`, true),
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
