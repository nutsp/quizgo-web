import {
  ClipboardCheck,
  Clock,
  FileQuestion,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DIFFICULTY_LABELS, MODE_LABELS, type ExamSet } from "@/lib/exam/format";

type ExamInfoProps = {
  examSet: ExamSet;
};

const METADATA_ITEMS = [
  { key: "questions", icon: FileQuestion, label: "จำนวนข้อ" },
  { key: "duration", icon: Clock, label: "เวลา" },
  { key: "difficulty", icon: TrendingUp, label: "ระดับความยาก" },
  { key: "passing", icon: Target, label: "เกณฑ์ผ่าน" },
  { key: "mode", icon: ClipboardCheck, label: "รูปแบบ" },
] as const;

function getMetadataValue(examSet: ExamSet, key: (typeof METADATA_ITEMS)[number]["key"]): string {
  switch (key) {
    case "questions":
      return `${examSet.total_questions} ข้อ`;
    case "duration":
      return `${examSet.duration_minutes} นาที`;
    case "difficulty":
      return `ระดับ${DIFFICULTY_LABELS[examSet.difficulty]}`;
    case "passing":
      return `${examSet.passing_score}%`;
    case "mode":
      return MODE_LABELS[examSet.mode];
    default:
      return "-";
  }
}

export function ExamInfo({ examSet }: ExamInfoProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">รูปแบบการทำข้อสอบ</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          ระบบจำลองการทำข้อสอบแบบสนามสอบจริง พร้อมตัวจับเวลาและกระดาษคำตอบ OMR
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METADATA_ITEMS.map(({ key, icon: Icon, label }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="font-semibold text-slate-900">{getMetadataValue(examSet, key)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
