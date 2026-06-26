import { apiGet } from "@/lib/api";
import type { ResultResponse, ReviewResponse } from "@/lib/api/types";

export const resultApi = {
  getAttemptResult(attemptId: string) {
    return apiGet<ResultResponse>(`/attempts/${attemptId}/result`, true);
  },

  getAttemptReview(attemptId: string) {
    return apiGet<ReviewResponse>(`/attempts/${attemptId}/review`, true);
  },
};
