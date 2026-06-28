export type PaginationParams = {
  page?: number;
  limit?: number;
  q?: string;
  sort?: string;
  order?: "asc" | "desc";
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

export const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  total_pages: 1,
  has_next: false,
  has_prev: false,
};

export function paginationRowOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function buildListQueryParams(
  params: Record<string, string | number | undefined | null>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (key === "page" && Number(value) === 1) continue;
    if (key === "limit" && Number(value) === DEFAULT_PAGE_SIZE) continue;
    out[key] = String(value);
  }
  return out;
}
