"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminDashboardApi, type AdminDashboard } from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminDashboardApi
      .get()
      .then(setData)
      .catch((e) => setError(toUserFriendlyError(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return <div role="alert" className="text-danger">{error ?? "ไม่พบข้อมูล"}</div>;
  }

  const stats = [
    { label: "สายการสอบ", value: data.total_exam_tracks },
    { label: "ชุดข้อสอบ", value: data.total_exam_sets },
    { label: "หมวดวิชา", value: data.total_subjects },
    { label: "คำถามทั้งหมด", value: data.total_questions },
    { label: "ครั้งที่ทำสอบ", value: data.total_attempts },
    { label: "คำถามเผยแพร่", value: data.published_questions },
    { label: "คำถามฉบับร่าง", value: data.draft_questions },
    { label: "ชุดที่เปิดใช้", value: data.active_exam_sets },
  ];

  const quickActions = [
    { href: "/admin/exam-tracks/new", label: "เพิ่มสายการสอบ", icon: Plus },
    { href: "/admin/exam-sets/new", label: "เพิ่มชุดข้อสอบ", icon: Plus },
    { href: "/admin/questions/new", label: "เพิ่มคำถาม", icon: Plus },
    { href: "/admin/subjects", label: "จัดการหมวดวิชา", icon: Plus },
  ];

  return (
    <div>
      <AdminPageHeader
        title="แดชบอร์ดผู้ดูแล"
        description="จัดการข้อมูลข้อสอบและชุดข้อสอบในระบบ"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4 shadow-card">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <a.icon className="h-4 w-4" />
            {a.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-semibold text-foreground">ชุดข้อสอบล่าสุด</h2>
          {data.latest_exam_sets.length === 0 ? (
            <p className="text-sm text-muted">ไม่พบข้อมูล</p>
          ) : (
            <ul className="space-y-3">
              {data.latest_exam_sets.map((s) => (
                <li key={s.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted">{s.exam_track_name} · {s.total_questions} ข้อ</p>
                  </div>
                  <AdminStatusBadge active={s.is_active} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-semibold text-foreground">คำถามล่าสุด</h2>
          {data.latest_questions.length === 0 ? (
            <p className="text-sm text-muted">ไม่พบข้อมูล</p>
          ) : (
            <ul className="space-y-3">
              {data.latest_questions.map((q) => (
                <li key={q.id} className="border-b border-border pb-3 last:border-0">
                  <p className="text-sm text-foreground">{q.question_preview}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted">{q.subject_name}</span>
                    <AdminStatusBadge status={q.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
