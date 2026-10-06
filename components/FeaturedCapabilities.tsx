import Link from "next/link";

import type { LoadedCapability } from "@/lib/content";

type FeaturedCapabilitiesProps = {
  capabilities: LoadedCapability[];
};

export function FeaturedCapabilities({ capabilities }: FeaturedCapabilitiesProps) {
  return (
    <section className="home-section" aria-labelledby="featured-capabilities-title">
      <div className="home-section__heading">
        <div>
          <h2 id="featured-capabilities-title">重点能力</h2>
        </div>
        <Link href="/capabilities">查看完整能力地图</Link>
      </div>

      {capabilities.length > 0 ? (
        <div className="featured-capabilities">
          {capabilities.map((capability) => (
            <article className="featured-capability" key={capability.slug}>
              <h3>
                <Link href={`/capabilities#${capability.slug}`}>
                  {capability.metadata.title}
                </Link>
              </h3>
              {capability.metadata.summary ? (
                <p>{capability.metadata.summary}</p>
              ) : null}
              <ul aria-label={`${capability.metadata.title} 分支`}>
                {capability.metadata.branches.map((branch) => (
                  <li key={branch}>{branch}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <p className="home-section__empty">重点能力还在整理</p>
      )}
    </section>
  );
}
