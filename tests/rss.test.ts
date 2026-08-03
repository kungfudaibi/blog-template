import { afterEach, describe, expect, it, vi } from "vitest";

import { generateMetadata } from "@/app/blog/[slug]/page";
import { GET } from "@/app/rss.xml/route";
import { loadPosts } from "@/lib/content";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("published blog feed", () => {
  it("loads exactly three published technical notes from MDX", async () => {
    const posts = await loadPosts({ includeDrafts: false });

    expect(posts).toHaveLength(3);
    expect(posts.every((post) => !post.metadata.title.includes("【示例】"))).toBe(true);
  });

  it("returns valid RSS-shaped XML with absolute links to published posts", async () => {
    vi.stubEnv("SITE_URL", "https://blog.zhujiechong.test");

    const response = await GET();
    const xml = await response.text();

    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<title>zhujiechong 的文章</title>");
    expect(xml.match(/<item>/g)).toHaveLength(3);
    expect(xml).toContain(
      "https://blog.zhujiechong.test/blog/building-this-site",
    );
    expect(xml).not.toContain("draft");
  });

  it("provides a canonical path and unique metadata for an article", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "building-this-site" }),
    });

    expect(metadata.title).toBe("黎明悄悄划过天边 | zhujiechong");
    expect(metadata.description).toBe("。");
    expect(metadata.alternates?.canonical).toBe("/blog/building-this-site");
  });

  it("omits undecided summaries from article metadata and RSS items", async () => {
    vi.stubEnv("SITE_URL", "https://blog.zhujiechong.test");

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "content-is-a-contract" }),
    });
    const xml = await (await GET()).text();
    const undecidedItem = xml
      .match(/<item>[\s\S]*?<\/item>/g)
      ?.find((item) => item.includes("content-is-a-contract"));

    expect(metadata.description).toBeUndefined();
    expect(undecidedItem).toBeDefined();
    expect(undecidedItem).not.toContain("<description>");
    expect(xml).not.toContain("<description></description>");
  });
});
