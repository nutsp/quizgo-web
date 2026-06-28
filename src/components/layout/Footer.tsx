"use client";

import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND } from "@/config/brand";

export function Footer() {
  const pathname = usePathname();

  const isExamTaking = pathname.includes("/take");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/auth/callback";
  const isAdminPage = pathname.startsWith("/admin");

  if (isExamTaking || isAuthPage || isAdminPage) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="space-y-2">
          <BrandLogo variant="text" size="sm" href="/" />
          <p className="text-sm text-muted">{BRAND.tagline}</p>
        </div>
        <p className="text-sm text-muted">
          © {year} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
