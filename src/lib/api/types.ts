export type { ExamSet, ExamSetDifficulty, ExamSetAccessType, ExamSetMode } from "@/lib/exam/format";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export interface ApiUser {
  id: string;
  display_name: string;
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
  access_type: "free" | "premium";
  price_amount: number;
  sale_price_amount?: number | null;
  currency: string;
  mode: "practice" | "mock_exam";
  is_official: boolean;
  is_featured?: boolean;
  exam_track?: ExamTrackRef;
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
  total: number;
  score_percent: number;
}

export interface ResultResponse {
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
  exam_set: {
    code: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
    passing_score?: number;
  };
  subject_breakdown: SubjectBreakdownItem[];
  weakness_analysis: SubjectBreakdownItem[];
  next_recommended_actions: string[];
}

export interface ReviewQuestion {
  question_no: number;
  question_id: string;
  question_text: string;
  choices: ApiChoice[];
  selected_choice_key: string | null;
  correct_choice_key: string;
  is_correct: boolean;
  explanation: string;
  subject: string;
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
