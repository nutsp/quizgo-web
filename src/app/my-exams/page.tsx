"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Loader2, Lock, ShieldCheck } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MyExamSetCard } from "@/components/my-exams/MyExamSetCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { meExamsApi } from "@/lib/api/meExamsApi";
import { toUserFriendlyError } from "@/lib/api";
import type { MyExamItem, MyExamSummary } from "@/lib/api/types";

function SummaryCards({ summary }: { summary: MyExamSummary }) {
  const premiumLabel = summary.has_premium ? "ใช้งานอยู่" : "ยังไม่เปิดใช้งาน";
  const paidCount = summary.unlocked_exam_set_count - summary.private_exam_set_count;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted">Premium</p>
            <p className="font-semibold text-foreground">{premiumLabel}</p>
            {summary.has_premium && summary.premium_expires_at && (
              <p className="mt-1 text-xs text-muted">
                หมดอายุ {new Date(summary.premium_expires_at).toLocaleDateString("th-TH")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted">ซื้อรายชุด</p>
            <p className="font-semibold text-foreground">{Math.max(0, paidCount)} ชุด</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted">เฉพาะผู้ได้รับสิทธิ์</p>
            <p className="font-semibold text-foreground">{summary.private_exam_set_count} ชุด</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MyExamsContent() {
  const [items, setItems] = useState<MyExamItem[]>([]);
  const [summary, setSummary] = useState<MyExamSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await meExamsApi.list();
      setItems(data.items ?? []);
      setSummary(data.summary);
    } catch (e) {
      setError(toUserFriendlyError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">กำลังโหลดข้อสอบของฉัน...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-danger">ไม่สามารถโหลดข้อสอบของฉันได้ กรุณาลองใหม่อีกครั้ง</p>
        <p className="mt-2 text-sm text-muted">{error}</p>
        <Button className="mt-4" onClick={() => void load()}>
          ลองใหม่
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">ข้อสอบของฉัน</h1>
        <p className="mt-2 text-muted">
          รวมชุดข้อสอบที่คุณปลดล็อกแล้วหรือได้รับสิทธิ์พิเศษจากผู้ดูแลระบบ
        </p>
      </div>

      {summary && <SummaryCards summary={summary} />}

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">ยังไม่มีข้อสอบในคลังของฉัน</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            เมื่อคุณปลดล็อกชุดข้อสอบหรือได้รับสิทธิ์พิเศษจากผู้ดูแลระบบ ชุดข้อสอบจะแสดงที่นี่
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/exams">ไปที่คลังข้อสอบ</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">ดูแพ็กเกจ Premium</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MyExamSetCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function MyExamsPage() {
  return (
    <AuthGuard>
      <MyExamsContent />
    </AuthGuard>
  );
}
