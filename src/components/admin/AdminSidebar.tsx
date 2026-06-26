"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  Library,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/exam-tracks", label: "สายการสอบ", icon: FolderTree },
  { href: "/admin/exam-sets", label: "ชุดข้อสอบ", icon: ClipboardList },
  { href: "/admin/subjects", label: "หมวดวิชา", icon: BookOpen },
  { href: "/admin/questions", label: "คลังคำถาม", icon: Library },
  { href: "/admin/questions/import", label: "นำเข้าคำถาม", icon: Upload, exact: true },
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
        <Link href="/admin" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
            ส
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">สนามสอบเสมือนจริง</p>
            <p className="text-xs text-slate-500">ผู้ดูแลระบบ</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : item.href === "/admin/questions"
              ? pathname.startsWith(item.href) &&
                !pathname.startsWith("/admin/questions/import")
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-teal-700")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          ← กลับไปหน้าผู้ใช้
        </Link>
      </div>
    </aside>
  );
}
