"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type SidebarMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  match?: (pathname: string) => boolean;
};

type AdminSidebarGroupProps = {
  label: string;
  items: SidebarMenuItem[];
  pathname: string;
  onNavigate?: () => void;
};

function isActive(pathname: string, item: SidebarMenuItem) {
  if (item.match) return item.match(pathname);
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.href);
}

export function AdminSidebarGroup({ label, items, pathname, onNavigate }: AdminSidebarGroupProps) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      {items.map((item) => {
        const active = isActive(pathname, item);
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
    </div>
  );
}
