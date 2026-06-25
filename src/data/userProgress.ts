export const userProgress = {
  continueExam: {
    title: "Mock Exam เสมียน ชุด A",
    completed: 45,
    total: 100,
    remainingMinutes: 58,
    examId: "1",
    slug: "demo",
  },
  stats: {
    averageScore: 68,
    completedSets: 12,
    latestWeakness: "งานสารบรรณ",
  },
};

export const initialExamState = {
  currentQuestion: 12,
  answeredCount: 45,
  unansweredCount: 55,
  markedCount: 3,
  remainingSeconds: 5055, // 01:24:15
  answers: Object.fromEntries(
    Array.from({ length: 100 }, (_, i) => {
      const q = i + 1;
      if (q <= 45) {
        const choices = ["ก", "ข", "ค", "ง"] as const;
        return [q, choices[q % 4]];
      }
      return [q, null];
    })
  ) as Record<number, "ก" | "ข" | "ค" | "ง" | null>,
  markedQuestions: [8, 23, 56] as number[],
};
