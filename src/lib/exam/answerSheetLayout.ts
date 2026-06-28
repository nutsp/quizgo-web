import { z } from "zod";
import { CHOICE_LABELS, labelToApiKey, type ChoiceKey } from "@/lib/choices";

export const MIN_QUESTIONS_PER_BLOCK = 5;
export const MAX_QUESTIONS_PER_BLOCK = 50;
export const MAX_OMR_BLOCK_COLUMNS = 4;

export type AnswerSheetLayoutConfig = {
  block_columns: 1 | 2 | 3 | 4;
  questions_per_block: number;
  choice_label_style: "thai" | "english";
  show_header: boolean;
  show_instructions: boolean;
  show_candidate_info: boolean;
};

export const defaultLayoutConfig: AnswerSheetLayoutConfig = {
  block_columns: 2,
  questions_per_block: 10,
  choice_label_style: "thai",
  show_header: true,
  show_instructions: true,
  show_candidate_info: true,
};

const blockColumnsSchema = z.preprocess(
  (value) => Number(value),
  z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ])
);

export const answerSheetLayoutSchema = z.object({
  block_columns: blockColumnsSchema,
  questions_per_block: z.preprocess(
    (value) => Number(value),
    z
      .number()
      .int()
      .min(MIN_QUESTIONS_PER_BLOCK, "จำนวนข้อต่อช่องต้องอยู่ระหว่าง 5–50")
      .max(MAX_QUESTIONS_PER_BLOCK, "จำนวนข้อต่อช่องต้องอยู่ระหว่าง 5–50")
  ),
  choice_label_style: z.enum(["thai", "english"]),
  show_header: z.boolean(),
  show_instructions: z.boolean(),
  show_candidate_info: z.boolean(),
});

/** Admin form — questions_per_block is derived from total_questions at save/render time. */
export const answerSheetLayoutFormSchema = answerSheetLayoutSchema.omit({
  questions_per_block: true,
});

export function normalizeLayoutConfig(
  config?: Partial<AnswerSheetLayoutConfig> | null
): AnswerSheetLayoutConfig {
  if (!config) return { ...defaultLayoutConfig };

  const blockColumns = [1, 2, 3, 4].includes(config.block_columns as number)
    ? (config.block_columns as AnswerSheetLayoutConfig["block_columns"])
    : defaultLayoutConfig.block_columns;

  const questionsPerBlock =
    typeof config.questions_per_block === "number" &&
    config.questions_per_block >= MIN_QUESTIONS_PER_BLOCK &&
    config.questions_per_block <= MAX_QUESTIONS_PER_BLOCK
      ? config.questions_per_block
      : defaultLayoutConfig.questions_per_block;

  const choiceLabelStyle =
    config.choice_label_style === "english" ? "english" : "thai";

  return {
    block_columns: blockColumns,
    questions_per_block: questionsPerBlock,
    choice_label_style: choiceLabelStyle,
    show_header: config.show_header ?? defaultLayoutConfig.show_header,
    show_instructions:
      config.show_instructions ?? defaultLayoutConfig.show_instructions,
    show_candidate_info:
      config.show_candidate_info ?? defaultLayoutConfig.show_candidate_info,
  };
}

export function chunkQuestions(
  totalQuestions: number,
  questionsPerBlock: number
): number[][] {
  if (totalQuestions <= 0 || questionsPerBlock <= 0) return [];

  const blocks: number[][] = [];
  for (let start = 1; start <= totalQuestions; start += questionsPerBlock) {
    const end = Math.min(start + questionsPerBlock - 1, totalQuestions);
    const block: number[] = [];
    for (let q = start; q <= end; q++) {
      block.push(q);
    }
    blocks.push(block);
  }
  return blocks;
}

/**
 * Evenly distributes questions across up to `blockColumns` blocks (max 4 per row).
 * Clamped to 5–50 questions per block for backend compatibility.
 */
export function computeQuestionsPerBlock(
  totalQuestions: number,
  blockColumns: number
): number {
  if (totalQuestions <= 0) return MIN_QUESTIONS_PER_BLOCK;

  const cols = Math.min(
    MAX_OMR_BLOCK_COLUMNS,
    Math.max(1, Math.floor(blockColumns) || 1)
  );
  const ideal = Math.ceil(totalQuestions / cols);
  return Math.min(
    MAX_QUESTIONS_PER_BLOCK,
    Math.max(MIN_QUESTIONS_PER_BLOCK, ideal)
  );
}

/** Applies saved layout toggles and auto-calculates questions_per_block for an attempt. */
export function resolveOMRLayout(
  totalQuestions: number,
  config?: Partial<AnswerSheetLayoutConfig> | null
): AnswerSheetLayoutConfig {
  const normalized = normalizeLayoutConfig(config);
  const blockColumns = Math.min(
    MAX_OMR_BLOCK_COLUMNS,
    normalized.block_columns
  ) as AnswerSheetLayoutConfig["block_columns"];

  return {
    ...normalized,
    block_columns: blockColumns,
    questions_per_block: computeQuestionsPerBlock(
      totalQuestions,
      blockColumns
    ),
  };
}

export type OMRGridVariant =
  | "compact"
  | "sidebar"
  | "full"
  | "print"
  | "fullscreen"
  | "drawer"
  | "mobile"
  | "preview";

/** Explicit Tailwind classes — never use dynamic `grid-cols-${n}`. */
export function getOMRBlockGridClass(blockColumns: number): string {
  switch (blockColumns) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    case 3:
      return "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3";
    case 4:
      return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";
    default:
      return "grid-cols-1 md:grid-cols-2";
  }
}

/** Sidebar only renders at xl+ (~50% panel); use exact column count, not viewport 2xl. */
function getOMRSidebarGridClass(blockColumns: number): string {
  switch (blockColumns) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-4";
    default:
      return "grid-cols-2";
  }
}

/** Fullscreen modal has full width — responsive steps for smaller modal viewports. */
function getOMRFullscreenGridClass(blockColumns: number): string {
  switch (blockColumns) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 sm:grid-cols-2";
    case 3:
      return "grid-cols-1 sm:grid-cols-3";
    case 4:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    default:
      return "grid-cols-1 sm:grid-cols-2";
  }
}

/** Mobile drawer / preview always stacks; sidebar uses panel-aware fixed columns. */
export function getOMRGridClass(
  blockColumns: number,
  variant: OMRGridVariant = "compact"
): string {
  if (variant === "drawer" || variant === "mobile" || variant === "preview") {
    return "grid-cols-1";
  }
  if (variant === "sidebar" || variant === "compact") {
    return getOMRSidebarGridClass(blockColumns);
  }
  return getOMRFullscreenGridClass(blockColumns);
}

export function getChoiceDisplayLabel(
  choiceKey: ChoiceKey,
  style: "thai" | "english"
): string {
  if (style === "english") {
    return labelToApiKey(choiceKey);
  }
  return choiceKey;
}

export function getChoiceDisplayLabels(
  style: "thai" | "english"
): string[] {
  return CHOICE_LABELS.map((key) => getChoiceDisplayLabel(key, style));
}
