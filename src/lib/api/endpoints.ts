import { apiGet, apiDelete, apiPost, apiPut } from "@/lib/api";
import { resultApi } from "@/lib/api/resultApi";
import type {
  ExamSetItem,
  ExamSetResultDetail,
  ExamTrackResultDetail,
  ExamTrackResultSummary,
  GetAttemptResponse,
  HomeResponse,
  LoginResponse,
  MyResultsSummary,
  PaginatedAttempts,
  PaginatedExamSets,
  StartAttemptResponse,
  SubmitResponse,
} from "@/lib/api/types";
import type { AuthUser } from "@/lib/types";

export function login(email: string, password: string) {
  return apiPost<LoginResponse>("/auth/login", { email, password });
}

export function register(displayName: string, email: string, password: string) {
  return apiPost<LoginResponse>("/auth/register", {
    display_name: displayName,
    email,
    password,
  });
}

export function getMe() {
  return apiGet<AuthUser>("/auth/me", true, true);
}

export function getHome(auth = true) {
  return apiGet<HomeResponse>("/home", auth);
}

export function listExamSets(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return apiGet<PaginatedExamSets>(`/exam-sets${query}`, true, true);
}

export function getExamSet(examSetCode: string) {
  return apiGet<ExamSetItem>(`/exam-sets/${examSetCode}`, true, true);
}

export function startAttempt(examSetCode: string) {
  return apiPost<StartAttemptResponse>(`/exam-sets/${examSetCode}/attempts`, undefined, true);
}

export function getAttempt(attemptId: string) {
  return apiGet<GetAttemptResponse>(`/attempts/${attemptId}`, true);
}

export function saveAnswer(
  attemptId: string,
  questionNo: number,
  selectedChoiceKey: string
) {
  return apiPut<{ answered_count: number; unanswered_count: number }>(
    `/attempts/${attemptId}/answers/${questionNo}`,
    { selected_choice_key: selectedChoiceKey }
  );
}

export function clearAnswer(attemptId: string, questionNo: number) {
  return apiDelete<{ answered_count: number; unanswered_count: number }>(
    `/attempts/${attemptId}/answers/${questionNo}`
  );
}

export function submitAttempt(attemptId: string) {
  return apiPost<SubmitResponse>(`/attempts/${attemptId}/submit`, undefined, true);
}

export function getResult(attemptId: string) {
  return resultApi.getAttemptResult(attemptId);
}

export function getReview(attemptId: string) {
  return resultApi.getAttemptReview(attemptId);
}

export function getMyResultsSummary() {
  return apiGet<MyResultsSummary>("/me/results/summary", true);
}

export function getMyExamTrackResults() {
  return apiGet<ExamTrackResultSummary[]>("/me/results/exam-tracks", true);
}

export function getMyExamTrackResultDetail(trackCode: string) {
  return apiGet<ExamTrackResultDetail>(`/me/results/exam-tracks/${trackCode}`, true);
}

export function listMyAttemptResults(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return apiGet<PaginatedAttempts>(`/me/results${query}`, true);
}

export function getMyExamSetResultDetail(examSetCode: string) {
  return apiGet<ExamSetResultDetail>(`/me/results/exam-sets/${examSetCode}`, true);
}
