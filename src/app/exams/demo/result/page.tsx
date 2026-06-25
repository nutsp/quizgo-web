import Link from "next/link";
import { RotateCcw, BookOpen, FileText, ArrowLeft } from "lucide-react";
import { ResultSummaryCard } from "@/components/ResultSummaryCard";
import { ReviewQuestionCard } from "@/components/ReviewQuestionCard";
import { SubjectBreakdown } from "@/components/SubjectBreakdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviewQuestions } from "@/data/questions";
import { weaknessAnalysis } from "@/data/resultSummary";

export default function ExamResultPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ผลการสอบ</h1>
        <p className="mt-1 text-muted">Mock Exam เสมียน ชุด A</p>
      </div>

      <ResultSummaryCard />

      <SubjectBreakdown />

      {/* Weakness Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">จุดที่ควรฝึกเพิ่ม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weaknessAnalysis.map((item, index) => (
            <div
              key={item.subject}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-sm font-bold text-warning">
                  {index + 1}
                </span>
                <span className="font-medium text-foreground">{item.subject}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.actions.map((action) => (
                  <Button key={action} variant="outline" size="sm">
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Review Section */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">ตรวจทานข้อสอบ</h2>
        <div className="space-y-4">
          {reviewQuestions.map((q) => (
            <ReviewQuestionCard
              key={q.id}
              questionNumber={q.id}
              questionText={q.text}
              yourAnswer={q.yourAnswer}
              correctAnswer={q.correctAnswer}
              explanation={q.explanation}
              isCorrect={q.isCorrect}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" className="w-full">
          <FileText className="h-4 w-4" />
          ดูเฉลยทั้งหมด
        </Button>
        <Button variant="secondary" className="w-full">
          <BookOpen className="h-4 w-4" />
          ฝึกเฉพาะข้อที่ผิด
        </Button>
        <Button asChild className="w-full">
          <Link href="/exams/demo/take">
            <RotateCcw className="h-4 w-4" />
            สอบใหม่อีกครั้ง
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            กลับคลังข้อสอบ
          </Link>
        </Button>
      </div>
    </div>
  );
}
