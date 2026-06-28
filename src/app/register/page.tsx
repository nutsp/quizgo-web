import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <AuthBrandingPanel
          compact
          title="สร้างบัญชีควิซโก"
          subtitle="เริ่มซ้อมสอบแบบจับเวลา พร้อมกระดาษคำตอบ OMR ตรวจผล และวิเคราะห์จุดอ่อนของคุณ"
        />

        <div className="mx-auto w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
