export type ExamSetDifficulty = "easy" | "medium" | "hard";
export type ExamSetAccessType = "free" | "paid" | "premium" | "private";
export type ExamSetMode = "practice" | "mock_exam";

export type ExamSetAccess = {
  can_start: boolean;
  reason?:
    | "LOGIN_REQUIRED"
    | "ACCESS_REQUIRED"
    | "PREMIUM_REQUIRED"
    | "ACCESS_REQUIRED_OR_PREMIUM"
    | "PRIVATE_EXAM_ACCESS_REQUIRED"
    | "EXAM_NOT_AVAILABLE"
    | null;
  has_exam_set_access: boolean;
  has_premium: boolean;
  available_options?: Array<"single_purchase" | "premium">;
};

export type ExamSet = {
  id?: string;
  code: string;
  title: string;
  description: string;
  cover_image_url?: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  difficulty: ExamSetDifficulty;
  access_type: ExamSetAccessType;
  allow_single_purchase: boolean;
  price_amount: number;
  sale_price_amount?: number | null;
  original_price_amount?: number | null;
  currency: string;
  mode: ExamSetMode;
  is_official: boolean;
  is_featured?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  attempt_count?: number | null;
  purchase_count?: number | null;
  completed_count?: number | null;
  exam_track?: {
    code: string;
    name: string;
  };
  access?: ExamSetAccess;
};

export type ExamSetPriceBadgeVariant =
  | "free"
  | "premium"
  | "discount"
  | "secondary"
  | "unlocked";

export type ExamSetPriceDisplay = {
  badgeLabel: string;
  badgeVariant: ExamSetPriceBadgeVariant;
  primaryPrice: string;
  originalPrice?: string;
  discountPercent?: number;
  savingsText?: string;
  secondaryText?: string;
};

export type ExamSetCommerceBadgeVariant =
  | "discount"
  | "unlocked"
  | "premium"
  | "free"
  | "paid";

export type ExamSetCommerceSecondaryBadgeVariant =
  | "popular"
  | "featured"
  | "new"
  | "single_purchase";

export type ExamSetCommercePriceTone = "free" | "paid" | "premium" | "unlocked";

export type ExamSetMainBadge = {
  label: string;
  variant: ExamSetCommerceBadgeVariant;
};

export type ExamSetSecondaryBadge = {
  label: string;
  variant: ExamSetCommerceSecondaryBadgeVariant;
};

export type ExamSetPriceFooterType =
  | "unlocked"
  | "free"
  | "premium"
  | "premium_single"
  | "premium_single_discount"
  | "premium_active"
  | "premium_unlocked"
  | "discount"
  | "paid";

export type ExamSetPriceFooterDisplay = {
  type: ExamSetPriceFooterType;
  title: string;
  originalPrice?: string;
  priceLineCurrent?: string;
  priceLineOriginal?: string;
  subtitle?: string;
  subtitleEmphasis?: boolean;
  titleLarge?: boolean;
  titleClassName?: string;
};

export type ExamSetCommerceDisplay = {
  mainBadge: ExamSetMainBadge | null;
  secondaryBadge: ExamSetSecondaryBadge | null;
  priceFooter: ExamSetPriceFooterDisplay | null;
  socialProofLabel?: string;
  /** @deprecated use priceFooter.title */
  priceLabel: string;
  /** @deprecated use priceFooter */
  priceTone: ExamSetCommercePriceTone;
  /** @deprecated use mainBadge.label */
  mainBadgeLabel: string | null;
  /** @deprecated use mainBadge.variant */
  mainBadgeVariant: ExamSetCommerceBadgeVariant | null;
  /** @deprecated use secondaryBadge.label */
  secondaryBadgeLabel: string | null;
  /** @deprecated use secondaryBadge.variant */
  secondaryBadgeVariant: ExamSetCommerceSecondaryBadgeVariant | null;
  /** @deprecated use priceFooter.originalPrice */
  originalPriceLabel?: string;
  /** @deprecated use priceFooter */
  discountPercent?: number | null;
  /** @deprecated use priceFooter.subtitle */
  savingLabel?: string;
};

export const COMMERCE_MAIN_BADGE_CLASS: Record<ExamSetCommerceBadgeVariant, string> = {
  discount: "bg-amber-100 text-amber-800",
  unlocked: "bg-teal-100 text-teal-800",
  premium: "bg-violet-100 text-violet-800",
  free: "bg-teal-100 text-teal-700",
  paid: "bg-blue-100 text-blue-800",
};

