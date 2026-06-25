"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, BarChart3, BookOpen } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { ExamCard } from "@/components/ExamCard";
import { MiniAnswerSheetPreview } from "@/components/MiniAnswerSheetPreview";
import { ProgressCard } from "@/components/ProgressCard";
import { SearchBar } from "@/components/SearchBar";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { popularExams, quickFilters } from "@/data/exams";
import { userProgress } from "@/data/userProgress";

export default function HomePage() {
  const [activeChip, setActiveChip] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-8 lg:py-12">
      {/* Hero Section */}
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            แพลตฟอร์มฝึกสอบราชการอันดับ 1
          </div>
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            จำลองสอบเสมียน
            <br />
            <span className="text-primary">เหมือนสนามจริง</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted md:text-lg">
            ฝนคำตอบ จับเวลา ตรวจคะแนน และวิเคราะห์จุดอ่อน เพื่อเตรียมพร้อมก่อนสอบจริง
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/exams/demo/take">เริ่มทำข้อสอบฟรี</Link>
            </Button>
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

      {/* Search Bar */}
      <section>
        <SearchBar
          placeholder="ค้นหาข้อสอบ เช่น เสมียน, งานสารบรรณ, ภาค ก"
          chips={quickFilters}
          activeChip={activeChip}
          onChipClick={(chip) => setActiveChip(activeChip === chip ? null : chip)}
        />
      </section>

      {/* Continue Progress */}
      <section>
        <ProgressCard
          title={userProgress.continueExam.title}
          completed={userProgress.continueExam.completed}
          total={userProgress.continueExam.total}
          remainingMinutes={userProgress.continueExam.remainingMinutes}
          href={`/exams/${userProgress.continueExam.slug}/take`}
        />
      </section>

      {/* My Progress Summary */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">สรุปความก้าวหน้า</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="คะแนนเฉลี่ย"
            value={`${userProgress.stats.averageScore}%`}
            icon={BarChart3}
          />
          <StatCard
            label="ทำข้อสอบแล้ว"
            value={`${userProgress.stats.completedSets} ชุด`}
            icon={BookOpen}
            iconColor="text-secondary"
          />
          <StatCard
            label="จุดอ่อนล่าสุด"
            value={userProgress.stats.latestWeakness}
            icon={AlertTriangle}
            iconColor="text-warning"
          />
        </div>
      </section>

      {/* Recommended Courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">คอร์สแนะนำ</h2>
          <Button variant="ghost" size="sm">
            ดูทั้งหมด
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Popular Mock Exams */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">ข้อสอบจำลองยอดนิยม</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/exams">ดูทั้งหมด</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
