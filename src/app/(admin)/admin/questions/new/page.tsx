"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuestionForm } from "@/components/admin/forms/QuestionForm";
import { useToast } from "@/hooks/useToast";
import { adminQuestionsApi, adminSubjectsApi, adminQuestionTagsApi, type AdminSubject, type AdminQuestionTag } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function NewQuestionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [tags, setTags] = useState<AdminQuestionTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminSubjectsApi.list({ limit: "100" }),
      adminQuestionTagsApi.list({ limit: "100", is_active: "true" }),
    ])
      .then(([s, t]) => {
        setSubjects(s.items);
        setTags(t.items);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <AdminPageHeader title="เพิ่มคำถาม" />
      <QuestionForm
        subjects={subjects}
        tags={tags}
        onSubmit={async (data) => {
          try {
            await adminQuestionsApi.create(data);
            showToast("บันทึกสำเร็จ");
            router.push("/admin/questions");
          } catch (e) {
            showToast(toUserFriendlyError(e), "error");
            throw e;
          }
        }}
      />
    </div>
  );
}
