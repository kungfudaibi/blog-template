import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  ContentSecurityError,
  ContentValidationError,
  getPostBySlug,
  getProjectBySlug,
  loadPosts,
  loadProfiles,
  loadProjects,
} from "@/lib/content";

const temporaryRoots: string[] = [];

async function createContentRoot() {
  const root = await mkdtemp(join(tmpdir(), "zhujiechong-content-"));
  temporaryRoots.push(root);
  return root;
}

async function writeFixture(root: string, relativePath: string, source: string) {
  const target = join(root, ...relativePath.split("/"));

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, source, "utf8");
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("content loader", () => {
  it("validates, sorts, and filters posts deterministically", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "posts/older.mdx",
      `---
title: 较早的文章
summary: 一篇较早的示例文章
publishedAt: 2026-06-01
tags: [Next.js, TypeScript]
cover: /images/posts/older.webp
---

正文内容。
`,
    );
    await writeFixture(
      root,
      "posts/newer.mdx",
      `---
title: 较新的文章
summary: 一篇较新的示例文章
publishedAt: 2026-07-30
tags: [架构]
cover: /images/posts/newer.webp
draft: false
---

更多正文。
`,
    );
    await writeFixture(
      root,
      "posts/draft.mdx",
      `---
title: 草稿文章
summary: 这篇文章不能出现在生产列表
publishedAt: 2026-08-01
tags: [草稿]
cover: /images/posts/draft.webp
draft: true
---

尚未完成。
`,
    );

    const published = await loadPosts({ contentRoot: root, includeDrafts: false });
    const withDrafts = await loadPosts({ contentRoot: root, includeDrafts: true });

    expect(published.map((post) => post.slug)).toEqual(["newer", "older"]);
    expect(published[0]).toMatchObject({
      content: "更多正文。",
      metadata: {
        draft: false,
        publishedAt: "2026-07-30",
        tags: ["架构"],
      },
    });
    expect(withDrafts.map((post) => post.slug)).toEqual([
      "draft",
      "newer",
      "older",
    ]);
  });

  it("rejects invalid frontmatter with a safe relative file location", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "posts/broken.mdx",
      `---
title: 缺少必要字段
publishedAt: not-a-date
tags: []
cover: https://unexpected.example/remote.webp
---
`,
    );

    const error = await loadPosts({ contentRoot: root }).catch((reason) => reason);

    expect(error).toBeInstanceOf(ContentValidationError);
    expect(error.message).toContain("posts/broken.mdx");
    expect(error.message).not.toContain(root);
  });

  it("normalizes malformed YAML errors without exposing an absolute path", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "posts/malformed.mdx",
      `---
title: [unterminated
---
`,
    );

    const error = await loadPosts({ contentRoot: root }).catch((reason) => reason);

    expect(error).toBeInstanceOf(ContentValidationError);
    expect(error.message).toBe("Invalid content syntax in posts/malformed.mdx");
    expect(error.message).not.toContain(root);
  });

  it("rejects duplicate explicit slugs", async () => {
    const root = await createContentRoot();
    const frontmatter = (title: string) => `---
title: ${title}
summary: slug 不能重复
publishedAt: 2026-07-30
tags: [测试]
cover: /images/posts/example.webp
slug: shared-slug
---

示例正文。
`;

    await writeFixture(root, "posts/first.mdx", frontmatter("第一篇"));
    await writeFixture(root, "posts/second.mdx", frontmatter("第二篇"));

    await expect(loadPosts({ contentRoot: root })).rejects.toThrow(
      /duplicate slug.*shared-slug/i,
    );
  });

  it("rejects traversal-shaped slugs before reading the filesystem", async () => {
    const root = await createContentRoot();

    await expect(getPostBySlug("../private", { contentRoot: root })).rejects.toBeInstanceOf(
      ContentSecurityError,
    );
    await expect(getPostBySlug("hello/world", { contentRoot: root })).rejects.toBeInstanceOf(
      ContentSecurityError,
    );
    await expect(getProjectBySlug("..%2Fprivate", { contentRoot: root })).rejects.toBeInstanceOf(
      ContentSecurityError,
    );
  });

  it("rejects impossible calendar dates", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "posts/impossible-date.mdx",
      `---
title: 不存在的日期
summary: 日期格式看似正确但日历中不存在
publishedAt: 2026-02-31
tags: [测试]
cover: /images/posts/date.webp
---
`,
    );

    await expect(loadPosts({ contentRoot: root })).rejects.toBeInstanceOf(
      ContentValidationError,
    );
  });

  it("loads project and public profile contracts from their allowed folders", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "projects/example-platform.mdx",
      `---
title: 示例平台
summary: 一个显著标注的样例项目
period: 2026
role: 全栈开发
tech: [Next.js, TypeScript]
cover: /images/projects/example.webp
featured: true
links:
  demo: https://example.com
  source: https://github.com/example/project
---

这是等待替换的样例资料。
`,
    );
    await writeFixture(
      root,
      "profile/bio.md",
      `---
title: 公开简介
visibility: public
relatedPath: /about
---

这是一段授权公开的资料。
`,
    );
    await writeFixture(
      root,
      "profile/private-note.md",
      `---
title: 私人笔记
visibility: private
---

这段资料不能进入默认结果。
`,
    );

    const projects = await loadProjects({ contentRoot: root });
    const publicProfiles = await loadProfiles({ contentRoot: root });

    expect(projects[0]).toMatchObject({
      slug: "example-platform",
      metadata: {
        featured: true,
        period: "2026",
        role: "全栈开发",
      },
    });
    expect(publicProfiles.map((profile) => profile.slug)).toEqual(["bio"]);
  });

  it("ignores unsupported files even inside an allowed content folder", async () => {
    const root = await createContentRoot();

    await writeFixture(root, "posts/readme.txt", "not content");
    await writeFixture(root, "posts/nested/hidden.mdx", "---\ntitle: hidden\n---");

    await expect(loadPosts({ contentRoot: root })).resolves.toEqual([]);
  });
});
