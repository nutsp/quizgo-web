"use client";

import { useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ToastProvider } from "@/hooks/useToast";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AdminGuard>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50">
          <AdminSidebar />

          {drawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="ปิดเมนู"
                onClick={() => setDrawerOpen(false)}
              />
              <AdminSidebar
                className="absolute left-0 top-0 flex h-full w-72 shadow-xl"
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          )}

          <div className="min-h-screen lg:pl-72">
            <AdminTopbar onMenuClick={() => setDrawerOpen(true)} />
            <main className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </AdminGuard>
  );
}
