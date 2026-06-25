import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-sans-thai",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "สนามสอบราชการ | จำลองสอบเสมียนเหมือนสนามจริง",
  description:
    "แพลตฟอร์มฝึกสอบเสมียนและข้าราชการ จำลองสนามสอบจริง จับเวลา ตรวจคะแนน และวิเคราะห์จุดอ่อน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
