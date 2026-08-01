import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <section className="empty-state" aria-labelledby="not-found-title">
        <p aria-hidden="true">[ 404 / route_not_found ]</p>
        <h1 id="not-found-title">页面没有找到</h1>
        <p>这条路径可能已经移动，或者还没有被写进这座数字工作台。</p>
        <Link className="button button--primary" href="/">
          返回首页
        </Link>
      </section>
    </main>
  );
}
