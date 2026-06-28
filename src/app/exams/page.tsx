"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, SlidersHorizontal, X } from "lucide-react";
import { ExamSetCard } from "@/components/exam/ExamSetCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortOptions } from "@/data/exams";
import { listExamSets } from "@/lib/api/endpoints";
import { mapExamSetItemToExamSet } from "@/lib/api/mappers";
import type { ExamSet } from "@/lib/exam/format";

export default function ExamLibraryPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [examSets, setExamSets] = useState<ExamSet[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await listExamSets({
          page: String(currentPage),
          limit: "9",
        });
        if (!cancelled) {
          setExamSets(data.items.map(mapExamSetItemToExamSet));
          setTotalPages(Math.max(1, data.total_pages));
        }
      } catch {
        if (!cancelled) setExamSets([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">คลังข้อสอบ</h1>
        <p className="mt-2 text-muted">
          เลือกชุดข้อสอบเพื่อฝึกแบบจับเวลา หรือจำลองสนามสอบจริง
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar placeholder="ค้นหาชุดข้อสอบ" className="flex-1" />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            ตัวกรอง
          </Button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="เรียงตาม" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h2 className="mb-4 text-sm font-bold text-foreground">ตัวกรอง</h2>
            <FilterSidebar />
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-4 text-sm text-muted">แสดง {examSets.length} ชุดข้อสอบ</p>

          {loading ? (
            <div className="flex justify-center py-16 text-muted">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {examSets.map((examSet) => (
                <ExamSetCard key={examSet.code} examSet={examSet} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold">ตัวกรอง</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterSidebar />
            <Button className="mt-6 w-full" onClick={() => setShowFilters(false)}>
              แสดงผล
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
