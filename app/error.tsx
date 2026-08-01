"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <section className="empty-state" aria-labelledby="error-title">
        <p aria-hidden="true">[ error / safe_recovery ]</p>
        <h1 id="error-title">页面暂时出了点问题</h1>
        <p>没有展示错误详情。你可以重试当前操作，或安全返回首页。</p>
        <div className="hero__actions">
          <button className="button button--primary" type="button" onClick={reset}>
            再试一次
          </button>
          <Link className="button button--secondary" href="/">
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}
