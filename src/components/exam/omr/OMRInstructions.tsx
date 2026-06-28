"use client";

import { cn } from "@/lib/utils";

export type OMRInstructionsProps = {
  className?: string;
};

export function OMRInstructions({ className }: OMRInstructionsProps) {
  return (
    <div
      className={cn(
        "shrink-0 border-b border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-[10px] leading-relaxed text-[#64748B]",
        className
      )}
    >
      <p className="font-semibold text-[#0F172A]">คำชี้แจง</p>
      <ol className="mt-1 list-inside list-decimal space-y-0.5">
        <li>ให้เลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว</li>
        <li>กดค้างที่วงกลมเพื่อฝนคำตอบ</li>
        <li>สามารถเปลี่ยนคำตอบได้ก่อนส่งคำตอบ</li>
        <li>หากต้องการข้าม ให้กดไปข้อถัดไป</li>
      </ol>
    </div>
  );
}
