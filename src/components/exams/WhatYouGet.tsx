import { CheckCircle2 } from "lucide-react";
import type { ExamSet } from "@/lib/exam/format";

type WhatYouGetProps = {
  examSet: ExamSet;
};

const BASE_BENEFITS = [
  "คะแนนรวม",
  "จำนวนข้อถูก ผิด และยังไม่ตอบ",
  "เฉลยรายข้อ",
  "ประวัติผลสอบย้อนหลัง",
];

const PREMIUM_BENEFITS = [
  { text: "เข้าถึงข้อสอบ Premium ทั้งหมด", soon: false },
  { text: "วิเคราะห์จุดอ่อนตามวิชาและกลุ่มคำถาม", soon: false },
  { text: "ฝึกข้อที่ผิด", soon: true },
  { text: "ฝึกตาม Tags", soon: true },
];

export function WhatYouGet({ examSet }: WhatYouGetProps) {
  const showPremiumExtras = examSet.access_type === "premium";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">หลังทำข้อสอบจะได้อะไร</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {BASE_BENEFITS.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
            {item}
          </li>
        ))}
      </ul>

      {showPremiumExtras && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-900">Premium จะได้เพิ่ม</h3>
          <ul className="mt-3 space-y-2">
            {PREMIUM_BENEFITS.map(({ text, soon }) => (
              <li key={text} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  {text}
                  {soon && (
                    <span className="ml-1.5 text-xs font-medium text-slate-400">(เร็ว ๆ นี้)</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
