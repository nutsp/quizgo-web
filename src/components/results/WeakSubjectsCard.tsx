import Link from "next/link";
import type { WeakSubject } from "@/lib/api/types";
import { formatPercent } from "@/lib/format";
import { AlertCircle } from "lucide-react";

interface WeakSubjectsCardProps {
  subjects: WeakSubject[];
}

function buildRelatedExamsHref(subject: WeakSubject): string {
  // Subject filter routing is not wired to exam library yet; keep a stable fallback.
  if (subject.subject_code) {
    return `/exams?q=${encodeURIComponent(subject.subject_name)}`;
  }
  return "/exams";
}

export function WeakSubjectsCard({ subjects }: WeakSubjectsCardProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-slate-950">หมวดที่ควรฝึกเพิ่ม</h2>

      {subjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
          ยังไม่มีข้อมูลเพียงพอสำหรับวิเคราะห์จุดที่ควรฝึกเพิ่ม
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {subjects.map((subject) => (
            <div
              key={subject.subject_code ?? subject.subject_name}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-950">{subject.subject_name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    คะแนนเฉลี่ย {formatPercent(subject.average_score_percent)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {subject.recommendation ?? "ควรฝึกข้อสอบหมวดนี้เพิ่มเติม"}
                  </p>
                  <Link
                    href={buildRelatedExamsHref(subject)}
                    className="mt-4 inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    ดูข้อสอบที่เกี่ยวข้อง
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
