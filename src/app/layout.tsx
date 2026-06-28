import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Navbar } from "@/components/layout/Navbar";
import { BRAND } from "@/config/brand";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/hooks/useToast";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-sans-thai",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "ซ้อมสอบเสมือนจริง ก่อนลงสนามจริง พร้อมจับเวลา กระดาษคำตอบ OMR ตรวจผล และวิเคราะห์จุดอ่อน",
  applicationName: BRAND.name,
  openGraph: {
    title: BRAND.name,
    description:
      "ซ้อมสอบเสมือนจริง ก่อนลงสนามจริง พร้อมจับเวลา กระดาษคำตอบ OMR ตรวจผล และวิเคราะห์จุดอ่อน",
    siteName: BRAND.name,
  },
  icons: {
    icon: [{ url: BRAND.icon, type: "image/svg+xml" }],
    apple: BRAND.appleTouchIcon,
  },
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
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
