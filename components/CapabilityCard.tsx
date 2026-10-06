import type { LoadedCapability } from "@/lib/content";

import { MdxContent } from "./MdxContent";
import styles from "./CapabilityMap.module.css";

type CapabilityCardProps = {
  capability: LoadedCapability;
};

function formatUpdatedDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function CapabilityCard({ capability }: CapabilityCardProps) {
  const { metadata, slug } = capability;
  const titleId = `${slug}-title`;

  return (
    <article
      id={slug}
      className={styles.card}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <header className={styles.cardHeader}>
        <h2 id={titleId}>{metadata.title}</h2>
        <div className={styles.meta}>
          <p>
            <span>更新：</span>
            <time dateTime={metadata.updatedAt}>
              {formatUpdatedDate(metadata.updatedAt)}
            </time>
          </p>
          <ul aria-label={`${metadata.title} 分支`}>
            {metadata.branches.map((branch) => (
              <li key={branch}>{branch}</li>
            ))}
          </ul>
        </div>
      </header>

      <div className={`prose ${styles.body}`}>
        <MdxContent source={capability.content} />
      </div>
    </article>
  );
}
