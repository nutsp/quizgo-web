"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/exam-tracks", label: "สายการสอบ", icon: FolderTree },
  { href: "/admin/exam-sets", label: "ชุดข้อสอบ", icon: ClipboardList },
  { href: "/admin/subjects", label: "หมวดวิชา", icon: BookOpen },
  { href: "/admin/questions", label: "คลังคำถาม", icon: Library },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full flex-col border-r border-border bg-surface", className)}>
      <div className="border-b border-border px-4 py-5">
        <Link href="/admin" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            ส
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">สนามสอบเสมือนจริง</p>
            <p className="text-xs text-muted">ผู้ดูแลระบบ</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-background hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-background hover:text-foreground"
        >
          ← กลับไปหน้าผู้ใช้
        </Link>
      </div>
    </aside>
  );
}
