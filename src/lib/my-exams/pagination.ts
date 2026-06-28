import type { MyExamItem } from "@/lib/api/types";

export function mergeUniqueMyExamItems(
  existing: MyExamItem[],
  next: MyExamItem[]
): MyExamItem[] {
  const seen = new Set(existing.map((item) => item.id));
  const merged = [...existing];
  for (const item of next) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}
