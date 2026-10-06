import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AboutPage, { AboutContent } from "@/app/about/page";
import { ContentValidationError } from "@/lib/content";
import { loadProfiles } from "@/lib/content";

vi.mock("@/components/MdxContent", () => ({
  MdxContent: ({ source }: { source: string }) => <div>{source}</div>,
}));

const temporaryRoots: string[] = [];

async function createContentRoot() {
  const workspace = await mkdtemp(join(tmpdir(), "zhujiechong-profile-"));
  const root = join(workspace, "content");
  await mkdir(root, { recursive: true });
  temporaryRoots.push(workspace);
  vi.spyOn(process, "cwd").mockReturnValue(workspace);
  return root;
}

async function writeFixture(root: string, filename: string, source: string) {
  const target = join(root, "profile", filename);

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, source, "utf8");
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("about page", () => {
  it("shows only the contact section", async () => {
    render(await AboutPage());

    expect(screen.getByRole("heading", { level: 1, name: "关于我" }))
      .toBeInTheDocument();
    expect(screen.queryByText("ABOUT / PUBLIC PROFILE")).not.toBeInTheDocument();
    expect(screen.queryByText(/公开资料 \/ bio\.md/)).not.toBeInTheDocument();
    expect(screen.queryByText(/我是 zhujiechong，一名程序员/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("资料状态")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "公开介绍" }))
      .not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "联系方式" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: "相关页面" })).not.toBeInTheDocument();
    expect(screen.getByText(/space\.bilibili\.com\/240822507/)).toBeInTheDocument();
    expect(screen.getByText(/github\.com\/kungfudaibi/)).toBeInTheDocument();
    expect(screen.queryByText(/咕咕嘎嘎只会引用/)).not.toBeInTheDocument();
  });

  it("keeps an actionable empty state when no public profile exists", () => {
    render(<AboutContent profiles={[]} />);

    expect(screen.getByText("公开资料还没有填写")).toBeInTheDocument();
    expect(screen.getByText(/content\/profile/)).toBeInTheDocument();
  });
});

describe("public about page profiles", () => {
  it("returns only explicitly public profile records", async () => {
    const root = await createContentRoot();

    await writeFixture(root, "bio.md", `---
title: 公开简介
visibility: public
relatedPath: /about
---

这是一段授权公开的资料。
`);
    await writeFixture(root, "private-note.md", `---
title: 非公开模板
visibility: private
relatedPath: /about
---

这只是用于验证过滤行为的安全测试文本。
`);

    const sources = await loadProfiles({ includePrivate: false });

    expect(sources.map((source) => source.slug)).toEqual(["bio"]);
    expect(sources[0]?.metadata).toMatchObject({
      title: "公开简介",
      visibility: "public",
      relatedPath: "/about",
    });
  });

  it("rejects an unsupported visibility instead of exposing it", async () => {
    const root = await createContentRoot();

    await writeFixture(root, "invalid.md", `---
title: 非法级别
visibility: shared
---

不能进入来源集合。
`);

    const error = await loadProfiles({ includePrivate: false }).catch(
      (reason) => reason,
    );

    expect(error).toBeInstanceOf(ContentValidationError);
    expect(error.message).toContain("profile/invalid.md");
    expect(error.message).not.toContain(root);
  });
});
