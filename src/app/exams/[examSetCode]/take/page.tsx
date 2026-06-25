import { ExamTakingView } from "@/components/ExamTakingView";

interface PageProps {
  params: { examSetCode: string };
  searchParams: { attemptId?: string };
}

export default function ExamTakePage({ params, searchParams }: PageProps) {
  return (
    <ExamTakingView
      examSetCode={params.examSetCode}
      attemptId={searchParams.attemptId}
    />
  );
}
