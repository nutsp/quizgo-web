import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthCallbackContent } from "@/components/auth/AuthCallbackContent";

function CallbackFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted">กำลังเข้าสู่ระบบ...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
