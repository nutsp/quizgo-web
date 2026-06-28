import {
  formatBaht,
  getEffectivePriceAmount,
  canBuySingleExamSet,
  canAccessWithPremium,
  type ExamSet,
} from "@/lib/exam/format";

export type ExamAccessCTA = {
  canStart: boolean;
  primaryLabel: string;
  primaryAction: "start" | "unlock" | "pricing" | "login";
  badge?: string;
  showUnlockedBadge: boolean;
  showPremiumBadge: boolean;
};

export type ExamDetailCTAAction =
  | "start_exam"
  | "unlock"
  | "pricing"
  | "login"
  | "unavailable"
  | "private_denied";

export type ExamDetailCTA = {
  label: string;
  action: ExamDetailCTAAction;
  href?: string;
};

export type ExamDetailAccessOption = {
  type: "start" | "unlock" | "premium";
  label: string;
  href?: string;
  description?: string;
  priceLabel?: string;
};

export type ExamAccessCardStatus = {
  headline: string;
  subtext?: string;
  variant:
    | "free"
    | "paid_locked"
    | "paid_unlocked"
    | "premium_locked"
    | "premium_dual"
    | "premium_active"
    | "premium_unlocked"
    | "private_granted"
    | "private_denied"
    | "unavailable";
};

function needsLogin(examSet: ExamSet, isAuthenticated: boolean): boolean {
  if (!isAuthenticated) return true;
  return examSet.access?.reason === "LOGIN_REQUIRED";
}

function hasSubmittedHistory(examSet: ExamSet): boolean {
  return !!examSet.user_activity?.has_submitted_attempts;
}

function pastResultHref(examSet: ExamSet): string | undefined {
  const attemptId = examSet.user_activity?.latest_submitted_attempt_id;
  if (!attemptId) return undefined;
  return `/exams/${examSet.code}/result?attempt_id=${attemptId}`;
}

function isPremiumLockedWithoutAccess(examSet: ExamSet): boolean {
  const access = examSet.access;
  if (!access || access.can_start) return false;
  return (
    access.reason === "PREMIUM_REQUIRED" ||
    access.reason === "ACCESS_REQUIRED_OR_PREMIUM"
  );
}

function unlockPriceLabel(examSet: ExamSet): string {
  return formatBaht(getEffectivePriceAmount(examSet), examSet.currency);
}

export function getExamDetailAccessOptions(examSet: ExamSet): ExamDetailAccessOption[] {
  const access = examSet.access;

  if (access?.can_start) {
    return [{ type: "start", label: "เริ่มทำข้อสอบ" }];
  }

  if (access?.reason === "EXAM_NOT_AVAILABLE") {
    return [];
  }

  if (access?.reason === "PRIVATE_EXAM_ACCESS_REQUIRED") {
    return [];
  }

  if (isPremiumLockedWithoutAccess(examSet)) {
    const options: ExamDetailAccessOption[] = [];
    if (examSet.allow_single_purchase) {
      options.push({
        type: "unlock",
        label: "ปลดล็อกชุดนี้",
        href: `/exams/${examSet.code}/unlock`,
        description: "เหมาะสำหรับคนที่ต้องการทำชุดนี้ชุดเดียว",
        priceLabel: unlockPriceLabel(examSet),
      });
    }
    options.push({
      type: "premium",
      label: "ต่ออายุ Premium",
      href: "/pricing",
      description: "เข้าถึงข้อสอบ Premium ทั้งหมด",
    });
    return options;
  }

  if (access?.reason === "ACCESS_REQUIRED") {
    return [
      {
        type: "unlock",
        label: `ปลดล็อกทันที ${unlockPriceLabel(examSet)}`,
        href: `/exams/${examSet.code}/unlock`,
      },
    ];
  }

  if (access?.reason === "PREMIUM_REQUIRED") {
    return [{ type: "premium", label: "สมัคร Premium", href: "/pricing" }];
  }

  if (access?.reason === "ACCESS_REQUIRED_OR_PREMIUM") {
    return [
      {
        type: "unlock",
        label: `ปลดล็อกชุดนี้ ${unlockPriceLabel(examSet)}`,
        href: `/exams/${examSet.code}/unlock`,
        description: "เหมาะสำหรับคนที่ต้องการทำชุดนี้ชุดเดียว",
        priceLabel: unlockPriceLabel(examSet),
      },
      {
        type: "premium",
        label: "สมัคร Premium",
        href: "/pricing",
        description: "เข้าถึงข้อสอบ Premium ทั้งหมด",
        priceLabel: "149 บาท / เดือน",
      },
    ];
  }

  if (examSet.access_type === "paid") {
    return [
      {
        type: "unlock",
        label: `ปลดล็อกทันที ${unlockPriceLabel(examSet)}`,
        href: `/exams/${examSet.code}/unlock`,
      },
    ];
  }

  if (examSet.access_type === "premium" && examSet.allow_single_purchase) {
    return [
      {
        type: "unlock",
        label: `ปลดล็อกชุดนี้ ${unlockPriceLabel(examSet)}`,
        href: `/exams/${examSet.code}/unlock`,
        description: "เหมาะสำหรับคนที่ต้องการทำชุดนี้ชุดเดียว",
        priceLabel: unlockPriceLabel(examSet),
      },
      {
        type: "premium",
        label: "สมัคร Premium",
        href: "/pricing",
        description: "เข้าถึงข้อสอบ Premium ทั้งหมด",
        priceLabel: "149 บาท / เดือน",
      },
    ];
  }

  if (examSet.access_type === "premium") {
    return [{ type: "premium", label: "สมัคร Premium", href: "/pricing" }];
  }

  return [{ type: "start", label: "เริ่มทำข้อสอบ" }];
}

