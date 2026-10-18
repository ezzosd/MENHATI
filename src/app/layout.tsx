import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منحتي | منصة المنح الدراسية",
  description: "منصة عربية للبحث عن المنح الدراسية حول العالم.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
