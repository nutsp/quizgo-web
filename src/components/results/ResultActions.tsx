"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, RotateCcw, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

interface ResultActionsProps {
  examSetCode: string;
  onScrollToReview: () => void;
  showLeaderboardLink?: boolean;
}

export function ResultActions({
  examSetCode,
  onScrollToReview,
  showLeaderboardLink = true,
}: ResultActionsProps) {
  const { showToast } = useToast();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button" variant="outline" className="w-full" onClick={onScrollToReview}>
        <BookOpen className="h-4 w-4" />
        ดูเฉลยทั้งหมด
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => showToast("ฟีเจอร์นี้กำลังจะมา", "success")}
      >
        <Target className="h-4 w-4" />
        ฝึกเฉพาะข้อที่ผิด
      </Button>
      <Button asChild className="w-full">
        <Link href={`/exams/${examSetCode}`}>
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
      {showLeaderboardLink && (
        <Button asChild variant="outline" className="w-full sm:col-span-2">
          <Link href={`/exams/${examSetCode}/leaderboard`}>
            <Trophy className="h-4 w-4" />
            ดูอันดับของฉัน
          </Link>
        </Button>
      )}
    </div>
  );
}
