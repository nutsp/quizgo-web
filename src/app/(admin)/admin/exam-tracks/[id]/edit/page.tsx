"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExamTrackForm } from "@/components/admin/forms/ExamTrackForm";
import { useToast } from "@/hooks/useToast";
import { adminExamTracksApi, type AdminExamTrack } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function EditExamTrackPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [track, setTrack] = useState<AdminExamTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminExamTracksApi
      .get(params.id)
      .then(setTrack)
      .catch((e) => showToast(toUserFriendlyError(e), "error"))
      .finally(() => setLoading(false));
  }, [params.id, showToast]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!track) return <p className="text-muted">ไม่พบข้อมูล</p>;

  return (
    <div>
      <AdminPageHeader title={`แก้ไข: ${track.name}`} />
      <ExamTrackForm
        defaultValues={{
          name: track.name,
          code: track.code,
          description: track.description ?? "",
          cover_image_url: track.cover_image_url ?? "",
          is_active: track.is_active,
        }}
        onSubmit={async (data) => {
          try {
            await adminExamTracksApi.update(params.id, data);
            showToast("บันทึกสำเร็จ");
            router.push("/admin/exam-tracks");
          } catch (e) {
            showToast(toUserFriendlyError(e), "error");
            throw e;
          }
        }}
      />
    </div>
  );
}
