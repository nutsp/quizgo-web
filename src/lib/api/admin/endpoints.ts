import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";

// --- Dashboard ---

export type AdminDashboard = {
  total_exam_tracks: number;
  total_exam_sets: number;
  total_subjects: number;
  total_questions: number;
  total_attempts: number;
  published_questions: number;
  draft_questions: number;
  active_exam_sets: number;
  premium_exam_sets: number;
  free_exam_sets: number;
  latest_exam_sets: AdminLatestExamSet[];
  latest_questions: AdminLatestQuestion[];
};

export type AdminLatestExamSet = {
  id: string;
  code: string;
  title: string;
  exam_track_name?: string;
  total_questions: number;
  is_active: boolean;
  created_at: string;
};

export type AdminLatestQuestion = {
  id: string;
  question_preview: string;
  subject_name?: string;
  status: string;
  created_at: string;
};

export const adminDashboardApi = {
  get: () => apiGet<AdminDashboard>("/admin/dashboard", true),
};

// --- Exam Tracks ---

export type AdminExamTrack = {
  id: string;
  code: string;
  name: string;
  description?: string;
  cover_image_url?: string | null;
  total_exam_sets: number;
  total_questions: number;
  total_attempts: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminExamTrackList = {
  items: AdminExamTrack[];
  total_items: number;
  page: number;
  limit: number;
};

export type ExamTrackInput = {
  name: string;
  code: string;
  description?: string;
  cover_image_url?: string | null;
  is_active: boolean;
};

export const adminExamTracksApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return apiGet<AdminExamTrackList>(`/admin/exam-tracks${query}`, true);
  },
  get: (id: string) => apiGet<AdminExamTrack>(`/admin/exam-tracks/${id}`, true),
  create: (input: ExamTrackInput) => apiPost<AdminExamTrack>("/admin/exam-tracks", input, true),
  update: (id: string, input: ExamTrackInput) =>
    apiPut<AdminExamTrack>(`/admin/exam-tracks/${id}`, input, true),
  delete: (id: string) =>
    apiDelete<{ deactivated: boolean }>(`/admin/exam-tracks/${id}`, true),
};

// --- Exam Sets ---

export type AdminExamSet = {
  id: string;
  exam_track_id: string;
  code: string;
  title: string;
  description?: string;
  cover_image_url?: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  difficulty: string;
  access_type: string;
  price_amount: number;
  currency: string;
  sale_price_amount?: number | null;
  mode: string;
  is_official: boolean;
  is_featured: boolean;
  is_active: boolean;
  exam_track?: { code: string; name: string };
  created_at: string;
  updated_at: string;
};

export type AdminExamSetList = {
  items: AdminExamSet[];
  total_items: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type ExamSetInput = {
  exam_track_id: string;
  title: string;
  code: string;
  description?: string;
  cover_image_url?: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  difficulty: string;
  access_type: string;
  price_amount: number;
  sale_price_amount?: number | null;
  currency?: string;
  mode: string;
  is_official: boolean;
  is_featured: boolean;
  is_active: boolean;
};

export const adminExamSetsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return apiGet<AdminExamSetList>(`/admin/exam-sets${query}`, true);
  },
  get: (id: string) => apiGet<AdminExamSet>(`/admin/exam-sets/${id}`, true),
  create: (input: ExamSetInput) => apiPost<AdminExamSet>("/admin/exam-sets", input, true),
  update: (id: string, input: ExamSetInput) =>
    apiPut<AdminExamSet>(`/admin/exam-sets/${id}`, input, true),
  delete: (id: string) =>
    apiDelete<{ deactivated: boolean }>(`/admin/exam-sets/${id}`, true),
};

// --- Subjects ---

export type AdminSubject = {
  id: string;
  code: string;
  name: string;
  description?: string;
  question_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminSubjectList = {
  items: AdminSubject[];
  total_items: number;
  page: number;
  limit: number;
};

export type SubjectInput = {
  name: string;
  code: string;
  description?: string;
};

export const adminSubjectsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return apiGet<AdminSubjectList>(`/admin/subjects${query}`, true);
  },
  get: (id: string) => apiGet<AdminSubject>(`/admin/subjects/${id}`, true),
  create: (input: SubjectInput) => apiPost<AdminSubject>("/admin/subjects", input, true),
  update: (id: string, input: SubjectInput) =>
    apiPut<AdminSubject>(`/admin/subjects/${id}`, input, true),
  delete: (id: string) => apiDelete<{ status: string }>(`/admin/subjects/${id}`, true),
};

// --- Questions ---

export type AdminChoice = {
  id?: string;
  choice_key: string;
  choice_label: string;
  choice_text: string;
  is_correct: boolean;
};

export type AdminQuestion = {
  id: string;
  subject_id: string;
  subject_name?: string;
  question_text: string;
  question_preview?: string;
  difficulty: string;
  explanation?: string;
  status: string;
  is_active: boolean;
  correct_answer?: string;
  choices?: AdminChoice[];
  created_at: string;
  updated_at: string;
};

export type AdminQuestionList = {
  items: AdminQuestion[];
  total_items: number;
  page: number;
  limit: number;
};

export type QuestionInput = {
  subject_id: string;
  question_text: string;
  difficulty: string;
  explanation?: string;
  status: string;
  choices: AdminChoice[];
};

export const adminQuestionsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return apiGet<AdminQuestionList>(`/admin/questions${query}`, true);
  },
  get: (id: string) => apiGet<AdminQuestion>(`/admin/questions/${id}`, true),
  create: (input: QuestionInput) => apiPost<AdminQuestion>("/admin/questions", input, true),
  update: (id: string, input: QuestionInput) =>
    apiPut<AdminQuestion>(`/admin/questions/${id}`, input, true),
  delete: (id: string) =>
    apiDelete<{ archived: boolean }>(`/admin/questions/${id}`, true),
};

// --- Exam Set Questions ---

export type AdminExamSetQuestion = {
  question_no: number;
  question_id: string;
  question_preview: string;
  subject_name?: string;
  difficulty?: string;
  score: number;
  correct_answer?: string;
};

export const adminExamSetQuestionsApi = {
  list: (examSetId: string) =>
    apiGet<{ items: AdminExamSetQuestion[] }>(`/admin/exam-sets/${examSetId}/questions`, true),
  add: (examSetId: string, input: { question_id: string; question_no?: number; score?: number }) =>
    apiPost<{ status: string }>(`/admin/exam-sets/${examSetId}/questions`, input, true),
  reorder: (
    examSetId: string,
    items: { question_id: string; question_no: number }[]
  ) =>
    apiPut<{ status: string }>(`/admin/exam-sets/${examSetId}/questions/reorder`, { items }, true),
  remove: (examSetId: string, questionId: string) =>
    apiDelete<{ status: string }>(`/admin/exam-sets/${examSetId}/questions/${questionId}`, true),
};
