export type ChoiceKey = "ก" | "ข" | "ค" | "ง";

export interface QuestionChoice {
  key: ChoiceKey;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  choices: QuestionChoice[];
  correctAnswer: ChoiceKey;
  explanation: string;
  subject: string;
}

export const demoQuestion: Question = {
  id: 12,
  text: "ข้อใดเป็นหนังสือราชการภายนอกตามระเบียบงานสารบรรณ?",
  choices: [
    { key: "ก", text: "บันทึกข้อความ" },
    { key: "ข", text: "หนังสือภายนอก" },
    { key: "ค", text: "หนังสือสั่งการ" },
    { key: "ง", text: "หนังสือประชาสัมพันธ์" },
  ],
  correctAnswer: "ข",
  explanation:
    "หนังสือภายนอกเป็นหนังสือราชการที่ส่งออกไปยังหน่วยงานภายนอก ตามระเบียบงานสารบรรณของสำนักนายกรัฐมนตรี",
  subject: "งานสารบรรณ",
};

export const reviewQuestions = [
  {
    id: 12,
    text: "ข้อใดเป็นหนังสือราชการภายนอกตามระเบียบงานสารบรรณ?",
    yourAnswer: "ก" as ChoiceKey,
    correctAnswer: "ข" as ChoiceKey,
    explanation:
      "หนังสือภายนอกเป็นหนังสือราชการที่ส่งออกไปยังหน่วยงานภายนอก ตามระเบียบงานสารบรรณของสำนักนายกรัฐมนตรี",
    isCorrect: false,
  },
  {
    id: 34,
    text: "ข้อใดคือหลักการสำคัญของการบริหารราชการแบบมีส่วนร่วม?",
    yourAnswer: "ค" as ChoiceKey,
    correctAnswer: "ค" as ChoiceKey,
    explanation:
      "การบริหารราชการแบบมีส่วนร่วมเน้นการเปิดโอกาสให้ประชาชนและภาคีเครือข่ายมีส่วนร่วมในการกำหนดนโยบาย",
    isCorrect: true,
  },
  {
    id: 67,
    text: "จงหาค่าของ x จากสมการ 2x + 5 = 15",
    yourAnswer: "ข" as ChoiceKey,
    correctAnswer: "ข" as ChoiceKey,
    explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
    isCorrect: true,
  },
];

export const TOTAL_QUESTIONS = 100;
