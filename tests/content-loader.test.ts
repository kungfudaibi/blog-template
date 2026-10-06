import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ContentSecurityError,
  ContentValidationError,
  getPostBySlug,
  getMomentBySlug,
  getProjectBySlug,
  loadPosts,
  loadMoments,
  loadProfiles,
  loadProjects,
} from "@/lib/content";

const temporaryRoots: string[] = [];

async function createContentRoot() {
  const workspace = await mkdtemp(join(tmpdir(), "zhujiechong-content-"));
  const root = join(workspace, "content");
  await mkdir(root, { recursive: true });
  temporaryRoots.push(workspace);
  vi.spyOn(process, "cwd").mockReturnValue(workspace);
  return root;
}

async function writeFixture(root: string, relativePath: string, source: string) {
  const target = join(root, ...relativePath.split("/"));

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, source, "utf8");
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("content loader", () => {
  it("keeps body separators when parsing BOM and CRLF frontmatter", async () => {
    const root = await createContentRoot();
    await writeFixture(root, "posts/markers.mdx", `\uFEFF---\r\ntitle: 分隔线\r\nsummary: 测试正文\r\npublishedAt: 2026-08-12\r\ntags: [测试]\r\ncover: /images/posts/markers.webp\r\n---\r\n第一段\r\n---\r\n第二段\r\n`);

    expect((await loadPosts())[0].content).toBe("第一段\r\n---\r\n第二段");
  });

  it("loads future moment reflections from MDX and protects their slugs", async () => {
    const root = await createContentRoot();
    await writeFixture(root, "moments/first-moment.mdx", `---
title: 第一张展览卡片
image: /images/inspiration/first.png
alt: 一幅画的画面
width: 1200
height: 800
credit: 由站主提供的图片。
---

## 当时的感受

这是站主以后可写的文字。
`);

    expect(await getMomentBySlug("first-moment")).toMatchObject({
      content: "## 当时的感受\n\n这是站主以后可写的文字。",
      metadata: { title: "第一张展览卡片" },
    });
    expect((await loadMoments()).map((moment) => moment.slug)).toEqual(["first-moment"]);
    await expect(getMomentBySlug("../first-moment"))
      .rejects.toBeInstanceOf(ContentSecurityError);
  });

  it("keeps an unwritten moment valid without a daily quote", async () => {
    const root = await createContentRoot();
    await writeFixture(root, "moments/unwritten.mdx", `---
title: 尚未写完
image: /images/inspiration/first.png
alt: 一幅画
width: 1200
height: 800
credit: 由站主提供的图片。
---
`);

    expect((await loadMoments())[0].content).toBe("");
  });

  it("loads a Chinese-named post without weakening path validation", async () => {
    const root = await createContentRoot();
    await writeFixture(root, "posts/运维日志-与codex救回系统盘.mdx", `---
title: 运维日志
summary: 一次系统盘恢复记录
publishedAt: 2026-08-12
tags: [运维]
cover: /images/posts/recovery.webp
---

恢复过程。
`);

    expect((await loadPosts({ includeDrafts: false })).map((post) => post.slug))
      .toEqual(["运维日志-与codex救回系统盘"]);
    expect(await getPostBySlug("运维日志-与codex救回系统盘"))
      .toMatchObject({ content: "恢复过程。" });
    await expect(getPostBySlug("../运维日志")).rejects.toBeInstanceOf(
      ContentSecurityError,
    );
  });

  it("records the confirmed AI model for the published recovery article", async () => {
    const posts = await loadPosts({ includeDrafts: false });
    expect(posts.find((post) => post.slug === "运维日志-与codex救回系统盘")?.metadata)
      .toMatchObject({ aiCreatedWith: "Codex（基于 GPT-6）" });
  });

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

    const published = await loadPosts({ includeDrafts: false });
    const withDrafts = await loadPosts({ includeDrafts: true });

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

  it("accepts blank summaries as undecided display copy", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "posts/blank-summary.mdx",
      `---
title: 尚未想好摘要
summary: ""
publishedAt: 2026-08-04
tags: [草稿]
cover: /images/posts/blank.webp
draft: false
---

正文也可以之后再继续。
`,
    );
    await writeFixture(
      root,
      "projects/blank-summary.mdx",
      `---
title: 尚未想好项目摘要
summary: ""
period: 2026
role: 开发
tech: [TypeScript]
cover: /images/projects/blank.webp
featured: false
---
`,
    );

    await expect(loadPosts({ includeDrafts: false })).resolves.toMatchObject([
      { metadata: { summary: "" } },
    ]);
    await expect(loadProjects()).resolves.toMatchObject([
      { metadata: { summary: "" } },
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

    const error = await loadPosts().catch((reason) => reason);

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

    const error = await loadPosts().catch((reason) => reason);

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

    await expect(loadPosts()).rejects.toThrow(
      /duplicate slug.*shared-slug/i,
    );
  });

  it("rejects traversal-shaped slugs before reading the filesystem", async () => {
    await createContentRoot();

    await expect(getPostBySlug("../private")).rejects.toBeInstanceOf(
      ContentSecurityError,
    );
    await expect(getPostBySlug("hello/world")).rejects.toBeInstanceOf(
      ContentSecurityError,
    );
    await expect(getProjectBySlug("..%2Fprivate")).rejects.toBeInstanceOf(
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

    await expect(loadPosts()).rejects.toBeInstanceOf(
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

    const projects = await loadProjects();
    const publicProfiles = await loadProfiles();

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

  it("filters an empty public profile from display sources but retains it for maintenance", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "profile/contact.md",
      `---
title: 联系方式
visibility: public
---
`,
    );

    await expect(loadProfiles()).resolves.toEqual([]);
    await expect(loadProfiles({ includePrivate: true })).resolves.toMatchObject([
      { slug: "contact", content: "" },
    ]);
  });

  it("accepts an anonymous project without external links", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "projects/anonymous-project.mdx",
      `---
title: 匿名项目
summary: 只展示经过核实的项目事实
period: 2025
role: 核心开发
tech: [TypeScript]
cover: /images/projects/anonymous.webp
featured: true
---

项目正文。
`,
    );

    const projects = await loadProjects();

    expect(projects).toMatchObject([
      {
        slug: "anonymous-project",
        metadata: { title: "匿名项目" },
      },
    ]);
    expect(projects[0]?.metadata).not.toHaveProperty("links");
  });

  it("still rejects non-HTTPS project links when links are provided", async () => {
    const root = await createContentRoot();

    await writeFixture(
      root,
      "projects/insecure-link.mdx",
      `---
title: 不安全链接
summary: 外链存在时仍需经过协议校验
period: 2025
role: 开发
tech: [TypeScript]
cover: /images/projects/insecure.webp
links:
  demo: http://example.com
---
`,
    );

    await expect(loadProjects()).rejects.toBeInstanceOf(ContentValidationError);
  });

  it("ignores unsupported files even inside an allowed content folder", async () => {
    const root = await createContentRoot();

    await writeFixture(root, "posts/readme.txt", "not content");
    await writeFixture(root, "posts/nested/hidden.mdx", "---\ntitle: hidden\n---");

    await expect(loadPosts()).resolves.toEqual([]);
  });
});
