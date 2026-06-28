"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserFiltersProps = {
  search: string;
  role: string;
  status: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function UserFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Input
        placeholder="ค้นหาชื่อหรืออีเมล..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Select value={role || "all"} onValueChange={(v) => onRoleChange(v === "all" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="บทบาท" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทุกบทบาท</SelectItem>
          <SelectItem value="user">ผู้ใช้งาน</SelectItem>
          <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
        </SelectContent>
      </Select>
      <Select value={status || "all"} onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="สถานะ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทุกสถานะ</SelectItem>
          <SelectItem value="active">ใช้งานอยู่</SelectItem>
          <SelectItem value="suspended">ระงับชั่วคราว</SelectItem>
          <SelectItem value="disabled">ปิดใช้งาน</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
