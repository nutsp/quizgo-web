"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuestionTagForm } from "@/components/admin/question-tags/QuestionTagForm";
import { useToast } from "@/hooks/useToast";
import { adminQuestionTagsApi } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function NewQuestionTagPage() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader title="เพิ่มกลุ่มคำถาม" />
      <QuestionTagForm
        onSubmit={async (data) => {
          try {
            await adminQuestionTagsApi.create(data);
            showToast("บันทึกสำเร็จ");
            router.push("/admin/question-tags");
          } catch (e) {
            showToast(toUserFriendlyError(e), "error");
            throw e;
          }
        }}
      />
    </div>
  );
}
