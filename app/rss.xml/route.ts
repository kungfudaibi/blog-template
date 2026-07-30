import { loadPosts } from "@/lib/content";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";

// Next.js 15+ makes GET Route Handlers dynamic by default; the feed only uses build content.
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/route#version-history
export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await loadPosts({ includeDrafts: false });
  const siteUrl = getSiteUrl().toString();
  const items = posts
    .map((post) => {
      const link = getAbsoluteUrl(`/blog/${post.slug}`);
      const publishedAt = new Date(
        `${post.metadata.publishedAt}T00:00:00Z`,
      ).toUTCString();

      return `    <item>
      <title>${escapeXml(post.metadata.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.metadata.summary)}</description>
      <pubDate>${publishedAt}</pubDate>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>zhujiechong 的文章</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>zhujiechong 的技术文章与实践记录。</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
