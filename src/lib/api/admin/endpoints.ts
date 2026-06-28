import { apiDelete, apiDownloadBlob, apiGet, apiPatch, apiPost, apiPostFormData, apiPut } from "@/lib/api";
import type { PaginatedResponse, PaginationParams } from "@/lib/api/pagination";

export type { PaginatedResponse, PaginationMeta, PaginationParams } from "@/lib/api/pagination";

function listQuery(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [k, String(v)] as [string, string]);
  return entries.length ? `?${new URLSearchParams(entries)}` : "";
}

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

export type AdminExamTrackList = PaginatedResponse<AdminExamTrack>;

export type ExamTrackInput = {
  name: string;
  code: string;
  description?: string;
  cover_image_url?: string | null;
  is_active: boolean;
};

export const adminExamTracksApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminExamTrackList>(`/admin/exam-tracks${listQuery(params)}`, true);
  },
  get: (id: string) => apiGet<AdminExamTrack>(`/admin/exam-tracks/${id}`, true),
  create: (input: ExamTrackInput) => apiPost<AdminExamTrack>("/admin/exam-tracks", input, true),
  update: (id: string, input: ExamTrackInput) =>
    apiPut<AdminExamTrack>(`/admin/exam-tracks/${id}`, input, true),
  delete: (id: string) =>
    apiDelete<{ deactivated: boolean }>(`/admin/exam-tracks/${id}`, true),
};

// --- Exam Sets ---

export type ExamSetStatus = "draft" | "published" | "archived";

export type ReadinessCheck = {
  key: string;
  label: string;
  passed: boolean;
  severity?: "error" | "warning";
  message: string;
};

export type ExamSetReadiness = {
  exam_set_id: string;
  ready: boolean;
  status: ExamSetStatus;
  checks: ReadinessCheck[];
  summary: {
    total_questions: number;
    published_questions: number;
    draft_questions: number;
    invalid_questions: number;
  };
};

export type ExamSetPreviewChoice = {
  choice_key: string;
  choice_label: string;
  choice_text: string;
};

export type ExamSetPreviewQuestion = {
  question_no: number;
  question_text: string;
  subject_name?: string;
  difficulty?: string;
  choices: ExamSetPreviewChoice[];
};

export type ExamSetPreview = {
  exam_set: AdminExamSet & { status: ExamSetStatus };
  readiness: ExamSetReadiness;
  sample_questions: ExamSetPreviewQuestion[];
};

export type PublishStatusResponse = {
  id: string;
  code?: string;
  title?: string;
  status: ExamSetStatus;
  is_active?: boolean;
};

import {
  type AnswerSheetLayoutConfig,
} from "@/lib/exam/answerSheetLayout";

export type AnswerSheetLayoutInput = AnswerSheetLayoutConfig;

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
  allow_single_purchase: boolean;
  price_amount: number;
  original_price_amount?: number | null;
  currency: string;
  sale_price_amount?: number | null;
  mode: string;
  is_official: boolean;
  is_featured: boolean;
  is_active: boolean;
  status?: ExamSetStatus;
  exam_track?: { code: string; name: string };
  answer_sheet_layout?: AnswerSheetLayoutConfig;
  created_at: string;
  updated_at: string;
};

export type AdminExamSetList = PaginatedResponse<AdminExamSet>;

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
  allow_single_purchase: boolean;
  price_amount: number;
  original_price_amount?: number | null;
  sale_price_amount?: number | null;
  currency?: string;
  mode: string;
  is_official: boolean;
  is_featured: boolean;
  is_active: boolean;
  answer_sheet_layout: AnswerSheetLayoutConfig;
};

export const adminExamSetsApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminExamSetList>(`/admin/exam-sets${listQuery(params)}`, true);
  },
  get: (id: string) => apiGet<AdminExamSet>(`/admin/exam-sets/${id}`, true),
  create: (input: ExamSetInput) => apiPost<AdminExamSet>("/admin/exam-sets", input, true),
  update: (id: string, input: ExamSetInput) =>
    apiPut<AdminExamSet>(`/admin/exam-sets/${id}`, input, true),
  delete: (id: string) =>
    apiDelete<{ deactivated: boolean }>(`/admin/exam-sets/${id}`, true),
  getReadiness: (id: string) =>
    apiGet<ExamSetReadiness>(`/admin/exam-sets/${id}/readiness`, true),
  getPreview: (id: string) =>
    apiGet<ExamSetPreview>(`/admin/exam-sets/${id}/preview`, true),
  publish: (id: string) =>
    apiPost<PublishStatusResponse>(`/admin/exam-sets/${id}/publish`, {}, true),
  unpublish: (id: string) =>
    apiPost<PublishStatusResponse>(`/admin/exam-sets/${id}/unpublish`, {}, true),
  archive: (id: string) =>
    apiPost<PublishStatusResponse>(`/admin/exam-sets/${id}/archive`, {}, true),
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

