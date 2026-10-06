import Image from "next/image";
import Link from "next/link";

import type { LoadedMoment } from "@/lib/content";
import { CharacterAccent } from "./CharacterAccent";

import styles from "./InspirationFeature.module.css";

export function InspirationFeature({ moments }: { moments: LoadedMoment[] }) {
  return (
    <section id="moments" className={styles.feature} aria-label="视觉灵感">
      <div className={styles.heading}>
        <h2>那些打动我的瞬间</h2>
        <CharacterAccent character="phrolova" />
      </div>
      <div className={styles.gallery}>
        {moments.map((moment) => (
          <article className={styles.card} aria-label={moment.metadata.title} key={moment.slug}>
            <Link
              className={styles.cardLink}
              href={`/moments/${moment.slug}`}
              aria-label={`查看${moment.metadata.title}的感受`}
            >
              <figure>
                <Image
                  className={styles.image}
                  src={moment.metadata.image}
                  alt={moment.metadata.alt}
                  width={moment.metadata.width}
                  height={moment.metadata.height}
                  loading="eager"
                  sizes="(max-width: 48rem) calc(100vw - 2.5rem), 42rem"
                />
                <figcaption className="sr-only">{moment.metadata.credit}</figcaption>
              </figure>
              <h3>{moment.metadata.title}</h3>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
