# สนามสอบเสมือนจริง — Realistic Virtual Exam Simulation Demo

แพลตฟอร์มจำลองสอบเสมือนจริง (Demo) สร้างด้วย Next.js App Router เชื่อมต่อ Backend API

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui-style components (Radix UI)
- lucide-react icons
- React Hook Form + Zod validation
- Client-side auth (JWT ใน localStorage สำหรับ demo)

## Getting Started

### 1. ตั้งค่า environment

```bash
cp .env.local.example .env.local
```

แก้ไข `.env.local` ถ้า backend รันที่ port อื่น:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. รัน Backend API

ดูคำแนะนำใน `../api/README.md` — ต้องมี PostgreSQL และ seed data

```bash
cd ../api
go run ./cmd/server
```

Backend จะ listen ที่ `http://localhost:8080`

### 3. รัน Frontend

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Routes

| Route | หน้า | Auth |
|-------|------|------|
| `/` | หน้าแรก | ไม่บังคับ |
| `/login` | เข้าสู่ระบบ | Guest |
| `/register` | สมัครสมาชิก | Guest |
| `/exams` | คลังข้อสอบ | ไม่บังคับ |
| `/exams/[examSetCode]` | รายละเอียดชุดข้อสอบ | ไม่บังคับ |
| `/exams/[examSetCode]/take` | ทำข้อสอบ (ต้องมี `attempt_id`) | ต้อง login |
| `/exams/[examSetCode]/result` | ผลสอบ | ต้อง login |
| `/exams/demo/take` | alias ทำข้อสอบ (backward compat) | ต้อง login |
| `/exams/demo/result` | alias ผลสอบ | ต้อง login |

## Test Flow

1. เปิด `/exams` — ควรเห็นการ์ดพร้อม cover image และราคา
2. คลิกการ์ด → `/exams/gpor-set-1`
3. คลิก **เริ่มทำข้อสอบ** → modal คำแนะนำ
4. ติ๊ก "ฉันอ่านและเข้าใจคำแนะนำแล้ว" → **เริ่มสอบ**
5. Redirect ไป `/exams/gpor-set-1/take?attempt_id=...`
6. ทำข้อสอบ (กดค้างเพื่อฝนคำตอบ) → ส่งคำตอบ
7. ดูผลที่ `/exams/gpor-set-1/result?attempt_id=...`

### Auth flow

1. เปิด `/register` และสร้างบัญชี (หรือใช้ demo account)
2. จากหน้ารายละเอียดชุดข้อสอบ กดเริ่มสอบ — ถ้ายังไม่ login จะ redirect ไป `/login?redirect=/exams/{code}`
3. Logout แล้วลองเปิด `/exams/gpor-set-1/take` โดยไม่มี `attempt_id` → redirect กลับหน้ารายละเอียด

### Demo account (จาก backend seed)

| Email | Password |
|-------|----------|
| demo@example.com | password123 |

## Project Structure

```
src/
├── app/
│   ├── login/
│   ├── register/
│   └── exams/demo/
├── components/
│   ├── auth/          # LoginForm, RegisterForm, AuthGuard
│   └── layout/        # Navbar, MobileBottomNav
├── hooks/
│   └── useAuth.tsx    # Auth context
└── lib/
    ├── api.ts         # API client (apiGet, apiPost, ...)
    ├── auth.ts        # Token/user localStorage
    └── types.ts       # Auth types
```

## Auth Notes

- JWT และ user profile เก็บใน `localStorage` สำหรับ demo เท่านั้น
- Production ควรใช้ httpOnly secure cookies ถ้าเป็นไปได้
- ไม่เก็บ password ใน client
- API 401 จะ clear auth และ redirect ไป `/login`

## API Endpoints Used

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| GET | `/auth/me` | Yes |
| GET | `/home` | Optional |
| GET | `/exam-sets` | No |
| GET | `/exam-sets/:code` | No |
| POST | `/exam-sets/:code/attempts` | Yes |
| PUT | `/attempts/:id/answers/:no` | Yes |
| POST | `/attempts/:id/submit` | Yes |
| GET | `/attempts/:id/result` | Yes |
| GET | `/attempts/:id/review` | Yes |
