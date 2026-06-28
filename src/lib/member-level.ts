export type MemberLevelDefinition = {
  level: number;
  name: string;
  minCompletedExamSets: number;
  nextAt: number | null;
};

export type MemberLevelResult = {
  level: number;
  name: string;
  completedExamSetCount: number;
  nextLevel: {
    level: number;
    name: string;
    requiredCompletedExamSets: number;
  } | null;
  remainingToNextLevel: number;
  progressPercent: number;
};

export const MEMBER_LEVELS: MemberLevelDefinition[] = [
  {
    level: 1,
    name: "ผู้เริ่มต้น",
    minCompletedExamSets: 0,
    nextAt: 3,
  },
  {
    level: 2,
    name: "นักซ้อมสอบ",
    minCompletedExamSets: 3,
    nextAt: 6,
  },
  {
    level: 3,
    name: "นักพัฒนา",
    minCompletedExamSets: 6,
    nextAt: 11,
  },
  {
    level: 4,
    name: "นักทำคะแนน",
    minCompletedExamSets: 11,
    nextAt: 21,
  },
  {
    level: 5,
    name: "พร้อมลงสนาม",
    minCompletedExamSets: 21,
    nextAt: null,
  },
];

export function getMemberLevel(completedExamSetCount: number): MemberLevelResult {
  const count = Math.max(0, completedExamSetCount);

  let current = MEMBER_LEVELS[0];
  for (const level of MEMBER_LEVELS) {
    if (count >= level.minCompletedExamSets) {
      current = level;
    } else {
      break;
    }
  }

  const currentIndex = MEMBER_LEVELS.findIndex((level) => level.level === current.level);
  const next = currentIndex < MEMBER_LEVELS.length - 1 ? MEMBER_LEVELS[currentIndex + 1] : null;

  if (!next || current.nextAt === null) {
    return {
      level: current.level,
      name: current.name,
      completedExamSetCount: count,
      nextLevel: null,
      remainingToNextLevel: 0,
      progressPercent: 100,
    };
  }

  const rangeStart = current.minCompletedExamSets;
  const rangeEnd = next.minCompletedExamSets;
  const rangeSize = rangeEnd - rangeStart;
  const progressInRange = count - rangeStart;
  const progressPercent =
    rangeSize > 0 ? Math.min(100, Math.round((progressInRange / rangeSize) * 100)) : 0;
  const remainingToNextLevel = Math.max(0, rangeEnd - count);

  return {
    level: current.level,
    name: current.name,
    completedExamSetCount: count,
    nextLevel: {
      level: next.level,
      name: next.name,
      requiredCompletedExamSets: next.minCompletedExamSets,
    },
    remainingToNextLevel,
    progressPercent,
  };
}
