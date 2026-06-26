"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  FileQuestion,
  Loader2,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { ExamSetPublishDialog } from "@/components/admin/exam-sets/ExamSetPublishDialog";
import { ExamSetReadinessPanel } from "@/components/admin/exam-sets/ExamSetReadinessPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ExamCoverImage } from "@/components/exam/ExamCoverImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import {
  adminExamSetsApi,
  type AdminExamSet,
  type ExamSetPreview,
  type ExamSetReadiness,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";
import {
  ACCESS_LABELS,
  DIFFICULTY_LABELS,
  MODE_LABELS,
  formatExamPrice,
  type ExamSet,
} from "@/lib/exam/format";

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

export default function ExamSetPreviewPage({ params }: { params: { id: string } }) {
  const { showToast } = useToast();
  const [preview, setPreview] = useState<ExamSetPreview | null>(null);
  const [adminSet, setAdminSet] = useState<AdminExamSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, set] = await Promise.all([
        adminExamSetsApi.getPreview(params.id),
        adminExamSetsApi.get(params.id),
      ]);
      setPreview(data);
      setAdminSet(set);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setLoading(false);
    }
  }, [params.id, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublishClick = (readiness: ExamSetReadiness) => {
    if (!readiness.ready) {
      showToast("ชุดข้อสอบยังไม่พร้อมเผยแพร่", "error");
      return;
    }
    setPublishOpen(true);
  };

  const handlePublishConfirm = async () => {
    setPublishing(true);
    try {
      await adminExamSetsApi.publish(params.id);
      showToast("เผยแพร่ชุดข้อสอบสำเร็จ");
      setPublishOpen(false);
      load();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!preview) {
    return <p className="text-muted">ไม่พบข้อมูล</p>;
  }

  const examSet = preview.exam_set;
  const examForPrice: ExamSet = {
    code: examSet.code,
    title: examSet.title,
    description: examSet.description ?? "",
    cover_image_url: examSet.cover_image_url ?? undefined,
    duration_minutes: examSet.duration_minutes,
    total_questions: examSet.total_questions,
    passing_score: examSet.passing_score,
    difficulty: examSet.difficulty as ExamSet["difficulty"],
    access_type: examSet.access_type as ExamSet["access_type"],
    price_amount: examSet.price_amount,
    sale_price_amount: examSet.sale_price_amount ?? undefined,
    currency: examSet.currency,
    mode: examSet.mode as ExamSet["mode"],
    is_official: examSet.is_official,
    is_featured: examSet.is_featured,
    exam_track: examSet.exam_track,
  };
  const price = formatExamPrice(examForPrice);
  const trackName = examSet.exam_track?.name ?? "สนามสอบเสมือนจริง";

  return (
    <div>
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-semibold">โหมด Preview สำหรับผู้ดูแล</p>
        <p className="mt-0.5 text-amber-800">
          หน้านี้เป็นตัวอย่างการแสดงผลชุดข้อสอบก่อนเผยแพร่
        </p>
      </div>

      <AdminPageHeader
        title={`Preview: ${examSet.title}`}
        description="ตัวอย่างหน้ารายละเอียดชุดข้อสอบสำหรับผู้ใช้งาน"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/exam-sets/${params.id}/edit`}>กลับไปแก้ไข</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/exam-sets/${params.id}/questions`}>จัดคำถาม</Link>
        </Button>
        {examSet.status !== "published" && preview.readiness.ready && (
          <Button size="sm" onClick={() => setPublishOpen(true)}>
            เผยแพร่
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <ExamCoverImage
            src={examSet.cover_image_url}
            alt={examSet.title}
            className="aspect-video rounded-2xl shadow-card"
            iconClassName="h-16 w-16"
          />

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={examSet.access_type === "free" ? "free" : "premium"}>
                {ACCESS_LABELS[examSet.access_type as "free" | "premium"]}
              </Badge>
              {examSet.is_official && <Badge variant="secondary">Official</Badge>}
              <AdminStatusBadge status={examSet.status ?? "draft"} />
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{examSet.title}</h1>
            <p className="text-sm font-medium text-primary">{trackName}</p>
            <p className="text-muted leading-relaxed">{examSet.description}</p>
            <div>
              <p className="text-2xl font-bold text-foreground">{price.primary}</p>
              {price.secondary && <p className="text-sm text-muted">{price.secondary}</p>}
            </div>
            <Button size="lg" className="w-full sm:w-auto" disabled>
              ตัวอย่างปุ่มเริ่มทำข้อสอบ
            </Button>
          </div>

          <section>
            <h2 className="mb-4 text-lg font-bold text-foreground">รายละเอียดชุดข้อสอบ</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <MetadataCard icon={FileQuestion} label="จำนวนข้อ" value={`${examSet.total_questions} ข้อ`} />
              <MetadataCard icon={Clock} label="เวลาสอบ" value={`${examSet.duration_minutes} นาที`} />
              <MetadataCard icon={Target} label="คะแนนผ่าน" value={`${examSet.passing_score}%`} />
              <MetadataCard icon={TrendingUp} label="ระดับความยาก" value={DIFFICULTY_LABELS[examSet.difficulty as keyof typeof DIFFICULTY_LABELS]} />
              <MetadataCard icon={BookOpen} label="รูปแบบ" value={MODE_LABELS[examSet.mode as keyof typeof MODE_LABELS]} />
              <MetadataCard icon={Shield} label="ประเภท" value={ACCESS_LABELS[examSet.access_type as "free" | "premium"]} />
            </div>
          </section>

          {preview.sample_questions.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-foreground">ตัวอย่างคำถาม</h2>
              <div className="space-y-4">
                {preview.sample_questions.map((q) => (
                  <div key={q.question_no} className="rounded-xl border border-border bg-surface p-4">
                    <p className="mb-2 text-xs text-muted">
                      ข้อ {q.question_no}
                      {q.subject_name ? ` · ${q.subject_name}` : ""}
                    </p>
                    <p className="mb-3 text-sm font-medium text-foreground">{q.question_text}</p>
                    <ul className="space-y-1.5">
                      {q.choices.map((ch) => (
                        <li key={ch.choice_key} className="text-sm text-muted">
                          {ch.choice_label}. {ch.choice_text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <ExamSetReadinessPanel
            examSetId={params.id}
            status={examSet.status}
            onPublished={load}
            onPublishClick={handlePublishClick}
          />
        </aside>
      </div>

      <ExamSetPublishDialog
        examSet={adminSet}
        open={publishOpen}
        loading={publishing}
        onConfirm={handlePublishConfirm}
        onCancel={() => setPublishOpen(false)}
      />
    </div>
  );
}
