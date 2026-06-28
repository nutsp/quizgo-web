import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, Crown, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MyExamItem, MyExamSummary } from "@/lib/api/types";
import { hasSubmittedResults } from "@/lib/my-exams/filters";

type MyExamsRecommendationPanelProps = {
  items: MyExamItem[];
  summary: MyExamSummary;
};

type RecommendationItem = {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
};

export function MyExamsRecommendationPanel({
  items,
  summary,
}: MyExamsRecommendationPanelProps) {
  const recommendations: RecommendationItem[] = [];

  if (items.length <= 2) {
    recommendations.push({
      icon: <BookOpen className="h-5 w-5" />,
      iconClassName: "bg-teal-50 text-teal-700",
      title: "ยังมีข้อสอบอีกหลายชุดให้ลอง",
      description: "ไปที่คลังข้อสอบเพื่อเลือกชุดที่เหมาะกับคุณ",
      buttonLabel: "ไปคลังข้อสอบ",
      href: "/exams",
    });
  }

  if (!summary.has_premium) {
    recommendations.push({
      icon: <Crown className="h-5 w-5" />,
      iconClassName: "bg-amber-50 text-amber-600",
      title: "ปลดล็อกข้อสอบ Premium",
      description: "เข้าถึงชุดข้อสอบ Premium และฟีเจอร์วิเคราะห์เพิ่มเติม",
      buttonLabel: "ดูแพ็กเกจ",
      href: "/pricing",
    });
  }

  recommendations.push({
    icon: <Trophy className="h-5 w-5" />,
    iconClassName: "bg-blue-50 text-blue-600",
    title: "ดูผลสอบล่าสุด",
    description: hasSubmittedResults(items)
      ? "กลับไปทบทวนจุดอ่อนและเฉลยรายข้อ"
      : "เมื่อทำข้อสอบเสร็จแล้ว ผลสอบจะแสดงที่นี่",
    buttonLabel: "ดูผลสอบของฉัน",
    href: "/my-results",
  });

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">แนะนำต่อ</h2>
        <div className="mt-4 space-y-4">
          {recommendations.map((item) => (
            <div
              key={item.href + item.title}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClassName}`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                  <Button asChild size="sm" variant="outline" className="mt-3 h-8 text-xs">
                    <Link href={item.href}>{item.buttonLabel}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
