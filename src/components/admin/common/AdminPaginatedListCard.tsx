"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { PaginationMeta } from "@/lib/api/pagination";
import { cn } from "@/lib/utils";
import { AdminListStates } from "./AdminListStates";
import { AdminPagination } from "./AdminPagination";

type AdminPaginatedListCardProps = {
  toolbar: ReactNode;
  loading: boolean;
  error: boolean;
  empty: boolean;
  filtered?: boolean;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  children: ReactNode;
  className?: string;
};

export function AdminPaginatedListCard({
  toolbar,
  loading,
  error,
  empty,
  filtered = false,
  pagination,
  onPageChange,
  children,
  className,
}: AdminPaginatedListCardProps) {
  const showPagination = !loading && !error && pagination.total > 0;

  return (
    <Card className={cn(className)}>
      <CardContent className="pt-6">{toolbar}</CardContent>
      <CardContent className="pt-0">
        <AdminListStates loading={loading} error={error} empty={empty} filtered={filtered}>
          {children}
        </AdminListStates>
      </CardContent>
      {showPagination && (
        <CardFooter className="border-t border-slate-100 pt-6">
          <AdminPagination
            className="w-full"
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            totalPages={pagination.total_pages}
            hasNext={pagination.has_next}
            hasPrev={pagination.has_prev}
            onPageChange={onPageChange}
          />
        </CardFooter>
      )}
    </Card>
  );
}
