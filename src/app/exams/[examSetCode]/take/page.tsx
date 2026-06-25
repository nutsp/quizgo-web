import { ExamTakingView } from "@/components/ExamTakingView";

interface PageProps {
  params: { examSetCode: string };
  searchParams: { attemptId?: string; attempt_id?: string };
}

export default function ExamTakePage({ params, searchParams }: PageProps) {
  const attemptId = searchParams.attempt_id ?? searchParams.attemptId;

  return (
    <ExamTakingView
      examSetCode={params.examSetCode}
      attemptId={attemptId}
    />
  );
}
