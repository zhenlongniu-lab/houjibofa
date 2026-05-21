import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "厚积薄发 — 每日新闻联播摘要",
  description: "每日新闻联播摘要，厚积薄发，日拱一卒，功不唐捐。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
