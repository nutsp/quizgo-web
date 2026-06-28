import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReviewQuestion } from "@/lib/api/types";
import { getQuestionStatus } from "@/lib/results/transforms";

export function QuestionReviewStatusBadge({ question }: { question: ReviewQuestion }) {
  const status = getQuestionStatus(question);

  if (status === "correct") {
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="h-3 w-3" /> ถูก
      </Badge>
    );
  }
  if (status === "wrong") {
    return (
      <Badge variant="danger" className="gap-1">
        <XCircle className="h-3 w-3" /> ผิด
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 border-amber-300 text-amber-600">
      <MinusCircle className="h-3 w-3" /> ไม่ตอบ
    </Badge>
  );
}
