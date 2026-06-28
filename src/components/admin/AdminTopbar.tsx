"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "แดชบอร์ดผู้ดูแล";
  if (pathname.startsWith("/admin/exam-tracks")) return "สายการสอบ";
  if (pathname.startsWith("/admin/exam-sets")) return "ชุดข้อสอบ";
  if (pathname.startsWith("/admin/subjects")) return "หมวดวิชา";
  if (pathname.startsWith("/admin/question-tags")) return "กลุ่มคำถาม";
  if (pathname.startsWith("/admin/questions/import")) return "นำเข้าคำถาม";
  if (pathname.startsWith("/admin/questions")) return "คลังคำถาม";
  return "ผู้ดูแลระบบ";
}

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onMenuClick}
          aria-label="เปิดเมนู"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="truncate text-sm font-semibold text-slate-900 lg:hidden">
          {pageTitle}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="hidden max-w-[200px] truncate text-sm text-slate-500 sm:inline">
          {user?.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={handleLogout}
        >
          ออกจากระบบ
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={handleLogout}
          aria-label="ออกจากระบบ"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