export function getExamDetailCTA(
  examSet: ExamSet,
  isAuthenticated: boolean
): ExamDetailCTA {
  const access = examSet.access;

  if (access?.reason === "EXAM_NOT_AVAILABLE") {
    return { label: "ชุดข้อสอบยังไม่พร้อม", action: "unavailable" };
  }

  if (access?.reason === "PRIVATE_EXAM_ACCESS_REQUIRED") {
    return { label: "กลับไปคลังข้อสอบ", action: "private_denied", href: "/exams" };
  }

  if (access?.can_start) {
    if (needsLogin(examSet, isAuthenticated)) {
      return { label: "เริ่มทำข้อสอบ", action: "login" };
    }
    return { label: "เริ่มทำข้อสอบ", action: "start_exam" };
  }

  if (isPremiumLockedWithoutAccess(examSet)) {
    if (examSet.allow_single_purchase) {
      return {
        label: "ปลดล็อกชุดนี้",
        action: "unlock",
        href: `/exams/${examSet.code}/unlock`,
      };
    }
    return {
      label: "ต่ออายุ Premium",
      action: "pricing",
      href: "/pricing",
    };
  }

  const options = getExamDetailAccessOptions(examSet);
  const first = options[0];

  if (access?.reason === "ACCESS_REQUIRED" || first?.type === "unlock") {
    return {
      label: first?.label ?? `ปลดล็อกทันที ${unlockPriceLabel(examSet)}`,
      action: "unlock",
      href: first?.href ?? `/exams/${examSet.code}/unlock`,
    };
  }

  if (access?.reason === "PREMIUM_REQUIRED" || first?.type === "premium") {
    return {
      label: first?.label ?? "สมัคร Premium",
      action: "pricing",
      href: first?.href ?? "/pricing",
    };
  }

  if (access?.reason === "ACCESS_REQUIRED_OR_PREMIUM") {
    return {
      label: `ปลดล็อกชุดนี้ ${unlockPriceLabel(examSet)}`,
      action: "unlock",
      href: `/exams/${examSet.code}/unlock`,
    };
  }

  if (!isAuthenticated) {
    return { label: "เริ่มทำข้อสอบ", action: "login" };
  }

  return { label: "เริ่มทำข้อสอบ", action: "login" };
}

