import { MiniAnswerSheetPreview } from "@/components/MiniAnswerSheetPreview";
import { BookOpen } from "lucide-react";

interface AuthBrandingPanelProps {
  compact?: boolean;
}

export function AuthBrandingPanel({ compact = false }: AuthBrandingPanelProps) {
  return (
    <div className="flex flex-col justify-center space-y-6">
      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
        <BookOpen className="h-3.5 w-3.5" />
        แพลตฟอร์มจำลองสอบเสมือนจริง
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight text-foreground lg:text-4xl">
          สนามสอบเสมือนจริง
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted">
          จำลองสนามสอบจริง ฝนคำตอบ จับเวลา ตรวจคะแนน และวิเคราะห์ผลสอบ
        </p>
      </div>

      {!compact && (
        <div className="relative max-w-sm">
          <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
          <MiniAnswerSheetPreview />
        </div>
      )}
    </div>
  );
}
