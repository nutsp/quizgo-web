import { DIFFICULTY_LABELS, type ExamSet } from "@/lib/exam/format";

type ExamOverviewProps = {
  examSet: ExamSet;
};

export function ExamOverview({ examSet }: ExamOverviewProps) {
  const trackName = examSet.exam_track?.name ?? "ไม่ระบุสายการสอบ";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">รายละเอียดชุดข้อสอบ</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {examSet.description ||
          "ชุดข้อสอบจำลองสนามสอบเสมือนจริง เหมาะสำหรับฝึกทำข้อสอบแบบจับเวลาและตรวจสอบความพร้อมก่อนสอบจริง"}
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <dt className="text-xs text-slate-500">สายการสอบ</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{trackName}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <dt className="text-xs text-slate-500">จำนวนข้อ</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {examSet.total_questions} ข้อ
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <dt className="text-xs text-slate-500">เวลา</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {examSet.duration_minutes} นาที
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <dt className="text-xs text-slate-500">เกณฑ์ผ่าน</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {examSet.passing_score}%
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 sm:col-span-2">
          <dt className="text-xs text-slate-500">ระดับความยาก</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            ระดับ{DIFFICULTY_LABELS[examSet.difficulty]}
          </dd>
        </div>
      </dl>
    </section>
  );
}
