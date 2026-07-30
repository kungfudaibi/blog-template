import Link from "next/link";

import type { LoadedProfile } from "@/lib/content";

import { MdxContent } from "./MdxContent";

type ProfileSectionProps = {
  profile: LoadedProfile;
};

export function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <article className="profile-section">
      <header>
        <p className="profile-section__source">公开资料 / {profile.slug}.md</p>
        <h2>{profile.metadata.title}</h2>
        {profile.metadata.relatedPath ? (
          <Link href={profile.metadata.relatedPath}>相关页面</Link>
        ) : null}
      </header>
      <div className="prose">
        <MdxContent source={profile.content} />
      </div>
    </article>
  );
}
