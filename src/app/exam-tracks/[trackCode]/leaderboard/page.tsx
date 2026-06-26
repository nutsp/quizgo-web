import { ExamTrackLeaderboardPage } from "@/components/leaderboard/ExamTrackLeaderboardView";

interface PageProps {
  params: { trackCode: string };
}

export default function ExamTrackLeaderboardRoute({ params }: PageProps) {
  return <ExamTrackLeaderboardPage trackCode={params.trackCode} />;
}
