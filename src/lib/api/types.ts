import type { AnswerSheetLayoutConfig } from "@/lib/exam/answerSheetLayout";
import type { ExamSetAccess, ExamSetAccessType } from "@/lib/exam/format";

export type { ExamSet, ExamSetDifficulty, ExamSetAccessType, ExamSetMode, ExamSetAccess } from "@/lib/exam/format";
export type { AnswerSheetLayoutConfig } from "@/lib/exam/answerSheetLayout";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiUser {
  id: string;
  display_name: string;
  public_display_name?: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: ApiUser;
}

export interface HomeResponse {
  recommended_exam_tracks: ExamTrackItem[];
  popular_exam_sets: ExamSetItem[];
  continue_attempt: ContinueAttempt | null;
  my_progress_summary: ProgressSummary | null;
}

export interface ExamTrackItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  total_exam_sets: number;
  total_questions: number;
}

export interface ExamTrackRef {
  code: string;
  name: string;
}

export interface ExamSetItem {
  id?: string;
  code: string;
  title: string;
  description?: string;
  cover_image_url?: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  difficulty: "easy" | "medium" | "hard";
  access_type: "free" | "paid" | "premium" | "private";
  allow_single_purchase?: boolean;
  price_amount: number;
  sale_price_amount?: number | null;
  original_price_amount?: number | null;
  currency: string;
  mode: "practice" | "mock_exam";
  is_official: boolean;
  is_featured?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  attempt_count?: number | null;
  purchase_count?: number | null;
  completed_count?: number | null;
  exam_track?: ExamTrackRef;
  access?: ExamSetAccess;
  /** @deprecated use exam_track */
  exam_track_code?: string;
  /** @deprecated use exam_track */
  exam_track_name?: string;
}

export interface PaginatedExamSets {
  items: ExamSetItem[];
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface ContinueAttempt {
  attempt_id: string;
  exam_set_code: string;
  exam_set_title: string;
  answered_count: number;
  total_questions: number;
  remaining_seconds: number;
}

export interface ProgressSummary {
  average_score_percent: number;
  completed_attempts: number;
  latest_weak_subject: string;
}

export interface ApiChoice {
  choice_key: string;
  choice_label: string;
  choice_text: string;
}

export interface ReviewChoice extends ApiChoice {
  is_selected: boolean;
  is_correct: boolean;
}

export interface ApiQuestion {
  question_no: number;
  question_id: string;
  question_text: string;
  choices: ApiChoice[];
}

export interface StartAttemptResponse {
  attempt_id: string;
  exam_set: {
    code: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
  };
  started_at: string;
  expires_at: string;
  questions: ApiQuestion[];
  answers: Record<string, string>;
}

export interface GetAttemptResponse {
  attempt_id: string;
  status: string;
  exam_set: {
    code: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
    passing_score?: number;
    answer_sheet_layout?: AnswerSheetLayoutConfig;
  };
  started_at: string;
  expires_at: string;
  remaining_seconds: number;
  questions: ApiQuestion[];
  answers: Record<string, string>;
  answered_count: number;
  unanswered_count: number;
}

export interface SubmitResponse {
  attempt_id: string;
  status: string;
  score: number;
  total_score: number;
  score_percent: number;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  duration_seconds: number;
  passed: boolean;
}

export interface SubjectBreakdownItem {
  subject_name: string;
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
  score_percent: number;
}

export interface WeaknessAnalysisItem {
  subject_name: string;
  score_percent: number;
  recommendation: string;
}

export interface ResultSummary {
  status: string;
  score: number;
  total_score: number;
  score_percent: number;
  passed: boolean;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  duration_seconds: number;
  started_at: string;
  submitted_at?: string | null;
}

export interface ResultResponse {
  attempt_id: string;
  exam_set: {
    code: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
    passing_score?: number;
  };
  exam_track: ExamTrackRef;
  summary: ResultSummary;
  subject_breakdown: SubjectBreakdownItem[];
  weakness_analysis: WeaknessAnalysisItem[];
}

export interface ReviewQuestion {
  question_no: number;
  question_id: string;
  question_text: string;
  choices: ReviewChoice[];
  selected_choice_key: string | null;
  correct_choice_key: string;
  is_correct: boolean;
  is_unanswered: boolean;
  explanation: string;
  subject: string;
  tags?: { name: string; code: string }[];
}

export interface ReviewResponse {
  attempt_id: string;
  exam_set: {
    code: string;
    title: string;
  };
  questions: ReviewQuestion[];
}

// My Results types

export interface WeakSubject {
  subject_code?: string;
  subject_name: string;
  average_score_percent: number;
  recommendation?: string;
}

export interface MyResultsSummary {
  total_attempts: number;
  completed_exam_sets: number;
  completed_exam_tracks: number;
  average_score_percent: number;
  best_score_percent: number;
  latest_score_percent: number;
  passed_attempts: number;
  failed_attempts: number;
  pass_rate_percent: number;
  average_duration_seconds: number;
  most_practiced_exam_track?: ExamTrackRef;
  weak_subjects: WeakSubject[];
}

export interface ExamTrackResultSummary {
  exam_track: ExamTrackItem & { cover_image_url?: string | null };
  completed_exam_sets: number;
  total_exam_sets: number;
  total_attempts: number;
  average_best_score_percent: number;
  best_score_percent: number;
  latest_score_percent: number;
  passed_exam_sets: number;
  failed_exam_sets: number;
  average_duration_seconds: number;
  last_attempt_at?: string | null;
  weak_subjects: WeakSubject[];
}

export interface TrackSummaryStats {
  completed_exam_sets: number;
  total_exam_sets: number;
  total_attempts: number;
  average_best_score_percent: number;
  best_score_percent: number;
  latest_score_percent: number;
  passed_exam_sets: number;
  failed_exam_sets: number;
  average_duration_seconds: number;
  readiness_percent: number;
}

export interface ExamSetProgressItem {
  exam_set: {
    id?: string;
    code: string;
    title: string;
    cover_image_url?: string | null;
    total_questions?: number;
    duration_minutes?: number;
    passing_score?: number;
  };
  attempt_count: number;
  latest_attempt_id?: string;
  latest_score_percent: number;
  best_attempt_id?: string;
  best_score_percent: number;
  first_score_percent: number;
  improvement_percent: number;
  passed: boolean;
  last_attempt_at?: string | null;
}

export interface ExamTrackResultDetail {
  exam_track: ExamTrackItem & {
    cover_image_url?: string | null;
    description?: string;
  };
  summary: TrackSummaryStats;
  exam_sets: ExamSetProgressItem[];
  weakness_analysis: WeakSubject[];
}

export interface AttemptHistoryItem {
  attempt_id: string;
  exam_track: ExamTrackRef;
  exam_set: {
    code: string;
    title: string;
    cover_image_url?: string | null;
  };
  attempt_no: number;
  score: number;
  total_score: number;
  score_percent: number;
  passed: boolean;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  duration_seconds: number;
  status: string;
  started_at: string;
  submitted_at?: string | null;
}

export interface PaginatedAttempts {
  items: AttemptHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ExamSetResultDetail {
  exam_set: {
    code: string;
    title: string;
    cover_image_url?: string | null;
    passing_score?: number;
  };
  summary: {
    attempt_count: number;
    first_score_percent: number;
    latest_score_percent: number;
    best_score_percent: number;
    improvement_percent: number;
    passed: boolean;
    average_duration_seconds: number;
  };
  attempts: {
    attempt_id: string;
    attempt_no: number;
    score_percent: number;
    passed: boolean;
    duration_seconds: number;
    submitted_at?: string | null;
  }[];
}

export interface LeaderboardPagination {
  page: number;
  limit: number;
  total: number;
}

export interface ExamSetLeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  is_current_user: boolean;
  score: number;
  total_score: number;
  score_percent: number;
  passed: boolean;
  duration_seconds: number;
  submitted_at?: string | null;
}

export interface ExamSetCurrentUserRank {
  rank: number;
  score_percent: number;
  duration_seconds: number;
  submitted_at?: string | null;
}

export interface ExamSetLeaderboardResponse {
  exam_set: {
    code: string;
    title: string;
    exam_track_name: string;
  };
  leaderboard: ExamSetLeaderboardEntry[];
  current_user_rank?: ExamSetCurrentUserRank | null;
  pagination: LeaderboardPagination;
}

export interface ExamTrackLeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  is_current_user: boolean;
  average_score_percent: number;
  completed_exam_sets: number;
  passed_exam_sets: number;
  pass_rate_percent: number;
  latest_submitted_at?: string | null;
}

