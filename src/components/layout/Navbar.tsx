"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const guestLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/exams", label: "คลังข้อสอบ" },
  { href: "/pricing", label: "แพ็กเกจ" },
];

const authLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/exams", label: "คลังข้อสอบ" },
  { href: "/my-exams", label: "ข้อสอบของฉัน" },
  { href: "/my-results", label: "ผลสอบของฉัน" },
  { href: "/pricing", label: "แพ็กเกจ" },
];

function getNavDisplayName(user: { display_name?: string } | null): string {
  const name = user?.display_name?.trim();
  return name || "บัญชีของฉัน";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isExamTaking = pathname.includes("/take");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/auth/callback";
  const isAdminPage = pathname.startsWith("/admin");

  if (isExamTaking || isAuthPage || isAdminPage) return null;

  const navLinks = isAuthenticated ? authLinks : guestLinks;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <BrandLogo variant="text" size="md" href="/" />

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-background hover:text-primary",
                  pathname === link.href ||
                  (link.href === "/my-results" && pathname.startsWith("/my-results")) ||
                  (link.href === "/my-exams" && pathname.startsWith("/my-exams"))
                    ? "bg-primary/10 text-primary"
                    : "text-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                aria-label="การแจ้งเตือน"
              >
                <Bell className="h-5 w-5 text-muted" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden items-center gap-2 rounded-xl border border-border bg-background px-2 py-1.5 text-sm transition-colors hover:bg-background/80 sm:flex"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {user ? getInitials(getNavDisplayName(user)) : "?"}
                    </div>
                    <span className="max-w-[120px] truncate font-medium text-foreground">
                      {getNavDisplayName(user)}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      โปรไฟล์ของฉัน
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-exams">ข้อสอบของฉัน</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-results">ผลสอบของฉัน</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">แดชบอร์ดผู้ดูแล</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-danger focus:text-danger">
                    <LogOut className="h-4 w-4" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/register">สมัครสมาชิก</Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="เมนู"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium",
                pathname === link.href ||
                  (link.href === "/my-results" && pathname.startsWith("/my-results")) ||
                  (link.href === "/my-exams" && pathname.startsWith("/my-exams"))
                  ? "bg-primary/10 text-primary"
                  : "text-muted"
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === "/profile" || pathname.startsWith("/me/profile")
                    ? "bg-primary/10 text-primary"
                    : "text-muted"
                )}
              >
                โปรไฟล์ของฉัน
              </Link>
              <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="mt-2 block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger"
            >
              ออกจากระบบ
            </button>
            </>
          ) : (
            <div className="mt-3 flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  เข้าสู่ระบบ
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  สมัครสมาชิก
                </Link>
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
