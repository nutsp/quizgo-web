import { AuthGuard } from "@/components/auth/AuthGuard";
import { ExamTakingView } from "@/components/ExamTakingView";

interface PageProps {
  searchParams: { attemptId?: string; attempt_id?: string };
}

export default function DemoTakePage({ searchParams }: PageProps) {
  const attemptId = searchParams.attempt_id ?? searchParams.attemptId;

  return (
    <AuthGuard>
      <ExamTakingView
        examSetCode="gpor-set-1"
        routeSlug="demo"
        attemptId={attemptId}
      />
    </AuthGuard>
  );
}
