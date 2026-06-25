"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type AdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
      <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="เปิดเมนู">
        <Menu className="h-5 w-5" />
      </Button>
      <span className="text-sm font-semibold text-foreground">แดชบอร์ดผู้ดูแล</span>
      <div className="flex items-center gap-2">
        <span className="max-w-[100px] truncate text-xs text-muted">{user?.display_name}</span>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="ออกจากระบบ">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export function AdminDesktopTopbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="hidden h-14 items-center justify-end border-b border-border bg-surface px-6 lg:flex">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">{user?.email}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          ออกจากระบบ
        </Button>
      </div>
    </header>
  );
}
