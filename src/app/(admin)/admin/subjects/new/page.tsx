"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SubjectForm } from "@/components/admin/forms/SubjectForm";
import { useToast } from "@/hooks/useToast";
import { adminSubjectsApi } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function NewSubjectPage() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader title="เพิ่มหมวดวิชา" />
      <SubjectForm
        onSubmit={async (data) => {
          try {
            await adminSubjectsApi.create(data);
            showToast("บันทึกสำเร็จ");
            router.push("/admin/subjects");
          } catch (e) {
            showToast(toUserFriendlyError(e), "error");
            throw e;
          }
        }}
      />
    </div>
  );
}
