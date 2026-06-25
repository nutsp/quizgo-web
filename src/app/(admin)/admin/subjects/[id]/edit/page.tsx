"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SubjectForm } from "@/components/admin/forms/SubjectForm";
import { useToast } from "@/hooks/useToast";
import { adminSubjectsApi, type AdminSubject } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function EditSubjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [subject, setSubject] = useState<AdminSubject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminSubjectsApi.get(params.id).then(setSubject).catch((e) => showToast(toUserFriendlyError(e), "error")).finally(() => setLoading(false));
  }, [params.id, showToast]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!subject) return <p className="text-muted">ไม่พบข้อมูล</p>;

  return (
    <div>
      <AdminPageHeader title={`แก้ไข: ${subject.name}`} />
      <SubjectForm
        defaultValues={{ name: subject.name, code: subject.code, description: subject.description ?? "" }}
        onSubmit={async (data) => {
          try {
            await adminSubjectsApi.update(params.id, data);
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
