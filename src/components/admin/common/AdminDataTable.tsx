"use client";

import type { ReactNode } from "react";
import { AdminTableContainer } from "@/components/admin/AdminTableContainer";
import { cn } from "@/lib/utils";

export type AdminDataTableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type AdminDataTableProps<T> = {
  items: T[];
  columns: AdminDataTableColumn<T>[];
  rowKey: (item: T) => string;
  rowClassName?: string;
  tableClassName?: string;
  showRowNumber?: boolean;
  rowOffset?: number;
  rowNumberHeader?: ReactNode;
};

export function AdminDataTable<T>({
  items,
  columns,
  rowKey,
  rowClassName,
  tableClassName,
  showRowNumber = true,
  rowOffset = 0,
  rowNumberHeader = "ลำดับ",
}: AdminDataTableProps<T>) {
  return (
    <AdminTableContainer>
      <table className={cn("w-full text-sm", tableClassName)}>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            {showRowNumber && (
              <th className="w-14 px-3 py-3.5 text-center font-medium">{rowNumberHeader}</th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-5 py-3.5 font-medium", col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={rowKey(item)}
              className={cn("border-b border-slate-100 last:border-0", rowClassName)}
            >
              {showRowNumber && (
                <td className="w-14 px-3 py-4 text-center tabular-nums text-slate-500">
                  {rowOffset + index + 1}
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={cn("px-5 py-4", col.className)}>
                  {col.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </AdminTableContainer>
  );
}
