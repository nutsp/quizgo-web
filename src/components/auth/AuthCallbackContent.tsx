"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function safeRedirect(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/exams";
  }
  return path;
}

export function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const redirect = safeRedirect(searchParams.get("redirect"));

    if (!token) {
      setError("ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await loginWithToken(token);
        if (!cancelled) {
          router.replace(redirect);
        }
      } catch {
        if (!cancelled) {
          setError("ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loginWithToken, router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="mb-6 text-sm text-danger" role="alert">
          {error}
        </p>
        <Button asChild variant="outline">
          <Link href="/login">กลับไปหน้าเข้าสู่ระบบ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted">กำลังเข้าสู่ระบบ...</p>
    </div>
  );
}
