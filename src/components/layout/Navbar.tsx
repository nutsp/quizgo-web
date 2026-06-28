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

function isNavLinkActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/my-results" && pathname.startsWith("/my-results")) return true;
  if (href === "/my-exams" && pathname.startsWith("/my-exams")) return true;
  return false;
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

  const displayName = getNavDisplayName(user);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <BrandLogo variant="text" size="md" href="/" />

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-2 py-1 text-sm font-medium transition-colors",
                    isActive
                      ? "font-semibold text-teal-700 after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-teal-600"
                      : "text-slate-500 hover:text-teal-700"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-teal-700 sm:inline-flex"
                aria-label="การแจ้งเตือน"
              >
                <Bell className="h-5 w-5" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
                      {user ? getInitials(displayName) : "?"}
                    </div>
                    <span className="hidden max-w-[120px] truncate md:inline">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                >
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild className="gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-slate-50 focus:text-slate-950">
                      <Link href="/admin">ผู้ดูแลระบบ</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-slate-50 focus:text-slate-950">
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      โปรไฟล์ของฉัน
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-slate-50 focus:text-slate-950">
                    <Link href="/my-exams">ข้อสอบของฉัน</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 focus:bg-slate-50 focus:text-slate-950">
                    <Link href="/my-results">ผลสอบของฉัน</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 rounded-xl px-3 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
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
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-teal-700"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-500 hover:text-teal-700"
                  )}
                >
                  ผู้ดูแลระบบ
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/profile" || pathname.startsWith("/me/profile")
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-teal-700"
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
                className="mt-2 block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
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
