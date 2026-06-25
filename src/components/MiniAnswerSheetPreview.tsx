import type { ChoiceKey } from "@/data/questions";
import { cn } from "@/lib/utils";

const CHOICES: ChoiceKey[] = ["ก", "ข", "ค", "ง"];

export function MiniAnswerSheetPreview() {
  const sampleAnswers: (ChoiceKey | null)[] = [
    "ก", "ข", "ค", "ง", "ก", "ข", null, "ค", "ก", "ข",
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <p className="mb-3 text-xs font-semibold text-muted">กระดาษคำตอบ</p>
      <div className="space-y-1.5">
        {sampleAnswers.map((answer, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 text-[10px] font-semibold text-muted">{i + 1}</span>
            <div className="flex gap-1">
              {CHOICES.map((choice) => (
                <span
                  key={choice}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-medium",
                    answer === choice
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-muted/50"
                  )}
                >
                  {choice}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] text-muted">... 100 ข้อ</p>
    </div>
  );
}
