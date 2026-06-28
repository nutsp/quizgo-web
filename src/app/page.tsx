"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, BarChart3, BookOpen, Loader2 } from "lucide-react";
import { ExamSetCard } from "@/components/exam/ExamSetCard";
import { StartExamModal } from "@/components/exam/StartExamModal";
import { HeroExamPreview } from "@/components/home/HeroExamPreview";
import { ProgressCard } from "@/components/ProgressCard";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/brand";
import { useAuth } from "@/hooks/useAuth";
import { getHome } from "@/lib/api/endpoints";
import { mapExamSetItemToExamSet } from "@/lib/api/mappers";
import type { ExamSet } from "@/lib/exam/format";
import type { HomeResponse } from "@/lib/api/types";

export default function HomePage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [home, setHome] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [startExamSet, setStartExamSet] = useState<ExamSet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await getHome(isAuthenticated);
        if (!cancelled) setHome(data);
      } catch {
        if (!cancelled) setHome(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated]);

  const popularExamSets =
    home?.popular_exam_sets.map((item) => ({
      ...mapExamSetItemToExamSet(item),
      is_popular: true,
    })) ?? [];
  const progress = home?.my_progress_summary;
  const continueExam = home?.continue_attempt;
  const featuredSet = popularExamSets[0];

  const displayName = user?.display_name?.trim();
  const heroTitle = displayName
    ? `ยินดีต้อนรับ, ${displayName}`
    : "ยินดีต้อนรับสู่ QuizGo";

  const handleStart = (examSet: ExamSet) => {
    setStartExamSet(examSet);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-medium text-teal-700">
            <BookOpen className="h-3.5 w-3.5" />
            {BRAND.tagline}
          </div>
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            {heroTitle}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted md:text-lg">
            {BRAND.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {featuredSet ? (
              <Button size="lg" onClick={() => handleStart(featuredSet)}>
                ทำข้อสอบ
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/exams/gpor-set-1">ทำข้อสอบ</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link href="/exams">ดูคลังข้อสอบ</Link>
            </Button>
          </div>
          {/* <div className="mt-6 flex flex-wrap gap-2">
            {heroSteps.map((step, index) => (
              <div
                key={step}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[11px] font-bold text-teal-700">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div> */}
        </div>
        <HeroExamPreview />
      </section>

      {continueExam && (
        <section className="mt-10">
          <ProgressCard
            title={continueExam.exam_set_title}
            completed={continueExam.answered_count}
            total={continueExam.total_questions}
            remainingMinutes={Math.ceil(continueExam.remaining_seconds / 60)}
            href={`/exams/${continueExam.exam_set_code}/take?attempt_id=${continueExam.attempt_id}`}
          />
        </section>
      )}

      {progress && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-foreground">สรุปความก้าวหน้า</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="คะแนนเฉลี่ย"
              value={`${Math.round(progress.average_score_percent)}%`}
              icon={BarChart3}
            />
            <StatCard
              label="ทำข้อสอบแล้ว"
              value={`${progress.completed_attempts} ชุด`}
              icon={BookOpen}
              iconColor="text-secondary"
            />
            <StatCard
              label="จุดอ่อนล่าสุด"
              value={progress.latest_weak_subject}
              icon={AlertTriangle}
              iconColor="text-warning"
            />
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">ข้อสอบจำลองยอดนิยม</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/exams">ดูทั้งหมด</Link>
          </Button>
        </div>
        {loading || authLoading ? (
          <div className="flex justify-center py-12 text-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularExamSets.map((examSet) => (
              <ExamSetCard key={examSet.code} examSet={examSet} />
            ))}
          </div>
        )}
      </section>

      <StartExamModal
        examSet={startExamSet}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
