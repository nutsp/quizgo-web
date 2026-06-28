"use client";

import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ExamLibraryFilters } from "@/lib/exam/libraryFilters";
import { EMPTY_EXAM_LIBRARY_FILTERS } from "@/lib/exam/libraryFilters";

interface ExamFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftFilters: ExamLibraryFilters;
  onDraftChange: (filters: ExamLibraryFilters) => void;
  onApply: () => void;
}

export function ExamFilterDrawer({
  open,
  onOpenChange,
  draftFilters,
  onDraftChange,
  onApply,
}: ExamFilterDrawerProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium lg:hidden"
        onClick={() => onOpenChange(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        ตัวกรอง
      </Button>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-hidden p-0">
          <SheetHeader className="border-b border-slate-200 px-5 py-4">
            <SheetTitle>ตัวกรอง</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-2">
            <FilterSidebar
              filters={draftFilters}
              onFiltersChange={onDraftChange}
              showHeader={false}
            />
          </div>

          <SheetFooter className="border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onDraftChange({ ...EMPTY_EXAM_LIBRARY_FILTERS })}
            >
              ล้างทั้งหมด
            </Button>
            <Button type="button" className="w-full sm:w-auto" onClick={onApply}>
              ใช้ตัวกรอง
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
