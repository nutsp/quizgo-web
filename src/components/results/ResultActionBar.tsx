"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Target, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

interface ResultActionBarProps {
  examSetCode: string;
  onViewWrongOnly?: () => void;
  showLeaderboardLink?: boolean;
}

export function ResultActionBar({
  examSetCode,
  onViewWrongOnly,
  showLeaderboardLink = false,
}: ResultActionBarProps) {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" className="h-8 bg-teal-700 hover:bg-teal-800">
        <Link href={`/exams/${examSetCode}`}>
          <RotateCcw className="h-3.5 w-3.5" />
          ทำข้อสอบอีกครั้ง
        </Link>
      </Button>

      <Button type="button" size="sm" variant="outline" className="h-8" onClick={onViewWrongOnly}>
        <XCircle className="h-3.5 w-3.5" />
        ดูเฉพาะข้อผิด
      </Button>

      <Button asChild size="sm" variant="outline" className="h-8">
        <Link href="/exams">
          <ArrowLeft className="h-3.5 w-3.5" />
          กลับคลังข้อสอบ
        </Link>
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8"
        disabled
        title="เร็ว ๆ นี้"
        onClick={() => showToast("ฟีเจอร์นี้เร็ว ๆ นี้", "success")}
      >
        <Target className="h-3.5 w-3.5" />
        ฝึกข้อที่ผิด
        <span className="text-[10px] text-slate-400">(เร็ว ๆ นี้)</span>
      </Button>

      {showLeaderboardLink && (
        <Button asChild size="sm" variant="outline" className="h-8">
          <Link href={`/exams/${examSetCode}/leaderboard`}>ดูอันดับของฉัน</Link>
        </Button>
      )}
    </div>
  );
}
