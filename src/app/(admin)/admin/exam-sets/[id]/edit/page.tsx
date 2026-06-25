"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExamSetForm } from "@/components/admin/forms/ExamSetForm";
import { useToast } from "@/hooks/useToast";
import {
  adminExamSetsApi,
  adminExamTracksApi,
  type AdminExamSet,
  type AdminExamTrack,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function EditExamSetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [set, setSet] = useState<AdminExamSet | null>(null);
  const [tracks, setTracks] = useState<AdminExamTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminExamSetsApi.get(params.id),
      adminExamTracksApi.list({ limit: "100" }),
    ])
      .then(([s, t]) => {
        setSet(s);
        setTracks(t.items);
      })
      .catch((e) => showToast(toUserFriendlyError(e), "error"))
      .finally(() => setLoading(false));
  }, [params.id, showToast]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!set) return <p className="text-muted">ไม่พบข้อมูล</p>;

  return (
    <div>
      <AdminPageHeader title={`แก้ไข: ${set.title}`} />
      <ExamSetForm
        tracks={tracks}
        defaultValues={{
          exam_track_id: set.exam_track_id,
          title: set.title,
          code: set.code,
          description: set.description ?? "",
          cover_image_url: set.cover_image_url ?? "",
          duration_minutes: set.duration_minutes,
          total_questions: set.total_questions,
          passing_score: set.passing_score,
          difficulty: set.difficulty as "easy" | "medium" | "hard",
          access_type: set.access_type as "free" | "premium",
          price_amount: set.price_amount,
          sale_price_amount: set.sale_price_amount ?? undefined,
          currency: set.currency,
          mode: set.mode as "practice" | "mock_exam",
          is_official: set.is_official,
          is_featured: set.is_featured,
          is_active: set.is_active,
        }}
        onSubmit={async (data) => {
          try {
            await adminExamSetsApi.update(params.id, data);
            showToast("บันทึกสำเร็จ");
            router.push("/admin/exam-sets");
          } catch (e) {
            showToast(toUserFriendlyError(e), "error");
            throw e;
          }
        }}
      />
    </div>
  );
}