export function getExamAccessCardStatus(examSet: ExamSet): ExamAccessCardStatus {
  const access = examSet.access;

  if (access?.reason === "EXAM_NOT_AVAILABLE") {
    return {
      headline: "ชุดข้อสอบยังไม่พร้อม",
      subtext: "ชุดข้อสอบนี้ยังไม่พร้อมให้ใช้งาน",
      variant: "unavailable",
    };
  }

  if (access?.reason === "PRIVATE_EXAM_ACCESS_REQUIRED") {
    return {
      headline: "ไม่สามารถเข้าถึงชุดข้อสอบนี้ได้",
      subtext: "ชุดข้อสอบนี้เปิดให้เฉพาะผู้ได้รับสิทธิ์เท่านั้น",
      variant: "private_denied",
    };
  }

  if (examSet.access_type === "free") {
    return {
      headline: "เริ่มได้ฟรี",
      subtext: "ไม่ต้องปลดล็อก",
      variant: "free",
    };
  }

  if (access?.can_start && examSet.access_type === "paid") {
    return {
      headline: "ปลดล็อกแล้ว",
      subtext: "คุณสามารถเริ่มทำข้อสอบชุดนี้ได้",
      variant: "paid_unlocked",
    };
  }

  if (examSet.access_type === "paid") {
    return {
      headline: "ปลดล็อกชุดข้อสอบ",
      variant: "paid_locked",
    };
  }

  if (access?.can_start && access.has_premium) {
    return {
      headline: "ใช้งานได้ด้วย Premium",
      subtext: "คุณสามารถเริ่มทำข้อสอบชุดนี้ได้",
      variant: "premium_active",
    };
  }

  if (access?.can_start && access.has_exam_set_access && examSet.allow_single_purchase) {
    return {
      headline: "ปลดล็อกชุดนี้แล้ว",
      subtext: "คุณสามารถเริ่มทำข้อสอบชุดนี้ได้",
      variant: "premium_unlocked",
    };
  }

  if (access?.reason === "ACCESS_REQUIRED_OR_PREMIUM") {
    return {
      headline: "เลือกวิธีปลดล็อก",
      subtext: "ซื้อเฉพาะชุดนี้ หรือสมัคร Premium",
      variant: "premium_dual",
    };
  }

  if (examSet.access_type === "private" && access?.has_exam_set_access) {
    return {
      headline: "เฉพาะผู้ได้รับสิทธิ์",
      subtext: "คุณได้รับสิทธิ์เข้าถึงชุดข้อสอบนี้แล้ว",
      variant: "private_granted",
    };
  }

  if (examSet.access_type === "premium") {
    if (isPremiumLockedWithoutAccess(examSet) && hasSubmittedHistory(examSet)) {
      return {
        headline: "Premium หมดอายุแล้ว",
        subtext: "คุณยังดูผลสอบและเฉลยจากครั้งก่อนได้ แต่ไม่สามารถเริ่มทำชุดใหม่ได้",
        variant: "premium_locked",
      };
    }
    return {
      headline: "สำหรับสมาชิก Premium",
      subtext: "เข้าถึงชุดข้อสอบ Premium ทั้งหมด",
      variant: "premium_locked",
    };
  }

  return {
    headline: "ปลดล็อกชุดข้อสอบ",
    variant: "paid_locked",
  };
}

export function getExamAccessCTA(examSet: ExamSet, isAuthenticated: boolean): ExamAccessCTA {
  const detail = getExamDetailCTA(examSet, isAuthenticated);
  const access = examSet.access;
  const canStart = detail.action === "start_exam";

  const primaryActionMap: Record<
    ExamDetailCTAAction,
    ExamAccessCTA["primaryAction"]
  > = {
    start_exam: "start",
    unlock: "unlock",
    pricing: "pricing",
    login: "login",
    unavailable: "unlock",
    private_denied: "unlock",
  };

  return {
    canStart,
    primaryLabel: detail.label,
    primaryAction: primaryActionMap[detail.action],
    showUnlockedBadge:
      (examSet.access_type === "paid" || examSet.access_type === "premium") &&
      !!access?.has_exam_set_access &&
      !access?.has_premium,
    showPremiumBadge:
      examSet.access_type === "premium" &&
      (!access?.has_premium || detail.action === "pricing"),
    badge:
      examSet.access_type === "private" && access?.has_exam_set_access
        ? "เฉพาะผู้ได้รับสิทธิ์"
        : examSet.access_type === "paid" && access?.has_exam_set_access
          ? "ปลดล็อกแล้ว"
          : examSet.access_type === "premium" &&
              examSet.allow_single_purchase &&
              access?.has_exam_set_access
            ? "ปลดล็อกแล้ว"
            : undefined,
  };
}

export { canBuySingleExamSet, canAccessWithPremium, pastResultHref, hasSubmittedHistory };
