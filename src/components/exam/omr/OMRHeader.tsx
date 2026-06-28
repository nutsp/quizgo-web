"use client";

import { cn } from "@/lib/utils";

export type OMRHeaderProps = {
  examTitle: string;
  examSetCode?: string;
  candidateName?: string;
  candidateNo?: string;
  compact?: boolean;
  showCandidateInfo?: boolean;
  className?: string;
};

const MOCK_BOXES = Array.from({ length: 10 }, (_, i) => i);

export function OMRHeader({
  examTitle,
  examSetCode,
  candidateName,
  candidateNo,
  compact = false,
  showCandidateInfo = true,
  className,
}: OMRHeaderProps) {
  const hasCandidateNo = Boolean(candidateNo && candidateNo !== "-");

  return (
    <div
      className={cn(
        "shrink-0 border-b border-slate-300 text-slate-900",
        compact ? "px-3 py-2" : "px-3 py-3",
        className
      )}
    >
      <div className={cn("border-b border-slate-900 text-center", compact ? "pb-1.5" : "pb-2")}>
        <h2 className={cn("font-bold tracking-wide", compact ? "text-xs" : "text-sm")}>
          กระดาษคำตอบ
        </h2>
        <p
          className={cn(
            "mt-0.5 leading-snug text-slate-500",
            compact ? "text-[10px] line-clamp-2" : "text-[11px]"
          )}
        >
          {examTitle}
        </p>
      </div>

      <div
        className={cn(
          "space-y-1 font-mono leading-relaxed text-slate-900",
          compact ? "mt-1.5 text-[9px]" : "mt-2.5 text-[10px] sm:text-[11px]"
        )}
      >
        {showCandidateInfo && (
          <>
            <div className="flex gap-1">
              <span className="shrink-0 font-semibold">ชื่อผู้สอบ:</span>
              <span className="flex-1 border-b border-dotted border-slate-300">
                {candidateName?.trim() ? candidateName : "-"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
              <span className="shrink-0 font-semibold">เลขประจำตัวสอบ:</span>
              {hasCandidateNo ? (
                <span className="tracking-widest">{candidateNo}</span>
              ) : (
                <span className="inline-flex gap-0.5" aria-label="เลขประจำตัวสอบ">
                  {MOCK_BOXES.map((i) => (
                    <span
                      key={i}
                      className="inline-flex h-3.5 w-3 items-center justify-center border border-slate-900 text-[7px] text-slate-500"
                    >
                      □
                    </span>
                  ))}
                </span>
              )}
            </div>
          </>
        )}

        {examSetCode && (
          <div className="flex items-center gap-1">
            <span className="font-semibold">ชุดข้อสอบ:</span>
            <span className="inline-flex min-w-[1.25rem] items-center justify-center border border-slate-900 px-1 py-0.5 font-bold">
              {examSetCode}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
