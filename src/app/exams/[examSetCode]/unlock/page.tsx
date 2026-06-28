"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ExamUnlockContent } from "@/components/exam/ExamUnlockContent";
import { Button } from "@/components/ui/button";
import { getExamSet } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api";
import { mapExamSetItemToExamSet } from "@/lib/api/mappers";
import type { ExamSet } from "@/lib/exam/format";

interface PageProps {
  params: { examSetCode: string };
}

export default function ExamUnlockPage({ params }: PageProps) {
  const [examSet, setExamSet] = useState<ExamSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getExamSet(params.examSetCode);
        if (!cancelled) setExamSet(mapExamSetItemToExamSet(data));
      } catch (e) {
        if (!cancelled && e instanceof ApiError && e.status === 404) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params.examSetCode]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !examSet) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold">ไม่พบชุดข้อสอบนี้</p>
        <Button asChild className="mt-4"><Link href="/exams">กลับไปคลังข้อสอบ</Link></Button>
      </div>
    );
  }

  return <ExamUnlockContent examSet={examSet} />;
}
