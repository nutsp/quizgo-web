"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  Library,
  ScrollText,
  Settings,
  ShieldCheck,
  Tags,
  Upload,
  UserCog,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";
import { AdminSidebarGroup, type SidebarMenuItem } from "@/components/admin/layout/AdminSidebarGroup";

const overviewItems: SidebarMenuItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
];

const contentItems: SidebarMenuItem[] = [
  { href: "/admin/exam-tracks", label: "สายการสอบ", icon: FolderTree },
  { href: "/admin/exam-sets", label: "ชุดข้อสอบ", icon: ClipboardList },
  { href: "/admin/subjects", label: "วิชา", icon: BookOpen },
  {
    href: "/admin/questions",
    label: "คำถาม",
    icon: Library,
    match: (pathname) =>
      pathname.startsWith("/admin/questions") &&
      !pathname.startsWith("/admin/questions/import"),
  },
  { href: "/admin/question-tags", label: "กลุ่มคำถาม", icon: Tags },
  { href: "/admin/questions/import", label: "นำเข้าคำถาม", icon: Upload, exact: true },
];

const userItems: SidebarMenuItem[] = [
  { href: "/admin/users", label: "ผู้ใช้งาน", icon: Users },
  { href: "/admin/access-logs", label: "Access Logs", icon: ShieldCheck },
];

const systemItems: SidebarMenuItem[] = [
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex",
        className
      )}
    >
      <div className="border-b border-slate-200 px-5 py-5">
        <BrandLogo
          variant="text"
          size="sm"
          subtitle="ผู้ดูแลระบบ"
          href="/admin"
          onClick={onNavigate}
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <AdminSidebarGroup label="ภาพรวม" items={overviewItems} pathname={pathname} onNavigate={onNavigate} />
        <AdminSidebarGroup label="จัดการเนื้อหา" items={contentItems} pathname={pathname} onNavigate={onNavigate} />
        <AdminSidebarGroup label="จัดการผู้ใช้งาน" items={userItems} pathname={pathname} onNavigate={onNavigate} />
        <AdminSidebarGroup label="ระบบ" items={systemItems} pathname={pathname} onNavigate={onNavigate} />
      </nav>

      <div className="border-t border-slate-200 p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <UserCog className="h-4 w-4" />
          ← กลับไปหน้าผู้ใช้
        </Link>
      </div>
    </aside>
  );
}
