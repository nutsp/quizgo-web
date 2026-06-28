import type { MyExamItem } from "@/lib/api/types";

export type MyExamTab =
  | "all"
  | "in_progress"
  | "completed"
  | "unlocked"
  | "special_grant";

export const MY_EXAM_TABS: { id: MyExamTab; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "in_progress", label: "กำลังทำ" },
  { id: "completed", label: "เคยทำแล้ว" },
  { id: "unlocked", label: "ปลดล็อกแล้ว" },
  { id: "special_grant", label: "ได้รับสิทธิ์พิเศษ" },
];

export function filterMyExamItems(items: MyExamItem[], tab: MyExamTab): MyExamItem[] {
  if (tab === "all") return items;
  return items.filter((item) => matchesMyExamTab(item, tab));
}

export function matchesMyExamTab(item: MyExamItem, tab: MyExamTab): boolean {
  switch (tab) {
    case "in_progress":
      return item.latest_attempt?.status === "in_progress";
    case "completed":
      return (
        item.latest_attempt?.status === "submitted" ||
        item.latest_attempt?.status === "timeout"
      );
    case "unlocked":
      return (
        item.access_source === "single_purchase" ||
        item.access_source === "manual_grant"
      );
    case "special_grant":
      return (
        item.access_source === "private_grant" ||
        item.access_source === "manual_grant"
      );
    default:
      return true;
  }
}

export function countMyExamItemsByTab(items: MyExamItem[], tab: MyExamTab): number {
  return filterMyExamItems(items, tab).length;
}

export function hasSubmittedResults(items: MyExamItem[]): boolean {
  return items.some(
    (item) =>
      item.latest_attempt?.status === "submitted" || item.latest_attempt?.status === "timeout"
  );
}

export function getMyExamSourceBadge(item: MyExamItem): string {
  if (item.source_label) {
    return item.source_label.replace("\n", " · ");
  }
  switch (item.access_source) {
    case "single_purchase":
      return "ซื้อรายชุด";
    case "manual_grant":
      return "ผู้ดูแลระบบมอบสิทธิ์";
    case "private_grant":
      return "เฉพาะผู้ได้รับสิทธิ์";
    case "premium_activity":
      return "เคยทำผ่าน Premium";
    case "free_activity":
      return "เคยทำข้อสอบฟรี";
    default:
      return "";
  }
}

export function getMyExamFooterActions(item: MyExamItem, hasPremium: boolean): string[] {
  const attempt = item.latest_attempt;
  const hasResult =
    attempt?.status === "submitted" || attempt?.status === "timeout";

  if (item.access_source === "premium_activity" && !item.can_start) {
    const actions = ["ดูผลสอบ", "ต่ออายุ Premium"];
    if (item.allow_single_purchase) {
      actions.splice(1, 0, "ปลดล็อกชุดนี้");
    }
    return actions;
  }

  if (item.access_source === "free_activity") {
    return hasResult ? ["ทำอีกครั้ง", "ดูผลสอบ"] : ["ทำอีกครั้ง"];
  }

  if (item.access_source === "private_grant") {
    return ["ได้รับสิทธิ์แล้ว"];
  }

  if (item.can_start) {
    return ["พร้อมเริ่มทำข้อสอบ"];
  }

  if (hasResult) {
    return ["ดูผลสอบ"];
  }

  if (item.access_source === "premium_activity" && hasPremium) {
    return ["ใช้งานผ่าน Premium"];
  }

  return ["ดูรายละเอียด"];
}
