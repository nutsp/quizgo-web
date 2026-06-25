"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">กำลังโหลด...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <ShieldOff className="mb-4 h-12 w-12 text-muted" />
        <h1 className="text-xl font-semibold text-foreground">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
        <p className="mt-2 text-muted">บัญชีของคุณไม่มีสิทธิ์ผู้ดูแลระบบ</p>
        <Button asChild className="mt-6">
          <Link href="/">กลับหน้าแรก</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
