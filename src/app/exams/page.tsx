"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ExamSetCard } from "@/components/exam/ExamSetCard";
import { ActiveFilterChips } from "@/components/exams/ActiveFilterChips";
import { ExamFilterDrawer } from "@/components/exams/ExamFilterDrawer";
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
import {
  applyClientExamSetFilters,
  buildExamSetsApiParams,
  EMPTY_EXAM_LIBRARY_FILTERS,
  getActiveFilterChips,
  hasActiveFilters,
  removeFilterChip,
  sortExamSets,
  type ExamLibraryFilters,
} from "@/lib/exam/libraryFilters";

const PAGE_LIMIT = 9;

function ExamLibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackCode = searchParams.get("track");

  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ExamLibraryFilters>(
    EMPTY_EXAM_LIBRARY_FILTERS
  );
  const [filters, setFilters] = useState<ExamLibraryFilters>(
    EMPTY_EXAM_LIBRARY_FILTERS
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [examSets, setExamSets] = useState<ExamSet[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await listExamSets(
          buildExamSetsApiParams(currentPage, PAGE_LIMIT, searchQuery, filters)
        );
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
  }, [currentPage, searchQuery, filters]);

  const filteredExamSets = useMemo(() => {
    const filtered = applyClientExamSetFilters(examSets, filters, trackCode);
    return sortExamSets(filtered, sort);
  }, [examSets, filters, sort, trackCode]);

  const activeChips = useMemo(() => getActiveFilterChips(filters), [filters]);
  const filtersActive = hasActiveFilters(filters, searchQuery);

  const handleFiltersChange = useCallback((next: ExamLibraryFilters) => {
    setFilters(next);
    setCurrentPage(1);
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters(EMPTY_EXAM_LIBRARY_FILTERS);
    setDraftFilters(EMPTY_EXAM_LIBRARY_FILTERS);
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handleRemoveChip = useCallback(
    (chip: ReturnType<typeof getActiveFilterChips>[number]) => {
      handleFiltersChange(removeFilterChip(filters, chip));
    },
    [filters, handleFiltersChange]
  );

  const openFilterDrawer = useCallback(() => {
    setDraftFilters(filters);
    setShowFilters(true);
  }, [filters]);

  const applyFilterDrawer = useCallback(() => {
    handleFiltersChange(draftFilters);
    setShowFilters(false);
  }, [draftFilters, handleFiltersChange]);

  const resultCountText = filtersActive
    ? `พบ ${filteredExamSets.length} ชุดข้อสอบจากตัวกรองที่เลือก`
    : `แสดง ${filteredExamSets.length} ชุดข้อสอบ`;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">คลังข้อสอบ</h1>
        <p className="mt-2 text-slate-500">
          เลือกชุดข้อสอบเพื่อฝึกแบบจับเวลา หรือจำลองสนามสอบจริง
        </p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchBar
          placeholder="ค้นหาข้อสอบ เช่น ก.พ. ตำรวจ ท้องถิ่น"
          className="flex-1"
          value={searchInput}
          onChange={setSearchInput}
        />
        <div className="flex items-center gap-3">
          <ExamFilterDrawer
            open={showFilters}
            onOpenChange={(open) => {
              if (open) {
                openFilterDrawer();
                return;
              }
              setShowFilters(false);
            }}
            draftFilters={draftFilters}
            onDraftChange={setDraftFilters}
            onApply={applyFilterDrawer}
          />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-48">
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

      <ActiveFilterChips
        chips={activeChips}
        onRemove={handleRemoveChip}
        onClearAll={handleClearAll}
        className="mt-3"
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </aside>

        <section>
          <p className="mb-4 text-sm text-slate-500">{resultCountText}</p>

          {loading ? (
            <div className="flex justify-center py-16 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredExamSets.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-base font-medium text-slate-900">
                ไม่พบชุดข้อสอบที่ตรงกับตัวกรอง
              </p>
              <p className="mt-2 text-sm text-slate-500">
                ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองทั้งหมด
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" onClick={handleClearAll}>
                  ล้างตัวกรอง
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    handleClearAll();
                    setSort("recommended");
                    if (trackCode) router.replace("/exams");
                  }}
                >
                  ดูข้อสอบทั้งหมด
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredExamSets.map((examSet) => (
                <ExamSetCard key={examSet.code} examSet={examSet} />
              ))}
            </div>
          )}

          {!loading && filteredExamSets.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  aria-label="หน้าก่อนหน้า"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      aria-label={`หน้า ${page}`}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  aria-label="หน้าถัดไป"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ExamLibraryFallback() {
  return (
    <div className="mx-auto flex w-full max-w-7xl justify-center px-4 py-24 sm:px-6 lg:px-8">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );
}

export default function ExamLibraryPage() {
  return (
    <Suspense fallback={<ExamLibraryFallback />}>
      <ExamLibraryContent />
    </Suspense>
  );
}
