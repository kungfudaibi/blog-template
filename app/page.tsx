import Link from "next/link";

import { AgentPreview } from "@/components/AgentPreview";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { InspirationFeature } from "@/components/InspirationFeature";
import { LatestPosts } from "@/components/LatestPosts";
import {
  loadPosts,
  loadProjects,
  type LoadedPost,
  type LoadedProject,
} from "@/lib/content";

type HomeContentProps = {
  featuredProjects: LoadedProject[];
  recentPosts: LoadedPost[];
};

export function HomeContent({ featuredProjects, recentPosts }: HomeContentProps) {
  return (
    <main id="main-content" className="home-page" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow" aria-hidden="true">
            $ whoami
          </p>
          <h1 id="hero-title">zhujiechong</h1>
          <p className="hero__tagline">程序员的作品与思考</p>
          <p className="hero__intro">
            我在这里整理做过的项目、写下技术实践，也记录那些值得反复推敲的问题。
          </p>
          <div className="hero__actions" aria-label="快速入口">
            <Link className="button button--primary" href="/projects">
              浏览作品
            </Link>
            <Link className="button button--secondary" href="/blog">
              阅读文章
            </Link>
          </div>
        </div>

        <aside className="terminal-card" aria-label="开发者状态">
          <div className="terminal-card__bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="terminal-card__body">
            <p>
              <span className="terminal-card__prompt">visitor@zhujiechong</span>
              <span aria-hidden="true">:~$ </span>
              status
            </p>
            <dl className="terminal-card__status">
              <div>
                <dt>role</dt>
                <dd>programmer</dd>
              </div>
              <div>
                <dt>mode</dt>
                <dd>open_to_build</dd>
              </div>
              <div>
                <dt>agent</dt>
                <dd>阿竹 · preparing</dd>
              </div>
            </dl>
            <p className="terminal-card__cursor">
              <span aria-hidden="true">▸</span> 资料将在这里持续更新
              <span className="terminal-card__caret" aria-hidden="true" />
            </p>
          </div>
        </aside>
      </section>

      <section className="home-note" aria-labelledby="home-note-title">
        <p className="home-note__index" aria-hidden="true">
          01 / README
        </p>
        <div>
          <h2 id="home-note-title">一座正在搭建的数字工作台</h2>
          <p>
            第一版会包含作品集、技术文章与一个能根据本站资料回答问题的卡通 Agent。
            目前展示的是结构样例，真实项目和个人资料将在后续替换。
          </p>
        </div>
      </section>

      <InspirationFeature />
      <FeaturedProjects projects={featuredProjects} />
      <LatestPosts posts={recentPosts} />
      <AgentPreview />
    </main>
  );
}

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    loadProjects(),
    loadPosts({ includeDrafts: false }),
  ]);

  return (
    <HomeContent
      featuredProjects={projects
        .filter((project) => project.metadata.featured)
        .slice(0, 2)}
      recentPosts={posts.slice(0, 3)}
    />
  );
}
