"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import {
  getMyExamTrackResults,
  getMyResultsSummary,
  listMyAttemptResults,
} from "@/lib/api/endpoints";
import { toUserFriendlyError } from "@/lib/api";
import type {
  AttemptHistoryItem,
  ExamTrackResultSummary,
  MyResultsSummary,
} from "@/lib/api/types";
import { MyResultsSummaryCards } from "@/components/results/MyResultsSummaryCards";
import { MyResultsChartsSection } from "@/components/results/my-results/MyResultsChartsSection";
import { WeakSubjectsCard } from "@/components/results/WeakSubjectsCard";
import { LatestResultsTable } from "@/components/results/LatestResultsTable";
import { ExamTrackResultCard } from "@/components/results/ExamTrackResultCard";
import { AttemptHistoryTable } from "@/components/results/AttemptHistoryTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Tab = "overview" | "tracks" | "history";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "ภาพรวม" },
  { id: "tracks", label: "ตามสายการสอบ" },
  { id: "history", label: "ประวัติทั้งหมด" },
];

const RECENT_RESULTS_LIMIT = 5;

function parseTabParam(value: string | null): Tab | null {
  if (value === "overview" || value === "tracks" || value === "history") {
    return value;
  }
  return null;
}

export function MyResultsView() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    () => parseTabParam(searchParams.get("tab")) ?? "overview"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<MyResultsSummary | null>(null);
  const [latestAttempts, setLatestAttempts] = useState<AttemptHistoryItem[]>([]);
  const [trackResults, setTrackResults] = useState<ExamTrackResultSummary[]>([]);
  const [historyItems, setHistoryItems] = useState<AttemptHistoryItem[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);

  const [trackFilter, setTrackFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  const loadOverview = useCallback(async (cancelled: () => boolean) => {
    const [summaryData, latestData] = await Promise.all([
      getMyResultsSummary(),
      listMyAttemptResults({
        limit: String(RECENT_RESULTS_LIMIT),
        page: "1",
      }),
    ]);
    if (cancelled()) return;
    setSummary(summaryData);
    setLatestAttempts(latestData.items);
    setHistoryTotal(latestData.pagination.total);
  }, []);

  const loadTracks = useCallback(async (cancelled: () => boolean) => {
    const data = await getMyExamTrackResults();
    if (cancelled()) return;
    setTrackResults(data);
  }, []);

  const loadHistory = useCallback(
    async (cancelled: () => boolean, page: number) => {
      const params: Record<string, string> = {
        page: String(page),
        limit: "20",
      };
      if (trackFilter) params.exam_track_code = trackFilter;
      if (statusFilter) params.status = statusFilter;

      const data = await listMyAttemptResults(params);
      if (cancelled()) return;

      let items = data.items;
      if (searchTitle.trim()) {
        const q = searchTitle.trim().toLowerCase();
        items = items.filter((i) => i.exam_set.title.toLowerCase().includes(q));
      }

      setHistoryItems(items);
      setHistoryTotal(data.pagination.total);
      setHistoryPage(page);
    },
    [trackFilter, statusFilter, searchTitle]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadOverview(() => false),
        loadTracks(() => false),
        loadHistory(() => false, 1),
      ]);
    } catch (err) {
      setError(toUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [loadOverview, loadTracks, loadHistory]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          loadOverview(() => cancelled),
          loadTracks(() => cancelled),
          loadHistory(() => cancelled, 1),
        ]);
      } catch (err) {
        if (!cancelled) setError(toUserFriendlyError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [loadOverview, loadTracks, loadHistory]);

  useEffect(() => {
    const tabFromUrl = parseTabParam(searchParams.get("tab"));
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== "history") return;
    let cancelled = false;
    loadHistory(() => cancelled, 1).catch((err) => {
      if (!cancelled) setError(toUserFriendlyError(err));
    });
    return () => {
      cancelled = true;
    };
  }, [activeTab, trackFilter, statusFilter, searchTitle, loadHistory]);

  const isEmpty = summary && summary.total_attempts === 0;
  const showViewAllHistory = historyTotal > RECENT_RESULTS_LIMIT;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>กำลังโหลดผลสอบ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-danger">ไม่สามารถโหลดผลสอบได้ กรุณาลองใหม่อีกครั้ง</p>
        <p className="text-sm text-muted">{error}</p>
        <Button onClick={() => loadAll()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          ลองใหม่
        </Button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">ยังไม่มีผลสอบ</h2>
        <p className="max-w-md text-muted">
          เมื่อคุณส่งคำตอบแล้ว ผลสอบและการวิเคราะห์จะแสดงที่นี่
        </p>
        <Button asChild>
          <Link href="/exams">ไปคลังข้อสอบ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">ผลสอบของฉัน</h1>
        <p className="mt-1 text-muted">
          ติดตามคะแนน พัฒนาการ และจุดที่ควรฝึกเพิ่มจากทุกชุดข้อสอบที่คุณทำ
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <div className="inline-flex min-w-max rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && summary && (
        <div className="space-y-8">
          <MyResultsSummaryCards summary={summary} />

          <MyResultsChartsSection
            scoreTrend={summary.score_trend ?? []}
            subjectPerformance={summary.subject_performance ?? []}
          />

          {summary.most_practiced_exam_track && (
            <p className="text-sm text-slate-500">
              สายสอบที่ฝึกบ่อยที่สุด:{" "}
              <strong className="text-slate-950">
                {summary.most_practiced_exam_track.name}
              </strong>
            </p>
          )}

          <WeakSubjectsCard subjects={summary.weak_subjects} />

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-950">ผลสอบล่าสุด</h2>
              {showViewAllHistory && (
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className="shrink-0 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
                >
                  ดูประวัติทั้งหมด
                </button>
              )}
            </div>
            <LatestResultsTable items={latestAttempts} />
          </section>
        </div>
      )}

      {activeTab === "tracks" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {trackResults.map((track) => (
            <ExamTrackResultCard key={track.exam_track.code} track={track} />
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap">
            <Select
              value={trackFilter || "all"}
              onValueChange={(v) => setTrackFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="สายสอบ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสายสอบ</SelectItem>
                {trackResults.map((t) => (
                  <SelectItem key={t.exam_track.code} value={t.exam_track.code}>
                    {t.exam_track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="passed">ผ่าน</SelectItem>
                <SelectItem value="failed">ไม่ผ่าน</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="ค้นหาชื่อชุดข้อสอบ"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full sm:max-w-xs"
            />
          </div>

          <AttemptHistoryTable items={historyItems} />

          {historyTotal > 20 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={historyPage <= 1}
                onClick={() => loadHistory(() => false, historyPage - 1)}
              >
                ก่อนหน้า
              </Button>
              <span className="flex items-center text-sm text-muted">
                หน้า {historyPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={historyPage * 20 >= historyTotal}
                onClick={() => loadHistory(() => false, historyPage + 1)}
              >
                ถัดไป
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
