"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuestionForm } from "@/components/admin/forms/QuestionForm";
import { useToast } from "@/hooks/useToast";
import {
  adminQuestionsApi,
  adminSubjectsApi,
  type AdminQuestion,
  type AdminSubject,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function EditQuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [question, setQuestion] = useState<AdminQuestion | null>(null);
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminQuestionsApi.get(params.id),
      adminSubjectsApi.list({ limit: "100" }),
    ])
      .then(([q, s]) => {
        setQuestion(q);
        setSubjects(s.items);
      })
      .catch((e) => showToast(toUserFriendlyError(e), "error"))
      .finally(() => setLoading(false));
  }, [params.id, showToast]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!question) return <p className="text-muted">ไม่พบข้อมูล</p>;

  return (
    <div>
      <AdminPageHeader title="แก้ไขคำถาม" />
      <QuestionForm
        subjects={subjects}
        defaultValues={{
          subject_id: question.subject_id,
          question_text: question.question_text,
          difficulty: question.difficulty as "easy" | "medium" | "hard",
          explanation: question.explanation ?? "",
          status: question.status as "draft" | "published" | "archived",
          choices: question.choices ?? [],
        }}
        onSubmit={async (data) => {
          try {
            await adminQuestionsApi.update(params.id, data);
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
