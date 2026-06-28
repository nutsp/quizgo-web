"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminListStates } from "@/components/admin/common/AdminListStates";
import { AdminPagination } from "@/components/admin/common/AdminPagination";
import { AdminTableToolbar } from "@/components/admin/common/AdminTableToolbar";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableContainer } from "@/components/admin/AdminTableContainer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminListParams } from "@/hooks/useAdminListParams";
import { adminQuestionImportApi, type ImportJob } from "@/lib/api/admin/endpoints";
import { formatDateTime } from "@/lib/admin/labels";

export function ImportJobsHistory() {
  const { params, updateParams, searchKey } = useAdminListParams("status");
  const [items, setItems] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1, limit: 20, total: 0, total_pages: 1, has_next: false, has_prev: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await adminQuestionImportApi.listJobs({
        page: params.page,
        limit: params.limit,
        q: params.q || undefined,
        status: params.status || undefined,
      });
      setItems(data.items);
      setPagination(data.pagination);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  useEffect(() => { void load(); }, [load]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ประวัติการนำเข้า</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminTableToolbar
          search={params.q}
          searchPlaceholder="ค้นหาชื่อไฟล์..."
          onSearchChange={(v) => updateParams({ q: v }, { resetPage: true })}
          limit={params.limit}
          onLimitChange={(limit) => updateParams({ limit, page: 1 })}
          filters={
            <Select value={params.status || "all"} onValueChange={(v) => updateParams({ status: v === "all" ? "" : v }, { resetPage: true })}>
              <SelectTrigger className="w-36"><SelectValue placeholder="สถานะ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="preview">Preview</SelectItem>
                <SelectItem value="imported">Imported</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <div className="mt-4">
          <AdminListStates loading={loading} error={error} empty={items.length === 0} filtered={Boolean(params.q || params.status)}>
            <AdminTableContainer>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                    <th className="px-5 py-3.5 font-medium">ไฟล์</th>
                    <th className="px-5 py-3.5 font-medium">สถานะ</th>
                    <th className="px-5 py-3.5 font-medium">แถวทั้งหมด</th>
                    <th className="px-5 py-3.5 font-medium">นำเข้าแล้ว</th>
                    <th className="px-5 py-3.5 font-medium">วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((job) => (
                    <tr key={job.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4 font-medium">{job.filename}</td>
                      <td className="px-5 py-4"><AdminStatusBadge status={job.status} /></td>
                      <td className="px-5 py-4">{job.total_rows}</td>
                      <td className="px-5 py-4">{job.imported_questions}</td>
                      <td className="px-5 py-4 text-slate-500">{formatDateTime(job.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableContainer>
          </AdminListStates>
        </div>
      </CardContent>
      {!loading && !error && pagination.total > 0 && (
        <CardFooter className="border-t border-slate-100 pt-6">
          <AdminPagination className="w-full" {...pagination} totalPages={pagination.total_pages} onPageChange={(page) => updateParams({ page })} />
        </CardFooter>
      )}
    </Card>
  );
}
