import type { Metadata } from "next";

import { CapabilityCard } from "@/components/CapabilityCard";
import styles from "@/components/CapabilityMap.module.css";
import { loadCapabilities, type LoadedCapability } from "@/lib/content";

export const metadata: Metadata = {
  title: "能力地图 | zhujiechong",
  description: "zhujiechong 在计算机各领域的当前判断、实践证据、边界与学习计划。",
  alternates: { canonical: "/capabilities" },
};

type CapabilityIndexProps = {
  capabilities: LoadedCapability[];
};

export function CapabilityIndex({ capabilities }: CapabilityIndexProps) {
  return (
    <main id="main-content" className={`content-page ${styles.page}`} tabIndex={-1}>
      <header className={styles.intro}>
        <h1>能力地图</h1>
        <p>
          记录我感兴趣的，尝试做的，做过的所有~
        </p>
      </header>

      {capabilities.length > 0 ? (
        <div className={styles.layout}>
          <nav className={styles.navigation} aria-label="能力领域索引">
            <ol>
              {capabilities.map((capability) => (
                <li key={capability.slug}>
                  <a href={`#${capability.slug}`}>{capability.metadata.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <section className={styles.cards} aria-label="能力实践档案">
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.slug} capability={capability} />
            ))}
          </section>
        </div>
      ) : (
        <section className="empty-state" aria-labelledby="empty-capabilities-title">
          <p aria-hidden="true">[ empty ]</p>
          <h2 id="empty-capabilities-title">能力档案还在整理</h2>
          <p>
            在 <code>content/capabilities/</code> 添加经过核实的 MDX 后，会自动显示在这里。
          </p>
        </section>
      )}
    </main>
  );
}

export default async function CapabilitiesPage() {
  const capabilities = await loadCapabilities();
  return <CapabilityIndex capabilities={capabilities} />;
}
