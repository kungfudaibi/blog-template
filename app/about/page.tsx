import type { Metadata } from "next";

import { CharacterAccent } from "@/components/CharacterAccent";
import { ProfileSection } from "@/components/ProfileSection";
import { loadProfiles, type LoadedProfile } from "@/lib/content";

import "./about.css";

export const metadata: Metadata = {
  title: "关于我 | zhujiechong",
  description: "zhujiechong 的公开联系方式。",
  alternates: { canonical: "/about" },
};

type AboutContentProps = {
  profiles: LoadedProfile[];
};

export function AboutContent({ profiles }: AboutContentProps) {
  return (
    <main id="main-content" className="content-page about-page" tabIndex={-1}>
      <header className="page-intro about-page__intro">
        <CharacterAccent character="gugugaga" />
        <h1>关于我</h1>
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
  const profiles = await loadProfiles({ includePrivate: false });

  return <AboutContent profiles={profiles} />;
}
