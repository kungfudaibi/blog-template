import {
  CAPABILITY_STATUS_LABELS,
  loadAgentProfiles,
  loadCapabilities,
  loadPosts,
  loadProjects,
} from "@/lib/content";

import type { AgentSource } from "./types";

export async function buildAgentSources(): Promise<AgentSource[]> {
  const [profiles, posts, projects, capabilities] = await Promise.all([
    loadAgentProfiles(),
    loadPosts({ includeDrafts: false }),
    loadProjects(),
    loadCapabilities(),
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

  const capabilitySources: AgentSource[] = capabilities.map((capability) => ({
    id: `capability:${capability.slug}`,
    kind: "capability",
    title: capability.metadata.title,
    href: `/capabilities#${capability.slug}`,
    content: [
      capability.metadata.summary,
      `当前状态：${CAPABILITY_STATUS_LABELS[capability.metadata.status]}`,
      `分支：${capability.metadata.branches.join("、")}`,
      capability.content,
    ].join("\n\n"),
    keywords: [
      "能力",
      "技能",
      CAPABILITY_STATUS_LABELS[capability.metadata.status],
      capability.metadata.title,
      ...capability.metadata.branches,
    ],
  }));

  return [...profileSources, ...postSources, ...projectSources, ...capabilitySources];
}
