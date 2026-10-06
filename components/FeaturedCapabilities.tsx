import Link from "next/link";

import type { LoadedCapability } from "@/lib/content";

type FeaturedCapabilitiesProps = {
  capabilities: LoadedCapability[];
};

export function FeaturedCapabilities({ capabilities }: FeaturedCapabilitiesProps) {
  return (
    <section className="home-section home-capabilities" aria-labelledby="featured-capabilities-title">
      <div className="home-section__heading">
        <h2 id="featured-capabilities-title">还在摸索</h2>
        <Link href="/capabilities">能力地图 ↗</Link>
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
            </article>
          ))}
        </div>
      ) : (
        <p className="home-section__empty">感兴趣的方向还在整理</p>
      )}
    </section>
  );
}
