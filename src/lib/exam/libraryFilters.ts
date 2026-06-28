import type { ExamSet } from "@/lib/exam/format";

export type FilterGroupKey =
  | "examTypes"
  | "subjects"
  | "formats"
  | "difficulties"
  | "prices"
  | "statuses";

export type ExamLibraryFilters = Record<FilterGroupKey, string[]>;

export type ActiveFilterChip = {
  group: FilterGroupKey;
  value: string;
};

export const EMPTY_EXAM_LIBRARY_FILTERS: ExamLibraryFilters = {
  examTypes: [],
  subjects: [],
  formats: [],
  difficulties: [],
  prices: [],
  statuses: [],
};

const DIFFICULTY_TO_API: Record<string, string> = {
  ง่าย: "easy",
  กลาง: "medium",
  ยาก: "hard",
};

const PRICE_TO_ACCESS: Record<string, string> = {
  ฟรี: "free",
  Premium: "premium",
};

const FORMAT_TO_MODE: Record<string, string> = {
  "Mock Exam": "mock_exam",
  Practice: "practice",
};

function effectivePrice(examSet: ExamSet): number {
  return examSet.sale_price_amount ?? examSet.price_amount ?? 0;
}

export function toggleFilterValue(
  filters: ExamLibraryFilters,
  group: FilterGroupKey,
  value: string
): ExamLibraryFilters {
  const current = filters[group];
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  return { ...filters, [group]: next };
}

export function removeFilterChip(
  filters: ExamLibraryFilters,
  chip: ActiveFilterChip
): ExamLibraryFilters {
  return {
    ...filters,
    [chip.group]: filters[chip.group].filter((item) => item !== chip.value),
  };
}

export function getActiveFilterChips(filters: ExamLibraryFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  (Object.keys(filters) as FilterGroupKey[]).forEach((group) => {
    filters[group].forEach((value) => {
      chips.push({ group, value });
    });
  });
  return chips;
}

export function hasActiveFilters(
  filters: ExamLibraryFilters,
  searchQuery = ""
): boolean {
  return (
    searchQuery.trim().length > 0 ||
    getActiveFilterChips(filters).length > 0
  );
}

export function buildExamSetsApiParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: ExamLibraryFilters
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
  };

  const query = searchQuery.trim();
  if (query) {
    params.q = query;
  }

  if (filters.difficulties.length === 1) {
    const difficulty = DIFFICULTY_TO_API[filters.difficulties[0]];
    if (difficulty) params.difficulty = difficulty;
  }

  if (filters.prices.length === 1) {
    const accessType = PRICE_TO_ACCESS[filters.prices[0]];
    if (accessType) params.access_type = accessType;
  }

  if (filters.formats.length === 1) {
    const mode = FORMAT_TO_MODE[filters.formats[0]];
    if (mode) params.mode = mode;
  }

  return params;
}

function matchesExamType(examSet: ExamSet, selected: string[]): boolean {
  if (selected.length === 0) return true;
  const trackName = examSet.exam_track?.name ?? "";
  const trackCode = examSet.exam_track?.code ?? "";
  return selected.some(
    (type) =>
      trackName.includes(type) ||
      type.includes(trackName) ||
      trackCode.toLowerCase().includes(type.toLowerCase())
  );
}

function matchesDifficulty(examSet: ExamSet, selected: string[]): boolean {
  if (selected.length === 0) return true;
  const labelMap: Record<string, ExamSet["difficulty"]> = {
    ง่าย: "easy",
    กลาง: "medium",
    ยาก: "hard",
  };
  const allowed = new Set(
    selected.map((item) => labelMap[item]).filter(Boolean)
  );
  return allowed.has(examSet.difficulty);
}

function matchesPrice(examSet: ExamSet, selected: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.some((price) => {
    if (price === "ฟรี") return examSet.access_type === "free";
    if (price === "Premium") return examSet.access_type === "premium";
    return false;
  });
}

function matchesFormat(examSet: ExamSet, selected: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.some((format) => {
    const mode = FORMAT_TO_MODE[format];
    if (mode) return examSet.mode === mode;
    return examSet.title.includes(format) || examSet.description.includes(format);
  });
}

export function applyClientExamSetFilters(
  examSets: ExamSet[],
  filters: ExamLibraryFilters,
  trackCode?: string | null
): ExamSet[] {
  return examSets.filter((examSet) => {
    if (trackCode && examSet.exam_track?.code !== trackCode) {
      return false;
    }
    if (!matchesExamType(examSet, filters.examTypes)) return false;
    if (!matchesDifficulty(examSet, filters.difficulties)) return false;
    if (!matchesPrice(examSet, filters.prices)) return false;
    if (!matchesFormat(examSet, filters.formats)) return false;
    return true;
  });
}

export function sortExamSets(examSets: ExamSet[], sort: string): ExamSet[] {
  const items = [...examSets];

  switch (sort) {
    case "popular":
      return items.sort(
        (a, b) => (b.attempt_count ?? 0) - (a.attempt_count ?? 0)
      );
    case "price-low":
      return items.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-high":
      return items.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "latest":
      return items;
    case "recommended":
    default:
      return items.sort((a, b) => {
        const featuredDiff = Number(b.is_featured ?? false) - Number(a.is_featured ?? false);
        if (featuredDiff !== 0) return featuredDiff;
        return (b.attempt_count ?? 0) - (a.attempt_count ?? 0);
      });
  }
}