export type AdminSubjectList = PaginatedResponse<AdminSubject>;

export type SubjectInput = {
  name: string;
  code: string;
  description?: string;
};

export const adminSubjectsApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminSubjectList>(`/admin/subjects${listQuery(params)}`, true);
  },
  get: (id: string) => apiGet<AdminSubject>(`/admin/subjects/${id}`, true),
  create: (input: SubjectInput) => apiPost<AdminSubject>("/admin/subjects", input, true),
  update: (id: string, input: SubjectInput) =>
    apiPut<AdminSubject>(`/admin/subjects/${id}`, input, true),
  delete: (id: string) => apiDelete<{ status: string }>(`/admin/subjects/${id}`, true),
};

// --- Question Tags ---

export type AdminQuestionTag = {
  id: string;
  name: string;
  code: string;
  description?: string;
  color?: string;
  is_active: boolean;
  question_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminQuestionTagList = PaginatedResponse<AdminQuestionTag>;

export type QuestionTagInput = {
  name: string;
  code: string;
  description?: string;
  color?: string;
  is_active?: boolean;
};

export type QuestionTagSummary = {
  id: string;
  name: string;
  code: string;
  color?: string;
};

export const adminQuestionTagsApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminQuestionTagList>(`/admin/question-tags${listQuery(params)}`, true);
  },
  get: (id: string) => apiGet<AdminQuestionTag>(`/admin/question-tags/${id}`, true),
  create: (input: QuestionTagInput) =>
    apiPost<AdminQuestionTag>("/admin/question-tags", input, true),
  update: (id: string, input: QuestionTagInput) =>
    apiPut<AdminQuestionTag>(`/admin/question-tags/${id}`, input, true),
  delete: (id: string) =>
    apiDelete<{ status: string; message?: string; tag?: AdminQuestionTag }>(
      `/admin/question-tags/${id}`,
      true
    ),
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
  tags?: QuestionTagSummary[];
  created_at: string;
  updated_at: string;
};

export type AdminQuestionList = PaginatedResponse<AdminQuestion>;

export type QuestionInput = {
  subject_id: string;
  question_text: string;
  difficulty: string;
  explanation?: string;
  status: string;
  tag_ids?: string[];
  choices: AdminChoice[];
};

export const adminQuestionsApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminQuestionList>(`/admin/questions${listQuery(params)}`, true);
  },
  get: (id: string) => apiGet<AdminQuestion>(`/admin/questions/${id}`, true),
  create: (input: QuestionInput) => apiPost<AdminQuestion>("/admin/questions", input, true),
  update: (id: string, input: QuestionInput) =>
    apiPut<AdminQuestion>(`/admin/questions/${id}`, input, true),
  delete: (id: string) =>
    apiDelete<{ archived: boolean }>(`/admin/questions/${id}`, true),
};

// --- Exam Set Questions ---

export {
  adminExamSetQuestionsApi,
  type AdminQuestionListItem,
  type AssignedExamQuestion,
  type AssignedQuestionsResponse,
  type AvailableQuestionsResponse,
  type BulkAddResponse,
  type ExamSetQuestionsSummary,
} from "./exam-set-questions";

/** @deprecated Use AssignedExamQuestion from exam-set-questions */
export type AdminExamSetQuestion = {
  question_no: number;
  question_id: string;
  question_preview: string;
  subject_name?: string;
  difficulty?: string;
  score: number;
  correct_answer?: string;
};

// --- Question Import ---

export type ImportPreviewRow = {
  row_number: number;
  valid: boolean;
  errors: string[];
  warnings: string[];
  data: {
    subject_code: string;
    tags?: string;
    question_text: string;
    choice_a: string;
    choice_b: string;
    choice_c: string;
    choice_d: string;
    correct_choice: string;
    explanation?: string;
    difficulty?: string;
    status?: string;
  };
};

export type ImportPreviewResult = {
  import_id: string;
  filename: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  rows: ImportPreviewRow[];
};

export type ImportConfirmResult = {
  import_id: string;
  status: string;
  imported_questions: number;
  skipped_rows: number;
  failed_rows?: number;
};

export type ImportJob = {
  id: string;
  filename: string;
  status: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  imported_questions: number;
  skipped_rows: number;
  failed_rows: number;
  created_at: string;
  confirmed_at?: string | null;
};

export type ImportJobList = PaginatedResponse<ImportJob>;

