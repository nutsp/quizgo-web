import { Suspense } from "react";
import { ExamResultView } from "@/components/ExamResultView";

interface PageProps {
  params: { examSetCode: string };
}

export default function ExamResultPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-muted">กำลังโหลด...</div>}>
      <ExamResultView examSetCode={params.examSetCode} />
    </Suspense>
  );
}
