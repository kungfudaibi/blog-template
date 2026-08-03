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
        "https://github.com/kungfudaibi/OctodayMenu",
        "https://github.com/kungfudaibi/blog-template",
        "https://github.com/kungfudaibi/fpga_smart_car_tank",
        "https://github.com/kungfudaibi/kungfudaibi.github.io",
        "https://github.com/kungfudaibi/sxu-mirror",
        "https://kungfudaibi.github.io/",
      ].sort(),
    );
  });

  it("contains no demo markers or unapproved GitHub identity links in public narrative", async () => {
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
      profiles,
      projects: projectsWithoutLinks,
    });

    expect(publicNarrative).not.toMatch(/【示例】|【待填写】|示例模板/);
    expect(publicNarrative).not.toMatch(/kungfudaibi|github\.com/i);
  });
});
