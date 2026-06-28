"use client";

import { Eye, MoreHorizontal } from "lucide-react";
import { AdminDataTable } from "@/components/admin/common/AdminDataTable";
import { UserAccessTypeBadge } from "@/components/admin/users/UserAccessTypeBadge";
import { UserRoleBadge } from "@/components/admin/users/UserRoleBadge";
import { UserStatusBadge } from "@/components/admin/users/UserStatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/admin/labels";
import type { AdminUser } from "@/lib/api/admin/endpoints";

type UserTableProps = {
  items: AdminUser[];
  rowOffset?: number;
  onView: (user: AdminUser) => void;
  onChangeStatus: (user: AdminUser, status: string) => void;
  onChangeRole: (user: AdminUser, role: string) => void;
};

export function UserTable({ items, rowOffset = 0, onView, onChangeStatus, onChangeRole }: UserTableProps) {
  return (
    <AdminDataTable
      items={items}
      rowOffset={rowOffset}
      rowKey={(user) => user.id}
      columns={[
        {
          key: "display_name",
          header: "ผู้ใช้งาน",
          className: "font-medium",
          cell: (user) => user.display_name || "-",
        },
        {
          key: "email",
          header: "อีเมล",
          className: "text-slate-600",
          cell: (user) => user.email,
        },
        {
          key: "role",
          header: "บทบาท",
          cell: (user) => <UserRoleBadge role={user.role} />,
        },
        {
          key: "access_summary",
          header: "ประเภทสิทธิ์",
          cell: (user) => <UserAccessTypeBadge accessSummary={user.access_summary} />,
        },
        {
          key: "status",
          header: "สถานะ",
          cell: (user) => <UserStatusBadge status={user.status} />,
        },
        {
          key: "last_login_at",
          header: "เข้าสู่ระบบล่าสุด",
          className: "text-slate-500",
          cell: (user) => formatDateTime(user.last_login_at),
        },
        {
          key: "created_at",
          header: "วันที่สมัคร",
          className: "text-slate-500",
          cell: (user) => formatDateTime(user.created_at),
        },
        {
          key: "actions",
          header: "Actions",
          cell: (user) => (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onView(user)} aria-label="ดูรายละเอียด">
                <Eye className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="จัดการ">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(user)}>ดูรายละเอียด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onView(user)}>จัดการสิทธิ์</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onChangeRole(user, user.role === "admin" ? "user" : "admin")}>
                    {user.role === "admin" ? "เปลี่ยนเป็นผู้ใช้งาน" : "เปลี่ยนเป็นผู้ดูแลระบบ"}
                  </DropdownMenuItem>
                  {user.status !== "suspended" && (
                    <DropdownMenuItem onClick={() => onChangeStatus(user, "suspended")}>
                      ระงับชั่วคราว
                    </DropdownMenuItem>
                  )}
                  {user.status !== "active" && (
                    <DropdownMenuItem onClick={() => onChangeStatus(user, "active")}>
                      เปิดใช้งาน
                    </DropdownMenuItem>
                  )}
                  {user.status !== "disabled" && (
                    <DropdownMenuItem onClick={() => onChangeStatus(user, "disabled")}>
                      ปิดใช้งาน
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        },
      ]}
    />
  );
}
