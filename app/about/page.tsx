import type { Metadata } from "next";

import { ProfileSection } from "@/components/ProfileSection";
import { loadAgentProfiles, type LoadedProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "关于我 | zhujiechong",
  description: "了解程序员 zhujiechong，以及可供阿竹引用的公开资料。",
  alternates: { canonical: "/about" },
};

type AboutContentProps = {
  profiles: LoadedProfile[];
};

export function AboutContent({ profiles }: AboutContentProps) {
  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <header className="page-intro about-intro">
        <p className="eyebrow">ABOUT / PUBLIC PROFILE</p>
        <h1>关于我</h1>
        <p>
          我是 zhujiechong，一名程序员。这里使用公开别名，只展示经过确认的作品、能力与技术记录，不公开真实姓名、学校或实习单位。
        </p>
        <aside aria-label="资料状态">
          <strong>资料状态：匿名公开</strong>
          <span>阿竹只会引用本站明确公开的资料，并拒绝身份猜测。</span>
        </aside>
      </header>

      {profiles.length > 0 ? (
        <section className="profile-sections" aria-label="公开个人资料">
          {profiles.map((profile) => (
            <ProfileSection key={profile.slug} profile={profile} />
          ))}
        </section>
      ) : (
        <section className="empty-state" aria-labelledby="empty-profile-title">
          <p aria-hidden="true">[ empty ]</p>
          <h2 id="empty-profile-title">公开资料还没有填写</h2>
          <p>
            在 <code>content/profile/</code> 添加公开 Markdown 资料后，会自动显示在这里。
          </p>
        </section>
      )}
    </main>
  );
}

export default async function AboutPage() {
  const profiles = await loadAgentProfiles();

  return <AboutContent profiles={profiles} />;
}
