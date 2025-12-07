/**
 * RTL & Farsi Setup
 * - Changed html lang to 'fa' and dir to 'rtl'
 * - Replaced Geist Sans with Vazirmatn (supports Arabic/Persian subset)
 * - Updated metadata to Farsi
 */
import type { Metadata } from "next";
import { Vazirmatn, Geist_Mono } from "next/font/google";
import "./globals.css";
import FeedbackButton from "@/components/FeedbackButton";

import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Startup Execution Platform | اجرا کننده استارتاپ",
  description: "تبدیل ایده استارتاپی به برنامه اجرایی. ابزارهای استراتژی، برندینگ و نقشه‌راه با هوش مصنوعی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FeedbackButton />
        <Toaster />
      </body>
    </html>
  );
}
