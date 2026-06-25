"use client";

import { useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminDesktopTopbar, AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/hooks/useToast";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AdminGuard>
      <ToastProvider>
        <div className="flex min-h-screen bg-background">
          <div className="hidden w-64 shrink-0 lg:block">
            <AdminSidebar className="fixed left-0 top-0 h-screen w-64" />
          </div>

          {drawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="ปิดเมนู"
                onClick={() => setDrawerOpen(false)}
              />
              <AdminSidebar
                className="absolute left-0 top-0 h-full w-64 shadow-xl"
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          )}

          <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
            <AdminTopbar onMenuClick={() => setDrawerOpen(true)} />
            <AdminDesktopTopbar />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </ToastProvider>
    </AdminGuard>
  );
}
