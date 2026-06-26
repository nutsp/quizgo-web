"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toUserFriendlyError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const registered = searchParams.get("registered") === "1";
  const oauthFailed = searchParams.get("error") === "oauth_failed";
  const redirectTo = searchParams.get("redirect") ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      await login(values.email, values.password);
      router.replace(redirectTo);
    } catch (error) {
      setApiError(toUserFriendlyError(error));
    }
  };

  const handleGoogleLogin = () => {
    const params = new URLSearchParams();
    if (redirectTo && redirectTo !== "/") {
      params.set("redirect", redirectTo);
    }
    const query = params.toString();
    window.location.href = `${API_BASE_URL}/auth/oauth/google/login${query ? `?${query}` : ""}`;
  };

  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
        <CardDescription>
          เข้าสู่ระบบเพื่อเริ่มฝึกสอบและบันทึกผลคะแนนของคุณ
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registered && (
          <div
            className="mb-4 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm text-success"
            role="status"
          >
            สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ
          </div>
        )}

        {oauthFailed && (
          <div
            className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
            role="alert"
          >
            เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="demo@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-11"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger">{errors.password.message}</p>
            )}
          </div>

          {apiError && (
            <div
              className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {apiError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังเข้าสู่ระบบ…
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-muted">หรือ</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            เข้าสู่ระบบด้วย Google
          </Button>

          <p className="text-center text-sm text-muted">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
