import Link from "next/link";

import type { LoadedCapability } from "@/lib/content";

import { CapabilityStatus } from "./CapabilityStatus";
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
        <div className={styles.cardTopline}>
          <p className={styles.index} aria-hidden="true">
            {String(metadata.order).padStart(2, "0")}
          </p>
          <CapabilityStatus status={metadata.status} />
        </div>
        <h2 id={titleId}>{metadata.title}</h2>
        <p className={styles.summary}>{metadata.summary}</p>
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

      <footer className={styles.cardFooter}>
        <Link href="/projects">查看相关作品与实践</Link>
      </footer>
    </article>
  );
}
