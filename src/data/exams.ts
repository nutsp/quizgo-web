export type Difficulty = "ง่าย" | "กลาง" | "ยาก";
export type ExamType = "เสมือนจริง" | "ธุรการ" | "ภาค ก" | "อปท." | "ท้องถิ่น";
export type Subject =
  | "งานสารบรรณ"
  | "ภาษาไทย"
  | "คณิตศาสตร์"
  | "กฎหมายราชการ"
  | "คอมพิวเตอร์"
  | "ภาษาอังกฤษ";
export type ExamFormat = "Mock Exam" | "Practice" | "ข้อสอบย้อนหลัง" | "ฝึกเฉพาะหมวด";
export type ExamStatus = "ยังไม่ทำ" | "ทำแล้ว" | "เคยผิดเยอะ";

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: ExamType;
  subjects: Subject[];
  format: ExamFormat;
  questionCount: number;
  durationMinutes: number;
  difficulty: Difficulty;
  passingScore: number;
  attemptCount: number;
  isFree: boolean;
  status?: ExamStatus;
  slug?: string;
}

export const exams: Exam[] = [
  {
    id: "1",
    title: "ข้อสอบเสมือนจริง ชุด A",
    description: "จำลองข้อสอบเสมือนจริง 100 ข้อ พร้อมจับเวลาเหมือนสนามจริง",
    category: "เสมือนจริง",
    subjects: ["งานสารบรรณ", "กฎหมายราชการ", "ภาษาไทย"],
    format: "Mock Exam",
    questionCount: 100,
    durationMinutes: 120,
    difficulty: "กลาง",
    passingScore: 60,
    attemptCount: 1245,
    isFree: true,
    status: "ทำแล้ว",
    slug: "demo",
  },
  {
    id: "2",
    title: "ข้อสอบเสมือนจริง ชุด B",
    description: "ข้อสอบเสมือนจริงชุด B เน้นงานสารบรรณและกฎหมายราชการ",
    category: "เสมือนจริง",
    subjects: ["งานสารบรรณ", "กฎหมายราชการ", "คอมพิวเตอร์"],
    format: "Mock Exam",
    questionCount: 100,
    durationMinutes: 120,
    difficulty: "กลาง",
    passingScore: 60,
    attemptCount: 982,
    isFree: false,
    status: "ยังไม่ทำ",
  },
  {
    id: "3",
    title: "ภาค ก ชุดพื้นฐาน",
    description: "ข้อสอบภาค ก ครบทุกวิชา สำหรับผู้เริ่มต้น",
    category: "ภาค ก",
    subjects: ["ภาษาไทย", "คณิตศาสตร์", "ภาษาอังกฤษ"],
    format: "Mock Exam",
    questionCount: 80,
    durationMinutes: 90,
    difficulty: "ง่าย",
    passingScore: 50,
    attemptCount: 2156,
    isFree: true,
    status: "ทำแล้ว",
  },
  {
    id: "4",
    title: "ธุรการปฏิบัติงาน",
    description: "ฝึกทำข้อสอบธุรการปฏิบัติงาน เน้นการปฏิบัติจริง",
    category: "ธุรการ",
    subjects: ["งานสารบรรณ", "คอมพิวเตอร์", "ภาษาไทย"],
    format: "Practice",
    questionCount: 60,
    durationMinutes: 60,
    difficulty: "กลาง",
    passingScore: 55,
    attemptCount: 743,
    isFree: false,
    status: "เคยผิดเยอะ",
  },
  {
    id: "5",
    title: "กฎหมายราชการ ข้อสอบย้อนหลัง",
    description: "รวมข้อสอบกฎหมายราชการจากการสอบจริง 5 ปีล่าสุด",
    category: "เสมือนจริง",
    subjects: ["กฎหมายราชการ"],
    format: "ข้อสอบย้อนหลัง",
    questionCount: 50,
    durationMinutes: 45,
    difficulty: "ยาก",
    passingScore: 60,
    attemptCount: 567,
    isFree: false,
    status: "ยังไม่ทำ",
  },
  {
    id: "6",
    title: "งานสารบรรณ ฝึกเฉพาะหมวด",
    description: "ฝึกเฉพาะหมวดงานสารบรรณ 30 ข้อ พร้อมเฉลยละเอียด",
    category: "เสมือนจริง",
    subjects: ["งานสารบรรณ"],
    format: "ฝึกเฉพาะหมวด",
    questionCount: 30,
    durationMinutes: 30,
    difficulty: "กลาง",
    passingScore: 70,
    attemptCount: 892,
    isFree: true,
    status: "ทำแล้ว",
  },
  {
    id: "7",
    title: "อปท. ชุดทดลอง",
    description: "ข้อสอบ อปท. จำลองสนามสอบจริง 80 ข้อ",
    category: "อปท.",
    subjects: ["ภาษาไทย", "คณิตศาสตร์", "กฎหมายราชการ"],
    format: "Mock Exam",
    questionCount: 80,
    durationMinutes: 90,
    difficulty: "กลาง",
    passingScore: 55,
    attemptCount: 421,
    isFree: false,
    status: "ยังไม่ทำ",
  },
  {
    id: "8",
    title: "ท้องถิ่น ภาค ก+ภาค ข",
    description: "ข้อสอบรวมภาค ก และภาค ข สำหรับตำแหน่งท้องถิ่น",
    category: "ท้องถิ่น",
    subjects: ["ภาษาไทย", "คณิตศาสตร์", "ภาษาอังกฤษ", "กฎหมายราชการ"],
    format: "Mock Exam",
    questionCount: 120,
    durationMinutes: 150,
    difficulty: "ยาก",
    passingScore: 60,
    attemptCount: 334,
    isFree: false,
    status: "ยังไม่ทำ",
  },
];

export const popularExams = exams.slice(0, 4);

export const filterOptions = {
  examTypes: ["เสมือนจริง", "ธุรการ", "ภาค ก", "อปท.", "ท้องถิ่น"] as ExamType[],
  subjects: [
    "งานสารบรรณ",
    "ภาษาไทย",
    "คณิตศาสตร์",
    "กฎหมายราชการ",
    "คอมพิวเตอร์",
    "ภาษาอังกฤษ",
  ] as Subject[],
  formats: ["Mock Exam", "Practice", "ข้อสอบย้อนหลัง", "ฝึกเฉพาะหมวด"] as ExamFormat[],
  difficulties: ["ง่าย", "กลาง", "ยาก"] as Difficulty[],
  prices: ["ฟรี", "Premium"] as const,
  statuses: ["ยังไม่ทำ", "ทำแล้ว", "เคยผิดเยอะ"] as ExamStatus[],
};

export const sortOptions = [
  { value: "recommended", label: "แนะนำ" },
  { value: "latest", label: "ล่าสุด" },
  { value: "popular", label: "ยอดนิยม" },
  { value: "price-low", label: "ราคาต่ำสุด" },
  { value: "price-high", label: "ราคาสูงสุด" },
];

export const quickFilters = [
  "เสมือนจริง",
  "ธุรการ",
  "งานสารบรรณ",
  "กฎหมายราชการ",
  "ภาค ก",
  "ฟรี",
];
