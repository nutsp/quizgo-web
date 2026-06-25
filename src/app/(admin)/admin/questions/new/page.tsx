"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuestionForm } from "@/components/admin/forms/QuestionForm";
import { useToast } from "@/hooks/useToast";
import { adminQuestionsApi, adminSubjectsApi, type AdminSubject } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function NewQuestionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminSubjectsApi.list({ limit: "100" }).then((d) => setSubjects(d.items)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <AdminPageHeader title="เพิ่มคำถาม" />
      <QuestionForm
        subjects={subjects}
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
