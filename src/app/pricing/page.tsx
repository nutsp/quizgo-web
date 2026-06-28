import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PLANS = [
  {
    id: "free",
    title: "ฟรี",
    price: "0 บาท",
    description: "เหมาะสำหรับทดลองทำข้อสอบ",
    features: ["ทำข้อสอบฟรี", "ดูคะแนนพื้นฐาน"],
    cta: "เลือกชุดข้อสอบ",
    href: "/exams",
    disabled: false,
  },
  {
    id: "paid",
    title: "ซื้อรายชุด",
    price: "เริ่มต้น 49 บาท",
    description: "เหมาะสำหรับคนที่ต้องการชุดข้อสอบเฉพาะ",
    features: ["ปลดล็อกชุดข้อสอบ", "ทำซ้ำได้", "ดูเฉลยรายข้อ"],
    cta: "เลือกชุดข้อสอบ",
    href: "/exams",
    disabled: false,
  },
  {
    id: "premium",
    title: "Premium",
    price: "149 บาท / เดือน",
    description: "เหมาะสำหรับคนเตรียมสอบจริงจัง",
    features: [
      "เข้าถึงข้อสอบ Premium ทั้งหมด",
      "วิเคราะห์จุดอ่อนตามวิชาและกลุ่มคำถาม",
      "ฝึกข้อที่ผิด",
      "ฝึกตามกลุ่มคำถาม",
    ],
    cta: "เร็ว ๆ นี้",
    href: undefined,
    disabled: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground">แพ็กเกจและราคา</h1>
        <p className="mt-2 text-muted">เลือกแพ็กเกจที่เหมาะกับการเตรียมสอบของคุณ</p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ขณะนี้ระบบยังไม่เปิดชำระเงินออนไลน์ กรุณาติดต่อผู้ดูแลระบบเพื่อปลดล็อกสิทธิ์
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={plan.id === "premium" ? "border-primary shadow-md" : ""}
          >
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <p className="text-2xl font-bold text-foreground">{plan.price}</p>
              <p className="text-sm text-muted">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.disabled ? (
                <Button className="w-full" disabled>
                  {plan.cta}
                </Button>
              ) : (
                <Button asChild className="w-full" variant={plan.id === "premium" ? "default" : "outline"}>
                  <Link href={plan.href!}>{plan.cta}</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
