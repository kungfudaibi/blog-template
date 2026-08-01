import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AboutPage, { AboutContent } from "@/app/about/page";
import { ContentValidationError } from "@/lib/content";
import { loadAgentProfiles } from "@/lib/content/profile";

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
  it("shows the confirmed programmer position and clearly labelled templates", async () => {
    render(await AboutPage());

    expect(screen.getByRole("heading", { level: 1, name: "关于我" }))
      .toBeInTheDocument();
    expect(
      screen.getByText(
        "我是 zhujiechong，是一名程序员。这里目前使用明确标注的资料模板，等真实内容准备好后再逐项替换。",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/尚未填写公开联系方式/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "【示例模板】公开介绍" }),
    ).toBeInTheDocument();
  });

  it("keeps an actionable empty state when no public profile exists", () => {
    render(<AboutContent profiles={[]} />);

    expect(screen.getByText("公开资料还没有填写")).toBeInTheDocument();
    expect(screen.getByText(/content\/profile/)).toBeInTheDocument();
  });
});

describe("agent profile sources", () => {
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

    const sources = await loadAgentProfiles();

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

    const error = await loadAgentProfiles().catch(
      (reason) => reason,
    );

    expect(error).toBeInstanceOf(ContentValidationError);
    expect(error.message).toContain("profile/invalid.md");
    expect(error.message).not.toContain(root);
  });
});
