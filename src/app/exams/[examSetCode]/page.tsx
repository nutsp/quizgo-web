"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ExamAccessCard } from "@/components/exams/ExamAccessCard";
import { ExamDetailHero } from "@/components/exams/ExamDetailHero";
import { ExamInfo } from "@/components/exams/ExamInfo";
import { ExamOverview } from "@/components/exams/ExamOverview";
import { WhatYouGet } from "@/components/exams/WhatYouGet";
import { StartExamModal } from "@/components/exam/StartExamModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getExamAccessCTA } from "@/lib/exam/access";
import { getExamSet } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api";
import { mapExamSetItemToExamSet } from "@/lib/api/mappers";
import type { ExamSet } from "@/lib/exam/format";

interface PageProps {
  params: { examSetCode: string };
}

function ExamDetailContent({ examSet }: { examSet: ExamSet }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const cta = getExamAccessCTA(examSet, isAuthenticated);

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            กลับไปคลังข้อสอบ
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <section className="space-y-8">
            <ExamDetailHero examSet={examSet} />

            <div className="lg:hidden">
              <ExamAccessCard examSet={examSet} onStartExam={() => setModalOpen(true)} compact />
            </div>

            <ExamOverview examSet={examSet} />
            <ExamInfo examSet={examSet} />
            <WhatYouGet examSet={examSet} />
          </section>

          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <ExamAccessCard examSet={examSet} onStartExam={() => setModalOpen(true)} />
          </aside>
        </div>
      </main>

      {cta.canStart && examSet.access?.reason !== "EXAM_NOT_AVAILABLE" && (
        <StartExamModal examSet={examSet} open={modalOpen} onOpenChange={setModalOpen} />
      )}
    </>
  );
}

export default function ExamSetDetailPage({ params }: PageProps) {
  const [examSet, setExamSet] = useState<ExamSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setAccessDenied(false);
      try {
        const data = await getExamSet(params.examSetCode);
        if (!cancelled) setExamSet(mapExamSetItemToExamSet(data));
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError && e.code === "PRIVATE_EXAM_ACCESS_REQUIRED") {
            setAccessDenied(true);
          } else if (e instanceof ApiError && e.status === 404) {
            setNotFound(true);
          } else {
            setError(
              e instanceof Error
                ? e.message
                : "ไม่สามารถโหลดรายละเอียดชุดข้อสอบได้ กรุณาลองใหม่อีกครั้ง"
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params.examSetCode]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
        <p className="text-sm">กำลังโหลดรายละเอียดชุดข้อสอบ...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">ไม่สามารถเข้าถึงชุดข้อสอบนี้ได้</p>
        <p className="mt-2 text-muted">ชุดข้อสอบนี้เปิดให้เฉพาะผู้ได้รับสิทธิ์เท่านั้น</p>
        <Button asChild className="mt-4">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">ไม่พบชุดข้อสอบนี้</p>
        <Button asChild className="mt-4">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  if (error || !examSet) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-600">
          {error ?? "ไม่สามารถโหลดรายละเอียดชุดข้อสอบได้ กรุณาลองใหม่อีกครั้ง"}
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  return <ExamDetailContent examSet={examSet} />;
}