export interface ExamTrackCurrentUserRank {
  rank: number;
  average_score_percent: number;
  completed_exam_sets: number;
  passed_exam_sets: number;
  pass_rate_percent: number;
}

export interface ExamTrackLeaderboardResponse {
  exam_track: {
    code: string;
    name: string;
  };
  leaderboard: ExamTrackLeaderboardEntry[];
  current_user_rank?: ExamTrackCurrentUserRank | null;
  pagination: LeaderboardPagination;
}

export type UserProfile = {
  id: string;
  email: string;
  display_name?: string | null;
  public_display_name: string;
  role: "user" | "admin";
  created_at?: string;
  stats?: {
    total_attempts: number;
    completed_exam_sets: number;
    average_score_percent: number;
    best_score_percent: number;
  };
};

export type UpdateProfileInput = {
  display_name: string;
};

export type MyExamSummary = {
  has_premium: boolean;
  premium_expires_at?: string | null;
  unlocked_exam_set_count: number;
  private_exam_set_count: number;
};

export type MyExamAccessSource =
  | "single_purchase"
  | "private_grant"
  | "premium"
  | "granted";

export type MyExamItem = {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  access_type: ExamSetAccessType;
  access_source: MyExamAccessSource;
  cover_image_url?: string | null;
  total_questions: number;
  duration_minutes: number;
  difficulty?: string | null;
  passing_score?: number | null;
  exam_track?: {
    id: string;
    name: string;
    code: string;
  } | null;
  entitlement?: {
    id: string;
    source: string;
    starts_at: string;
    expires_at?: string | null;
    status: "active" | "expired" | "revoked" | "pending";
  } | null;
  latest_attempt?: {
    attempt_id: string;
    status: "in_progress" | "submitted" | "timeout";
    score_percent?: number | null;
    submitted_at?: string | null;
  } | null;
};
