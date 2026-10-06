import { afterEach, describe, expect, it, vi } from "vitest";

import { generateMetadata } from "@/app/blog/[slug]/page";
import { GET } from "@/app/rss.xml/route";
import { loadPosts } from "@/lib/content";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("published blog feed", () => {
  it("loads only the author's published technical note from MDX", async () => {
    const posts = await loadPosts({ includeDrafts: false });

    expect(posts).toHaveLength(1);
    expect(posts.every((post) => !post.metadata.title.includes("【示例】"))).toBe(true);
  });

  it("returns valid RSS-shaped XML with absolute links to published posts", async () => {
    vi.stubEnv("SITE_URL", "https://blog.zhujiechong.test");

    const response = await GET();
    const xml = await response.text();

    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<title>zhujiechong 的文章</title>");
    expect(xml.match(/<item>/g)).toHaveLength(1);
    expect(xml).toContain(
      encodeURI("https://blog.zhujiechong.test/blog/运维日志-与codex救回系统盘"),
    );
    expect(xml).not.toContain("building-this-site");
    expect(xml).not.toContain("content-is-a-contract");
    expect(xml).not.toContain("draft");
  });

  it("provides a canonical path and unique metadata for an article", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "运维日志-与codex救回系统盘" }),
    });

    expect(metadata.title).toBe("一次系统 SSD 损坏后的恢复：从 BMC 控制台到 ddrescue | zhujiechong");
    expect(metadata.description).toContain("物理服务器系统盘");
    expect(metadata.alternates?.canonical).toBe("/blog/运维日志-与codex救回系统盘");
  });

  it("returns not-found metadata for removed placeholder posts", async () => {
    vi.stubEnv("SITE_URL", "https://blog.zhujiechong.test");

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "content-is-a-contract" }),
    });
    expect(metadata.title).toBe("文章未找到 | zhujiechong");
  });
});
