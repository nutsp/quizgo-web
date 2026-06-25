import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-sans-thai",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "สนามสอบเสมือนจริง | จำลองสอบเสมือนจริงเหมือนสนามจริง",
  description:
    "แพลตฟอร์มจำลองสอบเสมือนจริง ฝนคำตอบ จับเวลา ตรวจคะแนน และวิเคราะห์ผลสอบ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} font-sans antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
