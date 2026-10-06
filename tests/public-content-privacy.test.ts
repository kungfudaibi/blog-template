import { describe, expect, it } from "vitest";

import {
  loadCapabilities,
  loadPosts,
  loadProfiles,
  loadProjects,
} from "@/lib/content";

describe("public content privacy", () => {
  it("exposes only the exact approved project-link allowlist", async () => {
    const projects = await loadProjects();
    const projectLinks = projects
      .flatMap((project) => Object.values(project.metadata.links ?? {}))
      .sort();

    expect(projectLinks).toEqual(
      [
        "https://github.com/kungfudaibi/fpga_smart_car_tank",
        "https://github.com/kungfudaibi/sxu-mirror",
      ].sort(),
    );
  });

  it("limits account links to the two approved contact profiles", async () => {
    const [capabilities, posts, profiles, projects] = await Promise.all([
      loadCapabilities(),
      loadPosts({ includeDrafts: false }),
      loadProfiles(),
      loadProjects(),
    ]);
    const projectsWithoutLinks = projects.map((project) => ({
      ...project,
      metadata: { ...project.metadata, links: undefined },
    }));
    const publicNarrative = JSON.stringify({
      capabilities,
      posts,
      projects: projectsWithoutLinks,
    });

    expect(publicNarrative).not.toMatch(/【示例】|【待填写】|示例模板/);
    expect(publicNarrative).not.toMatch(/kungfudaibi|github\.com/i);
    expect(profiles.map((profile) => profile.slug)).toEqual(["contact"]);
    const profileLinks = [
      ...(profiles[0]?.content.matchAll(/\]\((https:\/\/[^)]+)\)/g) ?? []),
    ].map((match) => match[1]).sort();
    expect(profileLinks).toEqual([
      "https://github.com/kungfudaibi",
      "https://space.bilibili.com/240822507?spm_id_from=333.1007.0.0",
    ]);
  });
});
