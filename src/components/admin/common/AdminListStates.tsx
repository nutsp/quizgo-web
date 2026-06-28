"use client";

import { Loader2 } from "lucide-react";

type AdminListStatesProps = {
  loading: boolean;
  error: boolean;
  empty: boolean;
  filtered: boolean;
  children: React.ReactNode;
};

export function AdminListStates({
  loading,
  error,
  empty,
  filtered,
  children,
}: AdminListStatesProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-sm text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
        กำลังโหลดข้อมูล...
      </div>
    );
  }
  if (error) {
    return <p className="py-8 text-center text-sm text-danger">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>;
  }
  if (empty) {
    return (
      <p className="py-8 text-center text-sm text-muted">
        {filtered ? "ไม่พบข้อมูลที่ตรงกับเงื่อนไข" : "ยังไม่มีข้อมูล"}
      </p>
    );
  }
  return <>{children}</>;
}