export const COMMERCE_SECONDARY_BADGE_CLASS: Record<
  ExamSetCommerceSecondaryBadgeVariant,
  string
> = {
  popular: "bg-rose-50 text-rose-700",
  featured: "bg-slate-100 text-slate-700",
  new: "bg-sky-100 text-sky-700",
  single_purchase: "bg-teal-100 text-teal-800",
};

export const COMMERCE_BADGE_BASE_CLASS =
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-bold shadow-sm";

export const DIFFICULTY_LABELS: Record<ExamSetDifficulty, string> = {
  easy: "ง่าย",
  medium: "กลาง",
  hard: "ยาก",
};

export const MODE_LABELS: Record<ExamSetMode, string> = {
  practice: "ฝึกทำข้อสอบ",
  mock_exam: "จำลองสนามสอบ",
};

export const ACCESS_LABELS: Record<ExamSetAccessType, string> = {
  free: "ฟรี",
  paid: "ซื้อรายชุด",
  premium: "Premium",
  private: "เฉพาะผู้ได้รับสิทธิ์",
};

export function accessBadgeLabel(examSet: Pick<ExamSet, "access_type" | "price_amount" | "currency" | "access">): string {
  if (examSet.access?.has_exam_set_access || (examSet.access_type === "premium" && examSet.access?.has_premium)) {
    return "ปลดล็อกแล้ว";
  }
  if (examSet.access_type === "free") return "ฟรี";
  if (examSet.access_type === "paid") {
    return `${Math.round(examSet.price_amount)} บาท`;
  }
  return "Premium";
}

export function accessBadgeVariant(
  examSet: Pick<ExamSet, "access_type" | "access">
): "free" | "premium" | "secondary" {
  if (examSet.access?.has_exam_set_access || (examSet.access_type === "premium" && examSet.access?.has_premium)) {
    return "secondary";
  }
  if (examSet.access_type === "free") return "free";
  if (examSet.access_type === "paid") return "secondary";
  return "premium";
}

export function formatBaht(amount: number, currency = "THB"): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

export function getDiscountPercent(
  priceAmount?: number | null,
  originalPriceAmount?: number | null
): number | null {
  if (priceAmount == null || originalPriceAmount == null) return null;
  if (originalPriceAmount <= priceAmount) return null;
  return Math.round(((originalPriceAmount - priceAmount) / originalPriceAmount) * 100);
}

function resolveExamSetPricing(examSet: Pick<
  ExamSet,
  "price_amount" | "sale_price_amount" | "original_price_amount"
>): {
  original: number;
  current: number;
  discountPercent: number | null;
} {
  const listOriginal =
    examSet.original_price_amount != null && examSet.original_price_amount > examSet.price_amount
      ? examSet.original_price_amount
      : examSet.price_amount;
  const sale = examSet.sale_price_amount;
  const hasSaleDiscount = sale != null && sale < listOriginal;
  const current = hasSaleDiscount ? sale! : examSet.price_amount;
  const original = hasSaleDiscount ? listOriginal : examSet.original_price_amount ?? listOriginal;
  const discountPercent =
    getDiscountPercent(current, original) ??
    getDiscountPercent(examSet.price_amount, examSet.original_price_amount);

  return {
    original,
    current,
    discountPercent: discountPercent != null && discountPercent > 0 ? discountPercent : null,
  };
}

function getSocialProofLabel(
  examSet: Pick<ExamSet, "attempt_count" | "completed_count" | "purchase_count">
): string | undefined {
  if (examSet.attempt_count != null && examSet.attempt_count > 0) {
    return `ทำแล้ว ${formatNumber(examSet.attempt_count)} ครั้ง`;
  }
  if (examSet.completed_count != null && examSet.completed_count > 0) {
    return `ทำแล้ว ${formatNumber(examSet.completed_count)} ครั้ง`;
  }
  if (examSet.purchase_count != null && examSet.purchase_count > 0) {
    return `ขายแล้ว ${formatNumber(examSet.purchase_count)} ชุด`;
  }
  return undefined;
}

export function getExamSetSecondaryBadge(examSet: ExamSet): ExamSetSecondaryBadge | null {
  if (examSet.is_popular) {
    return { label: "ยอดนิยม", variant: "popular" };
  }
  if (examSet.is_featured) {
    return { label: "แนะนำ", variant: "featured" };
  }
  if (examSet.is_new) {
    return { label: "ใหม่", variant: "new" };
  }
  return null;
}

