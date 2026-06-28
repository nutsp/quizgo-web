"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuestionTagForm } from "@/components/admin/question-tags/QuestionTagForm";
import { useToast } from "@/hooks/useToast";
import { adminQuestionTagsApi, type AdminQuestionTag } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function EditQuestionTagPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [tag, setTag] = useState<AdminQuestionTag | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminQuestionTagsApi
      .get(params.id)
      .then(setTag)
      .catch((e) => showToast(toUserFriendlyError(e), "error"))
      .finally(() => setLoading(false));
  }, [params.id, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!tag) return <p className="text-muted">ไม่พบข้อมูล</p>;

  return (
    <div>
      <AdminPageHeader title="แก้ไขกลุ่มคำถาม" />
      <QuestionTagForm
        defaultValues={{
          name: tag.name,
          code: tag.code,
          description: tag.description ?? "",
          color: tag.color ?? "",
          is_active: tag.is_active,
        }}
        onSubmit={async (data) => {
          try {
            await adminQuestionTagsApi.update(params.id, data);
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
