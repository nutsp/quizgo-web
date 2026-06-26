"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileEdit,
  FolderTree,
  Library,
  Loader2,
  Plus,
  Zap,
} from "lucide-react";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
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
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
      </div>
    );
  }

  if (error || !data) {
    return <div role="alert" className="text-red-600">{error ?? "ไม่พบข้อมูล"}</div>;
  }

  const stats = [
    { label: "สายการสอบ", value: data.total_exam_tracks, icon: FolderTree },
    { label: "ชุดข้อสอบ", value: data.total_exam_sets, icon: ClipboardList },
    { label: "หมวดวิชา", value: data.total_subjects, icon: BookOpen },
    { label: "คำถามทั้งหมด", value: data.total_questions, icon: Library },
    { label: "ครั้งที่ทำสอบ", value: data.total_attempts, icon: Activity },
    { label: "คำถามเผยแพร่", value: data.published_questions, icon: CheckCircle2 },
    { label: "คำถามฉบับร่าง", value: data.draft_questions, icon: FileEdit },
    { label: "ชุดที่เปิดใช้", value: data.active_exam_sets, icon: Zap },
  ];

  const quickActions = [
    { href: "/admin/exam-tracks/new", label: "เพิ่มสายการสอบ" },
    { href: "/admin/exam-sets/new", label: "เพิ่มชุดข้อสอบ" },
    { href: "/admin/questions/new", label: "เพิ่มคำถาม" },
    { href: "/admin/subjects", label: "จัดการหมวดวิชา" },
  ];

  return (
    <AdminPageContainer
      title="แดชบอร์ดผู้ดูแล"
      description="จัดการข้อมูลข้อสอบและชุดข้อสอบในระบบ"
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Icon className="absolute right-5 top-5 h-5 w-5 text-slate-400" />
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {s.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            <Plus className="h-4 w-4" />
            {a.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-950">ชุดข้อสอบล่าสุด</h2>
          </div>
          {data.latest_exam_sets.length === 0 ? (
            <p className="px-5 py-4 text-sm text-slate-500">ไม่พบข้อมูล</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.latest_exam_sets.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-950">{s.title}</p>
                    <p className="text-xs text-slate-500">
                      {s.exam_track_name} · {s.total_questions} ข้อ
                    </p>
                  </div>
                  <AdminStatusBadge active={s.is_active} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-950">คำถามล่าสุด</h2>
          </div>
          {data.latest_questions.length === 0 ? (
            <p className="px-5 py-4 text-sm text-slate-500">ไม่พบข้อมูล</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.latest_questions.map((q) => (
                <li key={q.id} className="px-5 py-4">
                  <p className="line-clamp-1 text-sm text-slate-950">{q.question_preview}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-slate-500">{q.subject_name}</span>
                    <AdminStatusBadge status={q.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminPageContainer>
  );
}
