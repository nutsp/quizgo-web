"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ReviewQuestion } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type ReviewFilter = "all" | "correct" | "wrong" | "unanswered";

const FILTERS: { key: ReviewFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "correct", label: "ตอบถูก" },
  { key: "wrong", label: "ตอบผิด" },
  { key: "unanswered", label: "ไม่ตอบ" },
];

function matchesFilter(question: ReviewQuestion, filter: ReviewFilter): boolean {
  if (filter === "all") return true;
  if (filter === "correct") return question.is_correct;
  if (filter === "wrong") return !question.is_unanswered && !question.is_correct;
  return question.is_unanswered;
}

function getStatusBadge(question: ReviewQuestion) {
  if (question.is_unanswered) {
    return (
      <Badge variant="outline" className="border-warning text-warning">
        <MinusCircle className="h-3 w-3" /> ไม่ตอบ
      </Badge>
    );
  }
  if (question.is_correct) {
    return (
      <Badge variant="success">
        <CheckCircle2 className="h-3 w-3" /> ถูก
      </Badge>
    );
  }
  return (
    <Badge variant="danger">
      <XCircle className="h-3 w-3" /> ผิด
    </Badge>
  );
}

function getChoiceLabel(choice: ReviewQuestion["choices"][number]) {
  if (choice.is_correct && choice.is_selected) {
    return "คำตอบของคุณ / คำตอบที่ถูก";
  }
  if (choice.is_correct) {
    return "คำตอบที่ถูก";
  }
  if (choice.is_selected) {
    return "คำตอบของคุณ";
  }
  return null;
}

function getSelectedLabel(question: ReviewQuestion): string {
  if (question.is_unanswered) return "ไม่ได้ตอบ";
  const selected = question.choices.find((c) => c.is_selected);
  if (!selected) return "-";
  return `${selected.choice_label}. ${selected.choice_text}`;
}

function getCorrectLabel(question: ReviewQuestion): string {
  const correct = question.choices.find((c) => c.is_correct);
  if (!correct) return "-";
  return `${correct.choice_label}. ${correct.choice_text}`;
}

interface QuestionReviewCardProps {
  question: ReviewQuestion;
}

function QuestionReviewCard({ question }: QuestionReviewCardProps) {
  return (
    <Card
      id={`question-${question.question_no}`}
      className={cn(
        "scroll-mt-24",
        question.is_correct && "border-success/30",
        !question.is_unanswered && !question.is_correct && "border-danger/30",
        question.is_unanswered && "border-warning/30"
      )}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              ข้อที่ {question.question_no}
            </span>
            {question.subject && (
              <Badge variant="outline" className="font-normal">
                {question.subject}
              </Badge>
            )}
            {(question.tags ?? []).map((tag) => (
              <Badge key={tag.code} variant="secondary" className="bg-slate-100 font-normal text-slate-700">
                {tag.name}
              </Badge>
            ))}
          </div>
          {getStatusBadge(question)}
        </div>
        <p className="text-sm leading-relaxed text-foreground">{question.question_text}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {question.choices.map((choice) => {
            const tag = getChoiceLabel(choice);
            const isHighlighted = choice.is_selected || choice.is_correct;
            return (
              <div
                key={choice.choice_key}
                className={cn(
                  "rounded-xl border p-3 text-sm",
                  choice.is_correct && "border-success/40 bg-success/5",
                  choice.is_selected && !choice.is_correct && "border-danger/40 bg-danger/5",
                  !isHighlighted && "border-border bg-background"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="leading-relaxed text-foreground">
                    <span className="font-semibold">{choice.choice_label}.</span>{" "}
                    {choice.choice_text}
                  </p>
                  {tag && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        choice.is_correct && "bg-success/10 text-success",
                        choice.is_selected && !choice.is_correct && "bg-danger/10 text-danger"
                      )}
                    >
                      {tag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-2 rounded-xl bg-background p-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted">คำตอบของคุณ: </span>
            <span
              className={cn(
                "font-semibold",
                question.is_unanswered && "text-warning",
                question.is_correct && "text-success",
                !question.is_unanswered && !question.is_correct && "text-danger"
              )}
            >
              {getSelectedLabel(question)}
            </span>
          </p>
          <p>
            <span className="text-muted">คำตอบที่ถูก: </span>
            <span className="font-semibold text-success">{getCorrectLabel(question)}</span>
          </p>
        </div>

        {question.explanation && (
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-xs font-medium text-muted">คำอธิบาย</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface QuestionReviewListProps {
  questions: ReviewQuestion[];
  loading?: boolean;
}

export function QuestionReviewList({ questions, loading }: QuestionReviewListProps) {
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const filteredQuestions = useMemo(
    () => questions.filter((q) => matchesFilter(q, filter)),
    [questions, filter]
  );

  return (
    <section id="review" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">เฉลยข้อสอบ</h2>
        <p className="mt-1 text-sm text-muted">
          ตรวจสอบคำตอบของคุณเทียบกับเฉลยและอ่านคำอธิบายรายข้อ
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="py-8 text-center text-muted">กำลังโหลดเฉลย...</p>
      ) : filteredQuestions.length === 0 ? (
        <p className="py-8 text-center text-muted">ไม่พบข้อมูลเฉลย</p>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <QuestionReviewCard key={question.question_no} question={question} />
          ))}
        </div>
      )}
    </section>
  );
}
