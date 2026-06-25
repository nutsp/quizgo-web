import { Suspense } from "react";
import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { Loader2 } from "lucide-react";

function LoginFormFallback() {
  return (
    <div className="flex min-h-[320px] items-center justify-center text-muted">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <AuthBrandingPanel />

        <div className="mx-auto w-full max-w-md">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
