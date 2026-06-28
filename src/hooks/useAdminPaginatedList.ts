"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toUserFriendlyError } from "@/lib/api";
import {
  EMPTY_PAGINATION,
  type PaginatedResponse,
  type PaginationMeta,
} from "@/lib/api/pagination";

type UseAdminPaginatedListOptions<T> = {
  fetchPage: () => Promise<PaginatedResponse<T>>;
  reloadKey: string;
  onError?: (message: string) => void;
};

export function useAdminPaginatedList<T>({
  fetchPage,
  reloadKey,
  onError,
}: UseAdminPaginatedListOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>(EMPTY_PAGINATION);

  const fetchPageRef = useRef(fetchPage);
  const onErrorRef = useRef(onError);
  fetchPageRef.current = fetchPage;
  onErrorRef.current = onError;

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchPageRef.current();
      setItems(data.items);
      setPagination(data.pagination);
    } catch (e) {
      setError(true);
      onErrorRef.current?.(toUserFriendlyError(e));
    } finally {
      setLoading(false);
    }
  }, [reloadKey]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    items,
    loading,
    error,
    pagination,
    reload,
    isEmpty: items.length === 0,
  };
}
