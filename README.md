# สนามสอบราชการ — Thai Government Exam Simulator Demo

แพลตฟอร์มจำลองสอบข้าราชการ (Demo) สร้างด้วย Next.js App Router

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui-style components (Radix UI)
- lucide-react icons

## Getting Started

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Routes

| Route | หน้า |
|-------|------|
| `/` | หน้าแรก |
| `/exams` | คลังข้อสอบ |
| `/exams/demo/take` | ทำข้อสอบจำลอง |
| `/exams/demo/result` | ผลสอบ |

## Project Structure

```
src/
├── app/                    # Pages (App Router)
├── components/             # Reusable UI components
│   └── ui/                 # shadcn-style primitives
├── data/                   # Mock data
└── lib/                    # Utilities
```

## Notes

- ใช้ mock data เท่านั้น ไม่มี backend
- ไม่มี authentication / payment
- Demo สำหรับนำเสนอ stakeholders
