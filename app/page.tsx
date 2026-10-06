import Link from "next/link";

import { DailyQuote } from "@/components/DailyQuote";
import { CharacterAccent } from "@/components/CharacterAccent";
import { FeaturedCapabilities } from "@/components/FeaturedCapabilities";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { InspirationFeature } from "@/components/InspirationFeature";
import { LatestPosts } from "@/components/LatestPosts";
import {
  loadCapabilities,
  loadMoments,
  loadPosts,
  loadProjects,
  type LoadedCapability,
  type LoadedMoment,
  type LoadedPost,
  type LoadedProject,
} from "@/lib/content";
import { loadDailyQuotes, selectDailyQuote, type SelectedDailyQuote } from "@/lib/daily-quote";

import "./home.css";

export const dynamic = "force-dynamic";

type HomeContentProps = {
  featuredCapabilities: LoadedCapability[];
  featuredProjects: LoadedProject[];
  recentPosts: LoadedPost[];
  moments?: LoadedMoment[];
  dailyQuote?: SelectedDailyQuote | null;
};

export function HomeContent({
  featuredCapabilities,
  featuredProjects,
  recentPosts,
  moments = [],
  dailyQuote = null,
}: HomeContentProps) {
  return (
    <main id="main-content" className="home-page" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <CharacterAccent character="gugugaga" />
        <p className="hero__hello">嗨，我是 zhujiechong 👋</p>
        <h1 id="hero-title">写下做过的事，<br /><strong>也写下仍在思考的事。</strong></h1>
        <p className="hero__intro">在这里整理项目、写技术实践，也收藏那些打动我的瞬间。</p>
        <div className="hero__actions" aria-label="快速入口">
          <Link href="/blog">读点文章 ↗</Link>
          <Link href="/projects">看看作品 ↗</Link>
        </div>
      </section>

      <DailyQuote quote={dailyQuote} />
      <LatestPosts posts={recentPosts} />
      <FeaturedProjects projects={featuredProjects} />
      <InspirationFeature moments={moments} />
      <FeaturedCapabilities capabilities={featuredCapabilities} />
    </main>
  );
}

export default async function HomePage() {
  const [capabilities, projects, posts, moments] = await Promise.all([
    loadCapabilities({ featuredOnly: true }),
    loadProjects(),
    loadPosts({ includeDrafts: false }),
    loadMoments(),
  ]);

  return (
    <HomeContent
      featuredCapabilities={capabilities.slice(0, 3)}
      featuredProjects={projects
        .filter((project) => project.metadata.featured)
        .slice(0, 2)}
      recentPosts={posts.slice(0, 3)}
      moments={moments}
      dailyQuote={selectDailyQuote(loadDailyQuotes())}
    />
  );
}
