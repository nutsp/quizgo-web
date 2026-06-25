import { Suspense } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ExamResultView } from "@/components/ExamResultView";
import { Loader2 } from "lucide-react";

function ResultFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p>กำลังโหลดผลสอบ...</p>
    </div>
  );
}

export default function DemoResultPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<ResultFallback />}>
        <ExamResultView examSetCode="demo" />
      </Suspense>
    </AuthGuard>
  );
}
