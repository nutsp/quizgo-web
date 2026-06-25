"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ExamTrackForm } from "@/components/admin/forms/ExamTrackForm";
import { useToast } from "@/hooks/useToast";
import { adminExamTracksApi } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function NewExamTrackPage() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader title="เพิ่มสายการสอบ" />
      <ExamTrackForm
        submitLabel="สร้างสายการสอบ"
        onSubmit={async (data) => {
          try {
            await adminExamTracksApi.create(data);
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
