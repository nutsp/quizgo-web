import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="ตั้งค่าระบบผู้ดูแล (MVP)"
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          หน้านี้เป็นที่สำหรับการตั้งค่าระบบในอนาคต เช่น การกำหนดค่าทั่วไป การแจ้งเตือน หรือนโยบายความปลอดภัย
        </p>
      </div>
    </div>
  );
}
