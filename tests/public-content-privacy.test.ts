import { describe, expect, it } from "vitest";

import {
  loadCapabilities,
  loadPosts,
  loadProfiles,
  loadProjects,
} from "@/lib/content";

describe("public content privacy", () => {
  it("contains no demo markers, pending markers, unapproved accounts, or external links", async () => {
    const [capabilities, posts, profiles, projects] = await Promise.all([
      loadCapabilities(),
      loadPosts({ includeDrafts: false }),
      loadProfiles(),
      loadProjects(),
    ]);
    const publicContent = JSON.stringify({ capabilities, posts, profiles, projects });

    expect(publicContent).not.toMatch(/【示例】|【待填写】|示例模板/);
    expect(publicContent).not.toMatch(/kungfudaibi|github\.com|https?:\/\//i);
    expect(projects.every((project) => project.metadata.links === undefined)).toBe(true);
  });
});
