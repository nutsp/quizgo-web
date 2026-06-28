"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MyExamSetCard } from "@/components/my-exams/MyExamSetCard";
import { MyExamsEmptyState } from "@/components/my-exams/MyExamsEmptyState";
import { MyExamsRecommendationPanel } from "@/components/my-exams/MyExamsRecommendationPanel";
import { MyExamsSummaryCards } from "@/components/my-exams/MyExamsSummaryCards";
import { MyExamsTabs } from "@/components/my-exams/MyExamsTabs";
import { Button } from "@/components/ui/button";
import { meExamsApi } from "@/lib/api/meExamsApi";
import { toUserFriendlyError } from "@/lib/api";
import type { MyExamItem, MyExamSummary } from "@/lib/api/types";
import { filterMyExamItems, type MyExamTab } from "@/lib/my-exams/filters";
import { cn } from "@/lib/utils";

function MyExamsContent() {
  const [items, setItems] = useState<MyExamItem[]>([]);
  const [summary, setSummary] = useState<MyExamSummary | null>(null);
  const [activeTab, setActiveTab] = useState<MyExamTab>("all");
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

  const filteredItems = useMemo(
    () => filterMyExamItems(items, activeTab),
    [items, activeTab]
  );

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
          ข้อสอบที่คุณมีความสัมพันธ์กับชุดนั้นแล้ว ทั้งที่ปลดล็อก ได้รับสิทธิ์ และเคยทำผ่าน Premium หรือข้อสอบฟรี
        </p>
      </div>

      {summary && (
        <MyExamsSummaryCards
          summary={summary}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      <div className="mt-6">
        <MyExamsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          {filteredItems.length === 0 ? (
            <MyExamsEmptyState tab={activeTab} />
          ) : (
            <div
              className={cn(
                "grid gap-6",
                filteredItems.length === 1
                  ? "grid-cols-1 sm:max-w-sm"
                  : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              )}
            >
              {filteredItems.map((item) => (
                <MyExamSetCard
                  key={item.id}
                  item={item}
                  hasPremium={summary?.has_premium}
                />
              ))}
            </div>
          )}
        </section>

        {summary && (
          <MyExamsRecommendationPanel items={items} summary={summary} />
        )}
      </div>
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
