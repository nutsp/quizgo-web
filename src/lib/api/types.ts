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

export interface ExamSetItem {
  id: string;
  code: string;
  title: string;
  description?: string;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  difficulty: string;
  access_type: string;
  mode: string;
  exam_track_code?: string;
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
