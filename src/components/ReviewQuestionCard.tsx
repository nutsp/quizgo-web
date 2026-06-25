import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChoiceKey } from "@/data/questions";
import { cn } from "@/lib/utils";

interface ReviewQuestionCardProps {
  questionNumber: number;
  questionText: string;
  yourAnswer: ChoiceKey;
  correctAnswer: ChoiceKey;
  explanation: string;
  isCorrect: boolean;
}

export function ReviewQuestionCard({
  questionNumber,
  questionText,
  yourAnswer,
  correctAnswer,
  explanation,
  isCorrect,
}: ReviewQuestionCardProps) {
  return (
    <Card className={cn(isCorrect ? "border-success/30" : "border-danger/30")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted">ข้อ {questionNumber}</span>
          <Badge variant={isCorrect ? "success" : "danger"}>
            {isCorrect ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> ถูก
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3" /> ผิด
              </span>
            )}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed text-foreground">{questionText}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-4">
          <p>
            <span className="text-muted">คำตอบของคุณ: </span>
            <span className={cn("font-semibold", isCorrect ? "text-success" : "text-danger")}>
              {yourAnswer}
            </span>
          </p>
          {!isCorrect && (
            <p>
              <span className="text-muted">เฉลย: </span>
              <span className="font-semibold text-success">{correctAnswer}</span>
            </p>
          )}
        </div>
        <div className="rounded-xl bg-background p-3">
          <p className="text-xs font-medium text-muted">คำอธิบาย</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
