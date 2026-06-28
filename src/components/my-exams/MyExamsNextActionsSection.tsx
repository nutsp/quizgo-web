import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, Crown, Library, PlayCircle } from "lucide-react";
import type { MyExamItem, MyExamSummary } from "@/lib/api/types";

type MyExamsNextActionsSectionProps = {
  items: MyExamItem[];
  summary: MyExamSummary;
};

type NextActionCard = {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
};

function findInProgressAttempt(items: MyExamItem[]) {
  for (const item of items) {
    const attempt = item.latest_attempt;
    if (attempt?.status === "in_progress" && attempt.attempt_id) {
      return {
        attemptId: attempt.attempt_id,
        examSetCode: item.code,
      };
    }
  }
  return null;
}

function buildNextActionCards(
  items: MyExamItem[],
  summary: MyExamSummary
): NextActionCard[] {
  const hasPremium = summary.has_premium;
  const inProgress = findInProgressAttempt(items);

  const premiumCard: NextActionCard = hasPremium
    ? {
        icon: <Crown className="h-5 w-5" />,
        iconClassName: "bg-amber-50 text-amber-600",
        title: "Premium ของคุณ",
        description: "ใช้งานข้อสอบ Premium และฟีเจอร์เพิ่มเติมได้แล้ว",
        buttonLabel: "ดูแพ็กเกจ",
        href: "/pricing",
      }
    : {
        icon: <Crown className="h-5 w-5" />,
        iconClassName: "bg-amber-50 text-amber-600",
        title: "ปลดล็อกข้อสอบ Premium",
        description: "เข้าถึงชุดข้อสอบ Premium และฟีเจอร์วิเคราะห์เพิ่มเติม",
        buttonLabel: "ดูแพ็กเกจ",
        href: "/pricing",
      };

  const resultsCard: NextActionCard = {
    icon: <BarChart3 className="h-5 w-5" />,
    iconClassName: "bg-blue-50 text-blue-600",
    title: "ดูผลสอบล่าสุด",
    description: "กลับไปทบทวนจุดอ่อนและเฉลยรายข้อ",
    buttonLabel: "ดูผลสอบของฉัน",
    href: "/my-results",
  };

  const libraryCard: NextActionCard = {
    icon: <Library className="h-5 w-5" />,
    iconClassName: "bg-teal-50 text-teal-700",
    title: "ค้นหาข้อสอบเพิ่มเติม",
    description: "เลือกชุดข้อสอบใหม่จากคลังข้อสอบ",
    buttonLabel: "ไปคลังข้อสอบ",
    href: "/exams",
  };

  const continueCard: NextActionCard = inProgress
    ? {
        icon: <PlayCircle className="h-5 w-5" />,
        iconClassName: "bg-violet-50 text-violet-600",
        title: "ทำข้อสอบต่อ",
        description: "คุณมีข้อสอบที่ยังทำไม่เสร็จ",
        buttonLabel: "ทำต่อ",
        href: `/exams/${inProgress.examSetCode}/take?attempt_id=${inProgress.attemptId}`,
      }
    : {
        icon: <PlayCircle className="h-5 w-5" />,
        iconClassName: "bg-violet-50 text-violet-600",
        title: "เริ่มซ้อมสอบชุดใหม่",
        description: "เลือกชุดข้อสอบที่เหมาะกับคุณแล้วเริ่มซ้อมสอบทันที",
        buttonLabel: "ดูคลังข้อสอบ",
        href: "/exams",
      };

  return [premiumCard, resultsCard, libraryCard, continueCard];
}

function NextActionCardView({ card }: { card: NextActionCard }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${card.iconClassName}`}
        >
          {card.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-950">{card.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{card.description}</p>
          <Link
            href={card.href}
            className="mt-4 inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {card.buttonLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MyExamsNextActionsSection({
  items,
  summary,
}: MyExamsNextActionsSectionProps) {
  const cards = buildNextActionCards(items, summary);

  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-950">แนะนำต่อ</h2>
        <p className="mt-1 text-sm text-slate-500">
          ขั้นตอนถัดไปเพื่อพัฒนาคะแนนของคุณ
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <NextActionCardView key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
