import { apiGet } from "@/lib/api";
import type {
  ExamSetAccessType,
  MyExamAccessSource,
  MyExamItem,
  MyExamSummary,
} from "@/lib/api/types";

export type MyExamsResponse = {
  summary: MyExamSummary;
  items: MyExamItem[];
};

export const meExamsApi = {
  list() {
    return apiGet<MyExamsResponse>("/me/exams", true);
  },
};

export type {
  ExamSetAccessType,
  MyExamAccessSource,
  MyExamItem,
  MyExamSummary,
};