export function canBuySingleExamSet(
  examSet: Pick<ExamSet, "access_type" | "allow_single_purchase">
): boolean {
  return (
    examSet.access_type === "paid" ||
    (examSet.access_type === "premium" && examSet.allow_single_purchase)
  );
}

export function canAccessWithPremium(examSet: Pick<ExamSet, "access_type">): boolean {
  return examSet.access_type === "premium";
}

export function getExamSetMainBadge(examSet: ExamSet): ExamSetMainBadge | null {
  if (examSet.access?.can_start && examSet.access_type === "paid") {
    return { label: "ปลดล็อกแล้ว", variant: "unlocked" };
  }

  if (examSet.access_type === "premium") {
    return { label: "Premium", variant: "premium" };
  }

  const { discountPercent } = resolveExamSetPricing(examSet);
  if (discountPercent != null && examSet.access_type === "paid") {
    return { label: `ลด ${discountPercent}%`, variant: "discount" };
  }

  if (examSet.access_type === "free") {
    return { label: "ฟรี", variant: "free" };
  }

  if (examSet.access_type === "paid") {
    return { label: "ซื้อรายชุด", variant: "paid" };
  }

  if (examSet.access_type === "private") {
    return { label: "เฉพาะผู้ได้รับสิทธิ์", variant: "premium" };
  }

  return null;
}

export function getExamSetSecondaryBadgeForAccess(examSet: ExamSet): ExamSetSecondaryBadge | null {
  if (
    examSet.access_type === "premium" &&
    examSet.allow_single_purchase &&
    examSet.price_amount > 0
  ) {
    return { label: "ซื้อแยกได้", variant: "single_purchase" };
  }
  return getExamSetSecondaryBadge(examSet);
}

export function getExamSetPriceFooterDisplay(
  examSet: ExamSet
): ExamSetPriceFooterDisplay | null {
  const { original, current, discountPercent } = resolveExamSetPricing(examSet);

  if (examSet.access_type === "free") {
    return {
      type: "free",
      title: "เริ่มได้ฟรี",
      subtitle: "ไม่ต้องปลดล็อก",
      titleClassName: "text-xl font-bold text-teal-700",
    };
  }

  if (examSet.access_type === "paid") {
    if (examSet.access?.has_exam_set_access) {
      return {
        type: "unlocked",
        title: "พร้อมเริ่มทำข้อสอบ",
        subtitle: "ปลดล็อกชุดนี้แล้ว",
        titleClassName: "text-xl font-bold text-teal-700",
      };
    }

    if (discountPercent != null) {
      return {
        type: "discount",
        title: formatBaht(current, examSet.currency),
        originalPrice: formatBaht(original, examSet.currency),
        subtitle: `ประหยัด ${discountPercent}%`,
        subtitleEmphasis: true,
        titleLarge: true,
        titleClassName: "text-2xl font-extrabold text-slate-950",
      };
    }

    return {
      type: "paid",
      title: formatBaht(current, examSet.currency),
      subtitle: "ซื้อรายชุด",
      titleLarge: true,
      titleClassName: "text-2xl font-extrabold text-slate-950",
    };
  }

  if (examSet.access_type === "premium") {
    if (examSet.access?.can_start) {
      return {
        type: "premium_active",
        title: "พร้อมเริ่มทำข้อสอบ",
        subtitle: examSet.access?.has_premium
          ? "ใช้งานได้ด้วย Premium"
          : "ปลดล็อกชุดนี้แล้ว",
        titleClassName: "text-xl font-bold text-teal-700",
      };
    }

    if (examSet.allow_single_purchase && examSet.price_amount > 0) {
      if (discountPercent != null) {
        return {
          type: "premium_single_discount",
          title: "รวมใน Premium",
          priceLineCurrent: formatBaht(current, examSet.currency),
          priceLineOriginal: formatBaht(original, examSet.currency),
          subtitle: `ประหยัด ${discountPercent}%`,
          subtitleEmphasis: true,
          titleClassName: "text-lg font-bold text-slate-950",
        };
      }

      return {
        type: "premium_single",
        title: "รวมใน Premium",
        subtitle: `หรือซื้อแยก ${formatBaht(current, examSet.currency)}`,
        titleClassName: "text-lg font-bold text-slate-950",
      };
    }

    return {
      type: "premium",
      title: "รวมใน Premium",
      subtitle: "สำหรับสมาชิก Premium",
      titleClassName: "text-lg font-bold text-slate-950",
    };
  }

  if (examSet.access_type === "private" && examSet.access?.has_exam_set_access) {
    return {
      type: "unlocked",
      title: "ได้รับสิทธิ์แล้ว",
      subtitle: "พร้อมเริ่มทำข้อสอบ",
      titleClassName: "text-xl font-bold text-teal-700",
    };
  }

  return null;
}

