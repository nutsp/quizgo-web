export interface Course {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  practiceCount: number;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "คอร์สงานสารบรรณสำหรับสอบราชการ",
    description: "เรียนรู้ระเบียบงานสารบรรณและการเขียนหนังสือราชการอย่างเป็นระบบ",
    lessonCount: 24,
    practiceCount: 150,
  },
  {
    id: "2",
    title: "คอร์สกฎหมายราชการพื้นฐาน",
    description: "ทำความเข้าใจกฎหมายที่ใช้บ่อยในการสอบข้าราชการและธุรการ",
    lessonCount: 18,
    practiceCount: 120,
  },
  {
    id: "3",
    title: "คอร์สคณิตศาสตร์ ภาค ก",
    description: "ฝึกโจทย์คณิตศาสตร์ภาค ก พร้อมเทคนิคการทำข้อสอบเร็ว",
    lessonCount: 20,
    practiceCount: 200,
  },
];
