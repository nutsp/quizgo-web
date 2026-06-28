"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, BarChart3, BookOpen, Loader2 } from "lucide-react";
import { ExamSetCard } from "@/components/exam/ExamSetCard";
import { StartExamModal } from "@/components/exam/StartExamModal";
import { MiniAnswerSheetPreview } from "@/components/MiniAnswerSheetPreview";
import { ProgressCard } from "@/components/ProgressCard";
import { SearchBar } from "@/components/SearchBar";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/brand";
import { quickFilters } from "@/data/exams";
import { useAuth } from "@/hooks/useAuth";
import { getHome } from "@/lib/api/endpoints";
import { mapExamSetItemToExamSet } from "@/lib/api/mappers";
import type { ExamSet } from "@/lib/exam/format";
import type { HomeResponse } from "@/lib/api/types";

export default function HomePage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [activeChip, setActiveChip] = useState<string | null>(null);
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

  const heroTitle = isAuthenticated && user
    ? `ยินดีต้อนรับ, ${user.display_name}`
    : "ซ้อมสอบให้พร้อมกับควิซโก";

  const heroSubtitle = isAuthenticated && user
    ? BRAND.description
    : "ซ้อมสอบเสมือนจริงด้วยตัวจับเวลา กระดาษคำตอบ OMR ตรวจผลทันที และวิเคราะห์จุดอ่อนเพื่อพัฒนาคะแนนของคุณ";

  const handleStart = (examSet: ExamSet) => {
    setStartExamSet(examSet);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-8 lg:py-12">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            {BRAND.tagline}
          </div>
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            {heroTitle}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted md:text-lg">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            {featuredSet ? (
              <Button size="lg" onClick={() => handleStart(featuredSet)}>
                เริ่มซ้อมสอบ
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/exams/gpor-set-1">เริ่มซ้อมสอบ</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link href="/exams">ดูคลังข้อสอบ</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
          <MiniAnswerSheetPreview />
        </div>
      </section>

      <section>
        <SearchBar
          placeholder="ค้นหาข้อสอบ เช่น เสมือนจริง, งานสารบรรณ, ภาค ก"
          chips={quickFilters}
          activeChip={activeChip}
          onChipClick={(chip) => setActiveChip(activeChip === chip ? null : chip)}
        />
      </section>

      {continueExam && (
        <section>
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
        <section>
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

      <section>
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
