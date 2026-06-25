"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardList, Home, Target, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const guestTabs = [
  { href: "/", label: "หน้าแรก", icon: Home },
  { href: "/exams", label: "ข้อสอบ", icon: BookOpen },
  { href: "#", label: "แผนฝึก", icon: Target },
  { href: "/login", label: "เข้าสู่ระบบ", icon: User },
];

const authTabs = [
  { href: "/", label: "หน้าแรก", icon: Home },
  { href: "/exams", label: "ข้อสอบ", icon: BookOpen },
  { href: "#", label: "แผนฝึก", icon: Target },
  { href: "/exams/demo/result", label: "ผลสอบ", icon: ClipboardList },
  { href: "#", label: "โปรไฟล์", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isExamTaking = pathname.includes("/take");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isExamTaking || isAuthPage) return null;

  const tabs = isAuthenticated ? authTabs : guestTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href) && tab.href !== "#";

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
