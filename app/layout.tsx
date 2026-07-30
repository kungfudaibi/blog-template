import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "zhujiechong",
  description: "程序员 zhujiechong 的个人博客与作品集。",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
