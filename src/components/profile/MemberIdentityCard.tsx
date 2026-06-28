import { Shield, Trophy } from "lucide-react";
import { getMemberLevel } from "@/lib/member-level";

export type MemberIdentityCardProps = {
  displayName: string;
  email?: string;
  joinedAt?: string;
  completedExamSetCount: number;
  totalAttempts: number;
  averageScorePercent?: number;
  highestScorePercent?: number;
};

function getInitials(displayName: string, email?: string): string {
  const trimmed = displayName.trim();
  if (trimmed && trimmed !== email) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts[0].length >= 2) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return parts[0].slice(0, 1).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "QG";
}

export function MemberIdentityCard({
  displayName,
  email,
  completedExamSetCount,
}: MemberIdentityCardProps) {
  const memberLevel = getMemberLevel(completedExamSetCount);
  const initials = getInitials(displayName, email);
  const isNewUser = completedExamSetCount === 0;
  const isMaxLevel = memberLevel.nextLevel === null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-700 via-teal-600 to-sky-700 p-6 text-white shadow-xl shadow-teal-900/10 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />
      <Shield
        className="pointer-events-none absolute right-6 top-6 h-24 w-24 text-white/5"
        aria-hidden
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-teal-100">ระดับสมาชิก</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{displayName}</h2>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/10">
              <Trophy className="h-4 w-4 shrink-0" aria-hidden />
              ระดับ {memberLevel.level} · {memberLevel.name}
            </div>
          </div>
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold text-white ring-1 ring-white/20 sm:h-16 sm:w-16 sm:text-xl"
            aria-hidden
          >
            {initials}
          </div>
        </div>

        {isNewUser ? (
          <div className="mt-8 space-y-3">
            <p className="text-sm leading-relaxed text-teal-50">
              ระดับ 1 · ผู้เริ่มต้น
              <br />
              เริ่มทำข้อสอบ 3 ชุดแรกเพื่อไปสู่ระดับนักซ้อมสอบ
            </p>
            <div className="space-y-2">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-teal-50">0 / 3 ชุด</span>
                <span className="text-teal-100">0%</span>
              </div>
              <div className="h-3 rounded-full bg-white/20">
                <div className="h-3 w-0 rounded-full bg-white" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-teal-50">
              ทำข้อสอบแล้ว {memberLevel.completedExamSetCount} ชุด
            </p>

            {isMaxLevel ? (
              <p className="mt-4 text-sm leading-relaxed text-teal-50">
                คุณอยู่ระดับสูงสุดแล้ว
                <br />
                รักษาความสม่ำเสมอและทบทวนข้อที่ผิดอย่างต่อเนื่อง
              </p>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-teal-50">
                  อีก {memberLevel.remainingToNextLevel} ชุด เพื่อไปถึงระดับ{" "}
                  {memberLevel.nextLevel!.level} {memberLevel.nextLevel!.name}
                </p>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-teal-50">
                      {memberLevel.completedExamSetCount} /{" "}
                      {memberLevel.nextLevel!.requiredCompletedExamSets} ชุด
                    </span>
                    <span className="text-teal-100">{memberLevel.progressPercent}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/20">
                    <div
                      className="h-3 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${memberLevel.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
            <p className="text-xs text-teal-100">ทำข้อสอบทั้งหมด</p>
            <p className="mt-1 text-xl font-bold text-white">{totalAttempts} ครั้ง</p>
          </div>
          <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
            <p className="text-xs text-teal-100">คะแนนเฉลี่ย</p>
            <p className="mt-1 text-xl font-bold text-white">
              {averageScorePercent !== undefined ? formatPercent(averageScorePercent) : "—"}
            </p>
          </div>
          <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
            <p className="text-xs text-teal-100">คะแนนสูงสุด</p>
            <p className="mt-1 text-xl font-bold text-white">
              {highestScorePercent !== undefined ? formatPercent(highestScorePercent) : "—"}
            </p>
          </div>
        </div> */}

        {/* <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/my-results"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
          >
            ดูผลสอบของฉัน
          </Link>
          <Link
            href="/exams"
            className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            ไปคลังข้อสอบ
          </Link>
        </div> */}
      </div>
    </div>
  );
}
