import type { ApiQuestion } from "@/lib/api/types";
import type { ChoiceKey } from "@/lib/choices";
import { apiKeyToLabel } from "@/lib/choices";

export type { ChoiceKey } from "@/lib/choices";

export interface QuestionChoice {
  key: ChoiceKey;
  text: string;
  apiKey: string;
}

export interface Question {
  id: number;
  text: string;
  choices: QuestionChoice[];
}

export function mapApiQuestion(q: ApiQuestion): Question {
  return {
    id: q.question_no,
    text: q.question_text,
    choices: q.choices.map((c) => ({
      key: (apiKeyToLabel(c.choice_key) ?? c.choice_label) as ChoiceKey,
      text: c.choice_text,
      apiKey: c.choice_key,
    })),
  };
}

export function answersRecordToLabels(
  answers: Record<string, string>
): Record<number, ChoiceKey> {
  const out: Record<number, ChoiceKey> = {};
  for (const [no, key] of Object.entries(answers)) {
    const label = apiKeyToLabel(key);
    if (label) out[Number(no)] = label;
  }
  return out;
}
