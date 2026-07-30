import {
  loadAgentProfiles,
  loadPosts,
  loadProjects,
} from "@/lib/content";

import type { AgentSource } from "./types";

export async function buildAgentSources(): Promise<AgentSource[]> {
  const [profiles, posts, projects] = await Promise.all([
    loadAgentProfiles(),
    loadPosts({ includeDrafts: false }),
    loadProjects(),
  ]);

  const profileSources: AgentSource[] = profiles.map((profile) => ({
    id: `profile:${profile.slug}`,
    kind: "profile",
    title: profile.metadata.title,
    href: profile.metadata.relatedPath ?? "/about",
    content: profile.content,
    keywords: ["个人资料", "关于", "zhujiechong", profile.slug],
  }));

  const postSources: AgentSource[] = posts.map((post) => ({
    id: `post:${post.slug}`,
    kind: "post",
    title: post.metadata.title,
    href: `/blog/${post.slug}`,
    content: `${post.metadata.summary}\n\n${post.content}`,
    keywords: ["文章", "博客", ...post.metadata.tags],
  }));

  const projectSources: AgentSource[] = projects.map((project) => ({
    id: `project:${project.slug}`,
    kind: "project",
    title: project.metadata.title,
    href: `/projects/${project.slug}`,
    content: [
      project.metadata.summary,
      `职责：${project.metadata.role}`,
      `技术：${project.metadata.tech.join("、")}`,
      project.content,
    ].join("\n\n"),
    keywords: ["作品", "项目", project.metadata.role, ...project.metadata.tech],
  }));

  return [...profileSources, ...postSources, ...projectSources];
}
