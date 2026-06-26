"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileQuestion,
  Loader2,
  Shield,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { StartExamModal } from "@/components/exam/StartExamModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getExamSet } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api";
import { mapExamSetItemToExamSet } from "@/lib/api/mappers";
import {
  ACCESS_LABELS,
  DIFFICULTY_LABELS,
  formatExamPrice,
  MODE_LABELS,
  type ExamSet,
} from "@/lib/exam/format";

const FEATURES = [
  "จำลองสนามสอบเสมือนจริง",
  "กระดาษคำตอบแบบฝน",
  "ระบบจับเวลา",
  "ตรวจคะแนนอัตโนมัติ",
  "ดูผลสอบและเฉลยหลังส่งคำตอบ",
  "วิเคราะห์จุดอ่อนหลังสอบ",
];

const PRE_EXAM_TIPS = [
  "อ่านโจทย์ให้ครบก่อนเลือกคำตอบ",
  "กดค้างที่วงกลมเพื่อฝนคำตอบ",
  "ระบบจะบันทึกคำตอบอัตโนมัติ",
  "สามารถเปลี่ยนคำตอบได้ก่อนส่ง",
  "เมื่อส่งคำตอบแล้วจะไม่สามารถแก้ไขได้",
  "หากเวลาหมด ระบบจะส่งคำตอบให้อัตโนมัติ",
];

interface PageProps {
  params: { examSetCode: string };
}

function MetadataCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="font-semibold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ExamDetailContent({ examSet }: { examSet: ExamSet }) {
  const [modalOpen, setModalOpen] = useState(false);
  const price = formatExamPrice(examSet);
  const trackName = examSet.exam_track?.name ?? "สนามสอบเสมือนจริง";

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 pb-28 lg:px-8 lg:pb-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            กลับไปคลังข้อสอบ
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <ExamCoverImage
              src={examSet.cover_image_url}
              alt={examSet.title}
              className="aspect-video rounded-2xl shadow-card"
              iconClassName="h-16 w-16"
              priority
            />

            <div className="space-y-4 lg:hidden">
              <div className="flex flex-wrap gap-2">
                <Badge variant={examSet.access_type === "free" ? "free" : "premium"}>
                  {ACCESS_LABELS[examSet.access_type]}
                </Badge>
                {examSet.is_official && <Badge variant="secondary">Official</Badge>}
              </div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{examSet.title}</h1>
              <p className="text-sm font-medium text-primary">{trackName}</p>
              <p className="text-muted leading-relaxed">{examSet.description}</p>
              <div>
                <p className="text-2xl font-bold text-foreground">{price.primary}</p>
                {price.secondary && <p className="text-sm text-muted">{price.secondary}</p>}
              </div>
              <Button size="lg" className="w-full" onClick={() => setModalOpen(true)}>
                เริ่มทำข้อสอบ
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href={`/exams/${examSet.code}/leaderboard`}>
                  <Trophy className="h-4 w-4" />
                  ดูกระดานอันดับ
                </Link>
              </Button>
            </div>

            <div className="hidden space-y-4 lg:block">
              <div className="flex flex-wrap gap-2">
                <Badge variant={examSet.access_type === "free" ? "free" : "premium"}>
                  {ACCESS_LABELS[examSet.access_type]}
                </Badge>
                {examSet.is_official && <Badge variant="secondary">Official</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-foreground">{examSet.title}</h1>
              <p className="text-sm font-medium text-primary">{trackName}</p>
              <p className="text-muted leading-relaxed">{examSet.description}</p>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{price.primary}</p>
                  {price.secondary && <p className="text-sm text-muted">{price.secondary}</p>}
                </div>
                <Button size="lg" onClick={() => setModalOpen(true)}>
                  เริ่มทำข้อสอบ
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/exams/${examSet.code}/leaderboard`}>
                    <Trophy className="h-4 w-4" />
                    ดูกระดานอันดับ
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-card">
              <h2 className="text-lg font-bold text-foreground">สรุปชุดข้อสอบ</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">ราคา</span>
                  <span className="font-semibold">{price.primary}</span>
                </div>
                {price.secondary && (
                  <p className="text-right text-xs text-muted">{price.secondary}</p>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">เวลาสอบ</span>
                  <span className="font-semibold">{examSet.duration_minutes} นาที</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">จำนวนข้อ</span>
                  <span className="font-semibold">{examSet.total_questions} ข้อ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">คะแนนผ่าน</span>
                  <span className="font-semibold">{examSet.passing_score}%</span>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={() => setModalOpen(true)}>
                เริ่มทำข้อสอบ
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href={`/exams/${examSet.code}/leaderboard`}>
                  <Trophy className="h-4 w-4" />
                  ดูกระดานอันดับ
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-foreground">รายละเอียดชุดข้อสอบ</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetadataCard icon={FileQuestion} label="จำนวนข้อ" value={`${examSet.total_questions} ข้อ`} />
            <MetadataCard icon={Clock} label="เวลาสอบ" value={`${examSet.duration_minutes} นาที`} />
            <MetadataCard icon={Target} label="คะแนนผ่าน" value={`${examSet.passing_score}%`} />
            <MetadataCard
              icon={TrendingUp}
              label="ระดับความยาก"
              value={DIFFICULTY_LABELS[examSet.difficulty]}
            />
            <MetadataCard icon={BookOpen} label="รูปแบบ" value={MODE_LABELS[examSet.mode]} />
            <MetadataCard
              icon={Shield}
              label="ประเภท"
              value={ACCESS_LABELS[examSet.access_type]}
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-foreground">สิ่งที่คุณจะได้ฝึกในชุดนี้</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-foreground">คำแนะนำก่อนเริ่มสอบ</h2>
          <ul className="space-y-2 rounded-2xl border border-border bg-surface p-5">
            {PRE_EXAM_TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur-md lg:hidden">
        <Button size="lg" className="w-full" onClick={() => setModalOpen(true)}>
          เริ่มทำข้อสอบ
        </Button>
      </div>

      <StartExamModal examSet={examSet} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

export default function ExamSetDetailPage({ params }: PageProps) {
  const [examSet, setExamSet] = useState<ExamSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await getExamSet(params.examSetCode);
        if (!cancelled) setExamSet(mapExamSetItemToExamSet(data));
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError && e.status === 404) {
            setNotFound(true);
          } else {
            setError(e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ");
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
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">ไม่พบชุดข้อสอบนี้</p>
        <Button asChild className="mt-4">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  if (error || !examSet) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-danger">{error ?? "โหลดข้อมูลไม่สำเร็จ"}</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/exams">กลับไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  return <ExamDetailContent examSet={examSet} />;
}
