import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteUrl } from "@/lib/site";

import "./globals.css";
import "./agent.css";

export const metadata: Metadata = {
  // Relative canonical and RSS URLs are resolved against this root-level base.
  // Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
  metadataBase: getSiteUrl(),
  title: "zhujiechong",
  description: "程序员 zhujiechong 的个人博客与作品集。",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
