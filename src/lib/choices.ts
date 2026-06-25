export type ChoiceKey = "ก" | "ข" | "ค" | "ง";
export type ApiChoiceKey = "A" | "B" | "C" | "D";

const LABEL_TO_API: Record<ChoiceKey, ApiChoiceKey> = {
  ก: "A",
  ข: "B",
  ค: "C",
  ง: "D",
};

const API_TO_LABEL: Record<ApiChoiceKey, ChoiceKey> = {
  A: "ก",
  B: "ข",
  C: "ค",
  D: "ง",
};

export function labelToApiKey(label: ChoiceKey): ApiChoiceKey {
  return LABEL_TO_API[label];
}

export function apiKeyToLabel(key: string): ChoiceKey | null {
  if (key in API_TO_LABEL) {
    return API_TO_LABEL[key as ApiChoiceKey];
  }
  return null;
}

export const CHOICE_LABELS: ChoiceKey[] = ["ก", "ข", "ค", "ง"];
