import { apiGet } from "@/lib/api";
import type { PaginationMeta } from "@/lib/api/pagination";
import type {
  ExamSetAccessType,
  MyExamAccessSource,
  MyExamItem,
  MyExamSummary,
} from "@/lib/api/types";
import type { MyExamTab } from "@/lib/my-exams/filters";

export type MyExamsListParams = {
  page?: number;
  limit?: number;
  tab?: MyExamTab;
};

export type MyExamsResponse = {
  summary: MyExamSummary;
  items: MyExamItem[];
  pagination: PaginationMeta;
};

export const MY_EXAMS_PAGE_SIZE = 12;

export const meExamsApi = {
  list(params: MyExamsListParams = {}) {
    const query = new URLSearchParams();
    if (params.page != null) query.set("page", String(params.page));
    if (params.limit != null) query.set("limit", String(params.limit));
    if (params.tab != null) query.set("tab", params.tab);

    const suffix = query.toString();
    return apiGet<MyExamsResponse>(`/me/exams${suffix ? `?${suffix}` : ""}`, true);
  },
};

export type {
  ExamSetAccessType,
  MyExamAccessSource,
  MyExamItem,
  MyExamSummary,
};
