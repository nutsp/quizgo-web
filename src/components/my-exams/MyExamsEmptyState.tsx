import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { MyExamTab } from "@/lib/my-exams/filters";

type MyExamsEmptyStateProps = {
  tab: MyExamTab;
};

const EMPTY_STATES: Record<
  MyExamTab,
  {
    title: string;
    description: string;
    actions: { label: string; href: string; variant?: "default" | "outline" }[];
  }
> = {
  all: {
    title: "ยังไม่มีข้อสอบในคลังของฉัน",
    description:
      "เมื่อคุณปลดล็อกชุดข้อสอบ ได้รับสิทธิ์ หรือเริ่มทำข้อสอบ Premium/ฟรี ชุดข้อสอบจะแสดงที่นี่",
    actions: [
      { label: "ไปที่คลังข้อสอบ", href: "/exams" },
      { label: "ดูแพ็กเกจ Premium", href: "/pricing", variant: "outline" },
    ],
  },
  in_progress: {
    title: "ไม่มีข้อสอบที่กำลังทำอยู่",
    description: "เมื่อคุณเริ่มทำข้อสอบและยังไม่ส่งคำตอบ ชุดข้อสอบจะแสดงในหมวดนี้",
    actions: [{ label: "ไปที่คลังข้อสอบ", href: "/exams" }],
  },
  completed: {
    title: "ยังไม่มีข้อสอบที่ทำเสร็จแล้ว",
    description: "เมื่อส่งคำตอบหรือหมดเวลา ชุดข้อสอบจะแสดงในหมวดนี้",
    actions: [{ label: "ไปที่คลังข้อสอบ", href: "/exams" }],
  },
  unlocked: {
    title: "ยังไม่มีข้อสอบที่ปลดล็อกแล้ว",
    description: "ข้อสอบที่ซื้อรายชุดหรือได้รับสิทธิ์จากผู้ดูแลระบบจะแสดงในหมวดนี้",
    actions: [{ label: "ดูคลังข้อสอบ", href: "/exams" }],
  },
  special_grant: {
    title: "ยังไม่มีข้อสอบที่ได้รับสิทธิ์พิเศษ",
    description: "หากผู้ดูแลระบบมอบสิทธิ์ให้คุณ ชุดข้อสอบพิเศษจะแสดงที่นี่",
    actions: [],
  },
};

export function MyExamsEmptyState({ tab }: MyExamsEmptyStateProps) {
  const state = EMPTY_STATES[tab];

  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-foreground">{state.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{state.description}</p>
      {state.actions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {state.actions.map((action) => (
            <Button key={action.href} asChild variant={action.variant ?? "default"}>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