export const adminQuestionImportApi = {
  downloadTemplate: async () => {
    const blob = await apiDownloadBlob("/admin/questions/import/template", true);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question-import-template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  preview: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiPostFormData<ImportPreviewResult>("/admin/questions/import/preview", formData, true);
  },
  confirm: (input: { import_id: string; import_only_valid_rows: boolean }) =>
    apiPost<ImportConfirmResult>("/admin/questions/import/confirm", input, true),
  listJobs: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<ImportJobList>(`/admin/questions/import/jobs${listQuery(params)}`, true);
  },
};

// --- Users ---

export type DisplayAccessType = "free" | "exam_set" | "premium";

export type UserAccessSummary = {
  display_access_type: DisplayAccessType;
  has_premium: boolean;
  active_exam_set_count: number;
  premium_expires_at?: string | null;
};

export type AdminUser = {
  id: string;
  email: string;
  display_name?: string | null;
  role: string;
  status: string;
  last_login_at?: string | null;
  created_at: string;
  access_summary: UserAccessSummary;
};

export type AdminUserList = PaginatedResponse<AdminUser>;

export type AdminUserDetail = AdminUser & {
  recent_access_logs: AdminAccessLogSummary[];
  recent_audit_logs: AdminAuditLogSummary[];
};

export type AdminAccessLogSummary = {
  id: string;
  event_type: string;
  success: boolean;
  ip_address?: string;
  message?: string;
  created_at: string;
};

export type AdminAuditLogSummary = {
  id: string;
  action: string;
  resource_type: string;
  resource_name?: string;
  created_at: string;
};

export type AdminUserUpdateInput = {
  display_name?: string;
  role?: string;
  status?: string;
};

export const adminUsersApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminUserList>(`/admin/users${listQuery(params)}`, true);
  },
  get: (id: string) => apiGet<AdminUserDetail>(`/admin/users/${id}`, true),
  update: (id: string, input: AdminUserUpdateInput) =>
    apiPut<AdminUser>(`/admin/users/${id}`, input, true),
  updateStatus: (id: string, status: string) =>
    apiPatch<AdminUser>(`/admin/users/${id}/status`, { status }, true),
  updateRole: (id: string, role: string) =>
    apiPatch<AdminUser>(`/admin/users/${id}/role`, { role }, true),
};

// --- Access Logs ---

export type AdminAccessLog = {
  id: string;
  user_id?: string | null;
  email?: string;
  event_type: string;
  success: boolean;
  ip_address?: string;
  user_agent?: string;
  message?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type AdminAccessLogList = PaginatedResponse<AdminAccessLog>;

export const adminAccessLogsApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminAccessLogList>(`/admin/access-logs${listQuery(params)}`, true);
  },
};

// --- Audit Logs ---

export type AdminAuditLog = {
  id: string;
  actor_user_id?: string | null;
  actor_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  resource_name?: string;
  before_data?: unknown;
  after_data?: unknown;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type AdminAuditLogList = PaginatedResponse<AdminAuditLog>;

export const adminAuditLogsApi = {
  list: (params?: PaginationParams & Record<string, string | number | undefined>) => {
    return apiGet<AdminAuditLogList>(`/admin/audit-logs${listQuery(params)}`, true);
  },
  get: (id: string) => apiGet<AdminAuditLog>(`/admin/audit-logs/${id}`, true),
};

// --- Entitlements ---

export type UserEntitlement = {
  id: string;
  user_id: string;
  entitlement_type: "exam_set" | "premium";
  ref_type?: "exam_set" | null;
  ref_id?: string | null;
  ref_name?: string | null;
  source: "manual" | "purchase" | "subscription";
  starts_at: string;
  expires_at?: string | null;
  is_active: boolean;
  status: "active" | "expired" | "revoked" | "pending";
  notes?: string | null;
  granted_by?: string | null;
  granted_by_name?: string | null;
  created_at: string;
};

export type UserEntitlementList = PaginatedResponse<UserEntitlement>;

export type GrantExamSetEntitlementInput = {
  exam_set_id: string;
  expires_at?: string | null;
  notes?: string | null;
};

export type GrantPremiumEntitlementInput = {
  expires_at: string;
  notes?: string | null;
};

export const adminEntitlementsApi = {
  listUserEntitlements: (userId: string, params?: PaginationParams) =>
    apiGet<UserEntitlementList>(`/admin/users/${userId}/entitlements${listQuery(params)}`, true),
  grantExamSet: (userId: string, input: GrantExamSetEntitlementInput) =>
    apiPost<UserEntitlement>(`/admin/users/${userId}/entitlements/exam-set`, input, true),
  grantPremium: (userId: string, input: GrantPremiumEntitlementInput) =>
    apiPost<UserEntitlement>(`/admin/users/${userId}/entitlements/premium`, input, true),
  revoke: (entitlementId: string) =>
    apiDelete<UserEntitlement>(`/admin/entitlements/${entitlementId}`, true),
};
