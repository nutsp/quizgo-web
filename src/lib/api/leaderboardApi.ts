import { apiGet } from "@/lib/api";
import type { ExamSetLeaderboardResponse, ExamTrackLeaderboardResponse } from "@/lib/api/types";

export const leaderboardApi = {
  getExamSetLeaderboard(examSetCode: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return apiGet<ExamSetLeaderboardResponse>(
      `/exam-sets/${examSetCode}/leaderboard?${params}`,
      true
    );
  },

  getExamTrackLeaderboard(trackCode: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return apiGet<ExamTrackLeaderboardResponse>(
      `/exam-tracks/${trackCode}/leaderboard?${params}`,
      true
    );
  },
};
