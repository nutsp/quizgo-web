import Link from "next/link";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ExamSetCurrentUserRank, ExamTrackCurrentUserRank } from "@/lib/api/types";
import { formatDuration, formatPercent } from "@/lib/format";

type ExamSetRankProps = {
  variant: "exam-set";
  rank?: ExamSetCurrentUserRank | null;
  startHref: string;
};

type ExamTrackRankProps = {
  variant: "exam-track";
  rank?: ExamTrackCurrentUserRank | null;
  startHref: string;
};

type CurrentUserRankCardProps = ExamSetRankProps | ExamTrackRankProps;

export function CurrentUserRankCard(props: CurrentUserRankCardProps) {
  const { rank, startHref } = props;

  if (!rank) {
    return (
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">อันดับของคุณ</p>
            <p className="mt-1 font-semibold text-foreground">คุณยังไม่มีอันดับ</p>
            <p className="mt-1 text-sm text-muted">เริ่มทำข้อสอบเพื่อเข้าสู่กระดานอันดับ</p>
          </div>
          <Button asChild>
            <Link href={startHref}>เริ่มทำข้อสอบ</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (props.variant === "exam-set") {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">อันดับของคุณ</p>
              <p className="text-lg font-bold text-foreground">อันดับที่ {rank.rank}</p>
              <p className="text-sm text-muted">
                คะแนน {formatPercent(rank.score_percent)} · เวลาที่ใช้{" "}
                {formatDuration(rank.duration_seconds)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">อันดับของคุณ</p>
            <p className="text-lg font-bold text-foreground">อันดับที่ {rank.rank}</p>
            <p className="text-sm text-muted">
              คะแนนเฉลี่ย {formatPercent(rank.average_score_percent)} · ทำแล้ว{" "}
              {rank.completed_exam_sets} ชุด · อัตราผ่าน {formatPercent(rank.pass_rate_percent)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
