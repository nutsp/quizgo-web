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
| `/exams/demo/take` | ทำข้อสอบจำลอง | ต้อง login |
| `/exams/demo/result` | ผลสอบ | ต้อง login |

## Test Flow

1. เปิด `/register` และสร้างบัญชี
2. Login (หรือ auto-login หลัง register ถ้า backend คืน token)
3. เปิด `/` — ควรเห็น "ยินดีต้อนรับ, {display_name}"
4. เปิด `/exams` และกดเริ่มสอบ
5. ทำข้อสอบที่ `/exams/demo/take` (กดค้างเพื่อฝนคำตอบ)
6. ส่งคำตอบ → redirect ไป `/exams/demo/result?attempt_id=...`
7. ดูผลจาก API
8. Logout จาก Navbar
9. ลองเปิด `/exams/demo/take` → redirect ไป `/login`

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
| POST | `/exam-sets/:code/attempts` | Yes |
| PUT | `/attempts/:id/answers/:no` | Yes |
| POST | `/attempts/:id/submit` | Yes |
| GET | `/attempts/:id/result` | Yes |
| GET | `/attempts/:id/review` | Yes |
