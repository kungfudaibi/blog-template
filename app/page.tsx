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
        <div className="hero__copy">
          <div className="hero__main">
            <h1 id="hero-title">zhujiechong</h1>
            <p className="hero__tagline">写下做过的事，也写下仍在思考的事。</p>
            <div className="hero__actions" aria-label="快速入口">
              <Link className="button button--primary" href="/blog">
                阅读文章
              </Link>
              <Link className="button button--secondary" href="/projects">
                浏览作品
              </Link>
            </div>
          </div>
          <div className="hero__aside">
            <span className="hero__character"><CharacterAccent character="gugugaga" /></span>
            <DailyQuote quote={dailyQuote} />
          </div>
        </div>
      </section>

      <LatestPosts posts={recentPosts} />
      <FeaturedProjects projects={featuredProjects} />
      <FeaturedCapabilities capabilities={featuredCapabilities} />
      <InspirationFeature moments={moments} />
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
