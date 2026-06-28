import { Suspense } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MyResultsView } from "@/components/results/MyResultsView";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>กำลังโหลดผลสอบ...</p>
    </div>
  );
}

export default function MyResultsPage() {
  return (
    <AuthGuard>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingFallback />}>
          <MyResultsView />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
