import type { ChoiceKey } from "@/lib/choices";

export type OMRAnswer = {
  question_no: number;
  selected_choice_key?: ChoiceKey | null;
  marked?: boolean;
};
