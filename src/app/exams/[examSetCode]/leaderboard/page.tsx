import { ExamSetLeaderboardPage } from "@/components/leaderboard/ExamSetLeaderboardView";

interface PageProps {
  params: { examSetCode: string };
}

export default function ExamSetLeaderboardRoute({ params }: PageProps) {
  return <ExamSetLeaderboardPage examSetCode={params.examSetCode} />;
}
