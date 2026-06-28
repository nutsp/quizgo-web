"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { QuestionReviewCompactList } from "@/components/results/QuestionReviewCompactList";
import type { ReviewQuestion } from "@/lib/api/types";
import {
  filterReviewQuestions,
  type ReviewFilter,
} from "@/lib/results/transforms";
import { cn } from "@/lib/utils";

const FILTERS: { key: ReviewFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "correct", label: "ตอบถูก" },
  { key: "wrong", label: "ตอบผิด" },
  { key: "unanswered", label: "ไม่ตอบ" },
];

interface QuestionReviewWorkspaceProps {
  questions: ReviewQuestion[];
  loading?: boolean;
  initialFilter?: ReviewFilter;
  selectedQuestionNo?: number | null;
  onSelectedQuestionChange?: (questionNo: number | null) => void;
}

export function QuestionReviewWorkspace({
  questions,
  loading,
  initialFilter = "all",
  selectedQuestionNo,
  onSelectedQuestionChange,
}: QuestionReviewWorkspaceProps) {
  const [filter, setFilter] = useState<ReviewFilter>(initialFilter);
  const [internalOpenNo, setInternalOpenNo] = useState<number | null>(null);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const openQuestionNo = selectedQuestionNo ?? internalOpenNo;

  const filteredQuestions = useMemo(
    () => filterReviewQuestions(questions, filter),
    [questions, filter]
  );

  const handleToggleQuestion = (questionNo: number) => {
    const next = openQuestionNo === questionNo ? null : questionNo;
    if (onSelectedQuestionChange) {
      onSelectedQuestionChange(next);
    } else {
      setInternalOpenNo(next);
    }
  };

  const handleFilterChange = (next: ReviewFilter) => {
    setFilter(next);
    if (onSelectedQuestionChange) {
      onSelectedQuestionChange(null);
    } else {
      setInternalOpenNo(null);
    }
  };

  return (
    <section id="review" className="scroll-mt-20 space-y-3">
      <div>
        <h2 className="text-base font-bold text-slate-900">เฉลยข้อสอบ</h2>
        <p className="text-xs text-slate-500">
          ตรวจสอบคำตอบของคุณเทียบกับเฉลย — แตะข้อที่ต้องการเพื่อดูรายละเอียด
        </p>
      </div>

      <div className="sticky top-0 z-10 -mx-0.5 rounded-xl bg-white/95 px-0.5 py-1.5 backdrop-blur-sm">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={filter === key ? "default" : "outline"}
              className={cn(
                "h-8 px-3 text-xs",
                filter === key && "bg-teal-700 hover:bg-teal-800"
              )}
              onClick={() => handleFilterChange(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-slate-500">กำลังโหลดเฉลย...</p>
      ) : questions.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          ยังไม่มีข้อมูลเฉลยสำหรับชุดข้อสอบนี้
        </p>
      ) : (
        <QuestionReviewCompactList
          questions={filteredQuestions}
          openQuestionNo={openQuestionNo}
          onToggleQuestion={handleToggleQuestion}
        />
      )}
    </section>
  );
}
