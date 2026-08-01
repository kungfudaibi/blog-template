import type { MetadataRoute } from "next";

import { loadPosts, loadProjects } from "@/lib/content";
import { getAbsoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    loadPosts({ includeDrafts: false }),
    loadProjects(),
  ]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: getAbsoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: getAbsoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
    { url: getAbsoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.8 },
  ];

  return [
    ...staticPages,
    ...posts.map((post) => ({
      url: getAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(`${post.metadata.publishedAt}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: getAbsoluteUrl(`/projects/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
