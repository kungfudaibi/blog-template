import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/MdxContent";
import { ContentSecurityError, getMomentBySlug, loadMoments } from "@/lib/content";

import styles from "./moment.module.css";

type MomentPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const moments = await loadMoments();
  return moments.map((moment) => ({ slug: moment.slug }));
}

async function findMoment(slug: string) {
  try {
    return await getMomentBySlug(decodeURIComponent(slug));
  } catch (error) {
    if (error instanceof ContentSecurityError || error instanceof URIError) return undefined;
    throw error;
  }
}

export async function generateMetadata({ params }: MomentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const moment = await findMoment(slug);

  if (!moment) return { title: "瞬间未找到 | zhujiechong" };

  return {
    title: `${moment.metadata.title} | zhujiechong`,
    description: moment.metadata.credit,
    alternates: { canonical: `/moments/${moment.slug}` },
    openGraph: {
      type: "article",
      locale: "zh_CN",
      siteName: "zhujiechong",
      title: moment.metadata.title,
      url: `/moments/${moment.slug}`,
      images: [moment.metadata.image],
    },
  };
}

export default async function MomentPage({ params }: MomentPageProps) {
  const { slug } = await params;
  const moment = await findMoment(slug);

  if (!moment) notFound();

  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <Link className="back-link" href="/#moments">
        <span aria-hidden="true">←</span> 返回那些打动我的瞬间
      </Link>
      <article className={styles.article}>
        <h1>{moment.metadata.title}</h1>
        <figure className={styles.figure}>
          <Image
            className={styles.image}
            src={moment.metadata.image}
            alt={moment.metadata.alt}
            width={moment.metadata.width}
            height={moment.metadata.height}
            sizes="(max-width: 58rem) calc(100vw - 2rem), 58rem"
            priority
          />
          <figcaption className={styles.credit}>{moment.metadata.credit}</figcaption>
        </figure>
        {moment.content ? (
          <div className={`prose ${styles.body}`}>
            <MdxContent source={moment.content} />
          </div>
        ) : null}
      </article>
    </main>
  );
}
