import type { Metadata } from "next";
import { Inter, Sarabun, Kanit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-sarabun',
  display: 'swap',
});

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-kanit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Thai Story Writer - แอปเขียนนิยายภาษาไทย",
  description: "แพลตฟอร์มเขียนนิยายภาษาไทยที่สมบูรณ์แบบ พร้อมฟีเจอร์ช่วยเขียนด้วย AI, การจัดการตัวละคร, และสถิติการเขียน",
  keywords: "เขียนนิยาย, นิยายไทย, AI Assistant, เขียนเรื่อง, ตัวละคร, สถิติการเขียน",
  authors: [{ name: "Claude Code" }],
  openGraph: {
    title: "Thai Story Writer - แอปเขียนนิยายภาษาไทย",
    description: "แพลตฟอร์มเขียนนิยายภาษาไทยที่สมบูรณ์แบบ พร้อมฟีเจอร์ช่วยเขียนด้วย AI",
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thai Story Writer",
    description: "แพลตฟอร์มเขียนนิยายภาษาไทยที่สมบูรณ์แบบ",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${sarabun.variable} ${kanit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}