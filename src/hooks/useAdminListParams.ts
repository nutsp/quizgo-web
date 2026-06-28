"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/api/pagination";

function parsePage(raw: string | null): number {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parseLimit(raw: string | null): number {
  const n = parseInt(raw ?? String(DEFAULT_PAGE_SIZE), 10);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(n) ? n : DEFAULT_PAGE_SIZE;
}

type BaseParams = {
  page: number;
  limit: number;
  q: string;
  sort: string;
  order: "asc" | "desc" | "";
};

export function useAdminListParams<const T extends readonly string[]>(
  ...extraKeys: T
): {
  params: BaseParams & { [K in T[number]]: string };
  updateParams: (
    updates: Record<string, string | number | undefined | null>,
    options?: { resetPage?: boolean }
  ) => void;
  searchKey: string;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const extraKeysKey = extraKeys.join("\0");

  type Params = BaseParams & { [K in T[number]]: string };

  const params = useMemo(() => {
    const page = parsePage(searchParams.get("page"));
    const limit = parseLimit(searchParams.get("limit"));
    const q = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort") ?? "";
    const order = (searchParams.get("order") as "asc" | "desc" | null) ?? "";
    const result = { page, limit, q, sort, order } as Params;
    for (const key of extraKeys) {
      (result as Record<string, string>)[key] = searchParams.get(key) ?? "";
    }
    return result;
    // searchKey replaces searchParams — extraKeysKey stabilizes variadic keys
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, extraKeysKey]);

  const updateParams = useCallback(
    (
      updates: Record<string, string | number | undefined | null>,
      options?: { resetPage?: boolean }
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      if (options?.resetPage) {
        next.delete("page");
      }
      for (const [key, value] of Object.entries(updates)) {
        if (options?.resetPage && key === "page") continue;
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      if (next.get("page") === "1") next.delete("page");
      if (next.get("limit") === String(DEFAULT_PAGE_SIZE)) next.delete("limit");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchKey]
  );

  return { params, updateParams, searchKey };
}