function mapFooterToLegacyFields(
  footer: ExamSetPriceFooterDisplay | null
): Pick<
  ExamSetCommerceDisplay,
  "priceLabel" | "priceTone" | "originalPriceLabel" | "discountPercent" | "savingLabel"
> {
  if (!footer) {
    return { priceLabel: "", priceTone: "paid" };
  }

  const priceToneMap: Record<ExamSetPriceFooterType, ExamSetCommercePriceTone> = {
    unlocked: "unlocked",
    free: "free",
    premium: "premium",
    premium_single: "premium",
    premium_single_discount: "premium",
    premium_active: "premium",
    premium_unlocked: "unlocked",
    discount: "paid",
    paid: "paid",
  };

  return {
    priceLabel: footer.title,
    priceTone: priceToneMap[footer.type],
    originalPriceLabel: footer.originalPrice,
    discountPercent:
      footer.type === "discount" && footer.subtitle
        ? Number.parseInt(footer.subtitle.replace(/\D/g, ""), 10) || null
        : null,
    savingLabel: footer.subtitle,
  };
}

export function getExamSetCommerceDisplay(examSet: ExamSet): ExamSetCommerceDisplay {
  const mainBadge = getExamSetMainBadge(examSet);
  const secondaryBadge = getExamSetSecondaryBadgeForAccess(examSet);
  const priceFooter = getExamSetPriceFooterDisplay(examSet);
  const legacy = mapFooterToLegacyFields(priceFooter);

  return {
    mainBadge,
    secondaryBadge,
    priceFooter,
    socialProofLabel: getSocialProofLabel(examSet),
    mainBadgeLabel: mainBadge?.label ?? null,
    mainBadgeVariant: mainBadge?.variant ?? null,
    secondaryBadgeLabel: secondaryBadge?.label ?? null,
    secondaryBadgeVariant: secondaryBadge?.variant ?? null,
    ...legacy,
  };
}

export function getEffectivePriceAmount(
  examSet: Pick<ExamSet, "price_amount" | "sale_price_amount" | "original_price_amount">
): number {
  const original =
    examSet.original_price_amount != null && examSet.original_price_amount > examSet.price_amount
      ? examSet.original_price_amount
      : examSet.price_amount;
  const sale = examSet.sale_price_amount;
  if (sale != null && sale < original) {
    return sale;
  }
  return examSet.price_amount;
}

export function getExamSetPriceDisplay(examSet: ExamSet): ExamSetPriceDisplay {
  const display = getExamSetCommerceDisplay(examSet);
  const badgeVariantMap: Record<ExamSetCommerceBadgeVariant, ExamSetPriceBadgeVariant> = {
    discount: "discount",
    unlocked: "unlocked",
    premium: "premium",
    free: "free",
    paid: "secondary",
  };

  return {
    badgeLabel: display.mainBadgeLabel ?? "",
    badgeVariant: display.mainBadgeVariant
      ? badgeVariantMap[display.mainBadgeVariant]
      : "secondary",
    primaryPrice: display.priceLabel,
    originalPrice: display.originalPriceLabel,
    discountPercent: display.discountPercent ?? undefined,
    savingsText: display.savingLabel,
    secondaryText: display.priceTone === "premium" && display.savingLabel
      ? display.savingLabel
      : undefined,
  };
}

export function formatExamPrice(examSet: Pick<
  ExamSet,
  "access_type" | "price_amount" | "sale_price_amount" | "original_price_amount" | "currency"
>): { primary: string; secondary?: string } {
  if (examSet.access_type === "free") {
    return { primary: "ฟรี" };
  }

  if (examSet.access_type === "premium" && examSet.price_amount <= 0) {
    return { primary: "Premium" };
  }

  const original =
    examSet.original_price_amount != null && examSet.original_price_amount > examSet.price_amount
      ? examSet.original_price_amount
      : examSet.price_amount;
  const sale = examSet.sale_price_amount;
  if (sale != null && sale < original) {
    return {
      primary: formatBaht(sale, examSet.currency),
      secondary: `จากปกติ ${formatBaht(original, examSet.currency)}`,
    };
  }

  return { primary: formatBaht(examSet.price_amount, examSet.currency) };
}
