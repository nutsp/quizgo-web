"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MyExamSetCard } from "@/components/my-exams/MyExamSetCard";
import { MyExamsEmptyState } from "@/components/my-exams/MyExamsEmptyState";
import { MyExamsNextActionsSection } from "@/components/my-exams/MyExamsNextActionsSection";
import { MyExamsTabs } from "@/components/my-exams/MyExamsTabs";
import { Button } from "@/components/ui/button";
import { meExamsApi, MY_EXAMS_PAGE_SIZE } from "@/lib/api/meExamsApi";
import { toUserFriendlyError } from "@/lib/api";
import type { MyExamItem, MyExamSummary } from "@/lib/api/types";
import type { PaginationMeta } from "@/lib/api/pagination";
import { EMPTY_PAGINATION } from "@/lib/api/pagination";
import type { MyExamTab } from "@/lib/my-exams/filters";
import { mergeUniqueMyExamItems } from "@/lib/my-exams/pagination";

function MyExamSetCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="aspect-[16/10] rounded-xl bg-slate-100" />
      <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 h-9 w-full rounded-xl bg-slate-100" />
    </div>
  );
}

function getResultCountText(itemsLength: number, pagination: PaginationMeta | null): string | null {
  if (!pagination || pagination.total === 0) {
    return null;
  }
  if (!pagination.has_next && itemsLength === pagination.total) {
    return `แสดงทั้งหมด ${pagination.total} ชุด`;
  }
  return `แสดง ${itemsLength} จาก ${pagination.total} ชุด`;
}

function MyExamsContent() {
  const [items, setItems] = useState<MyExamItem[]>([]);
  const [summary, setSummary] = useState<MyExamSummary | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [activeTab, setActiveTab] = useState<MyExamTab>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number, tab: MyExamTab, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
        setLoadMoreError(null);
      } else {
        setIsLoading(true);
        setError(null);
        setLoadMoreError(null);
      }

      try {
        const data = await meExamsApi.list({
          page: targetPage,
          limit: MY_EXAMS_PAGE_SIZE,
          tab,
        });

        setSummary(data.summary);
        setPagination(data.pagination);
        setPage(data.pagination.page);
        setItems((current) =>
          append
            ? mergeUniqueMyExamItems(current, data.items ?? [])
            : (data.items ?? [])
        );
      } catch (e) {
        const message = toUserFriendlyError(e);
        if (append) {
          setLoadMoreError("โหลดข้อมูลเพิ่มเติมไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } else {
          setError(message);
          setItems([]);
          setPagination(EMPTY_PAGINATION);
        }
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    void fetchPage(1, activeTab, false);
  }, [activeTab, fetchPage]);

  const handleTabChange = (tab: MyExamTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPage(1);
    setItems([]);
    setPagination(null);
  };

  const handleLoadMore = () => {
    if (!pagination?.has_next || isLoadingMore) return;
    void fetchPage(page + 1, activeTab, true);
  };

  const resultCountText = getResultCountText(items.length, pagination);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">ข้อสอบของฉัน</h1>
          <p className="mt-2 text-muted">
            รวมข้อสอบที่คุณปลดล็อก ได้รับสิทธิ์ หรือเคยเริ่มทำแล้ว
          </p>
        </div>
        <div className="mt-6">
          <MyExamsTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <p className="mt-6 text-sm text-slate-500">กำลังโหลดข้อสอบของฉัน...</p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <MyExamSetCardSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-danger">ไม่สามารถโหลดข้อสอบของฉันได้ กรุณาลองใหม่อีกครั้ง</p>
        <p className="mt-2 text-sm text-muted">{error}</p>
        <Button className="mt-4" onClick={() => void fetchPage(1, activeTab, false)}>
          ลองใหม่
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">ข้อสอบของฉัน</h1>
        <p className="mt-2 text-muted">
          รวมข้อสอบที่คุณปลดล็อก ได้รับสิทธิ์ หรือเคยเริ่มทำแล้ว
        </p>
      </div>

      <div className="mt-6">
        <MyExamsTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {resultCountText && (
        <p className="mt-6 text-sm text-slate-500">{resultCountText}</p>
      )}

      <div className={resultCountText ? "mt-4" : "mt-6"}>
        {items.length === 0 ? (
          <MyExamsEmptyState tab={activeTab} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
              <MyExamSetCard
                key={item.id}
                item={item}
                hasPremium={summary?.has_premium}
              />
            ))}
          </div>
        )}
      </div>

      {pagination?.has_next && items.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          {loadMoreError && (
            <p className="text-sm text-danger">{loadMoreError}</p>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={isLoadingMore}
            onClick={handleLoadMore}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {isLoadingMore ? "กำลังโหลด..." : "โหลดเพิ่มเติม"}
          </Button>
        </div>
      )}

      {summary && (
        <MyExamsNextActionsSection items={items} summary={summary} />
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
