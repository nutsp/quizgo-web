"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExamSetForm } from "@/components/admin/forms/ExamSetForm";
import { useToast } from "@/hooks/useToast";
import { adminExamSetsApi, adminExamTracksApi, type AdminExamTrack } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function NewExamSetPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tracks, setTracks] = useState<AdminExamTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminExamTracksApi.list({ limit: "100" }).then((d) => setTracks(d.items)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <AdminPageHeader title="เพิ่มชุดข้อสอบ" />
      <ExamSetForm
        tracks={tracks}
        submitLabel="สร้างชุดข้อสอบ"
        onSubmit={async (data) => {
          try {
            await adminExamSetsApi.create(data);
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
