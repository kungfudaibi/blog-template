import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CAPABILITY_STATUS_LABELS,
  ContentSecurityError,
  ContentValidationError,
  getCapabilityBySlug,
  loadCapabilities,
} from "@/lib/content";

const temporaryRoots: string[] = [];

async function createContentRoot() {
  const workspace = await mkdtemp(join(tmpdir(), "zhujiechong-capabilities-"));
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

type FixtureOverrides = {
  title?: string;
  status?: string;
  updatedAt?: string;
  order?: number;
  featured?: boolean;
  slug?: string;
};

function capabilityFixture(overrides: FixtureOverrides = {}, body = validBody) {
  return `---
${overrides.slug ? `slug: ${overrides.slug}\n` : ""}title: ${overrides.title ?? "超算与 AI Infra"}
summary: 从体系结构和并行模型出发理解计算工作负载
status: ${overrides.status ?? "practiced"}
updatedAt: ${overrides.updatedAt ?? "2026-08-01"}
order: ${overrides.order ?? 2}
featured: ${overrides.featured ?? true}
branches: [并行计算, AI Infra]
---

${body}
`;
}

const validBody = `## 我的理解

能力来自对计算机体系结构与基本并行模型的理解。

## 做过的事

参加过超算竞赛，并尝试分析 AlphaFold 工作负载。

## 边界与失败

部分优化尝试没有形成可复现收益，不把尝试写成成果。

## 下一步

继续补齐性能分析方法。`;

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("capability content", () => {
  it("maps stable statuses to fixed Chinese labels", () => {
    expect(CAPABILITY_STATUS_LABELS).toEqual({
      exploring: "正在了解",
      learning: "做过练习",
      practiced: "做过完整实践",
      independent: "能独立承担",
    });
  });

  it("sorts by order and filters featured capabilities", async () => {
    const root = await createContentRoot();
    await writeFixture(root, "capabilities/hpc.mdx", capabilityFixture());
    await writeFixture(
      root,
      "capabilities/systems.mdx",
      capabilityFixture({
        title: "体系结构与操作系统",
        order: 1,
        featured: false,
      }),
    );

    const capabilities = await loadCapabilities();
    const featured = await loadCapabilities({ featuredOnly: true });

    expect(capabilities.map((capability) => capability.slug)).toEqual(["systems", "hpc"]);
    expect(featured.map((capability) => capability.slug)).toEqual(["hpc"]);
  });

  it.each<[FixtureOverrides, string]>([
    [{ status: "expert" }, "status"],
    [{ updatedAt: "2026-02-31" }, "updatedAt"],
    [{ order: -1 }, "order"],
  ])("rejects invalid metadata override %s", async (override, field) => {
    const root = await createContentRoot();
    await writeFixture(root, "capabilities/invalid.mdx", capabilityFixture(override));

    const error = await loadCapabilities().catch((reason) => reason);

    expect(error).toBeInstanceOf(ContentValidationError);
    expect(error.message).toContain(field);
  });

  it("rejects duplicate slugs", async () => {
    const root = await createContentRoot();
    const sharedSlug = { slug: "shared-capability" };
    await writeFixture(root, "capabilities/first.mdx", capabilityFixture(sharedSlug));
    await writeFixture(root, "capabilities/second.mdx", capabilityFixture(sharedSlug));

    await expect(loadCapabilities()).rejects.toThrow(/duplicate slug.*shared-capability/i);
  });

  it("rejects traversal-shaped capability lookups", async () => {
    await createContentRoot();

    await expect(getCapabilityBySlug("../profile")).rejects.toBeInstanceOf(
      ContentSecurityError,
    );
  });

  it("requires all four evidence sections", async () => {
    const root = await createContentRoot();
    const incompleteBody = validBody.replace("## 边界与失败", "## 复盘");
    await writeFixture(
      root,
      "capabilities/incomplete.mdx",
      capabilityFixture({}, incompleteBody),
    );

    await expect(loadCapabilities()).rejects.toThrow(/边界与失败/);
  });

  it("loads the approved HPC slice without identity claims", async () => {
    vi.restoreAllMocks();

    const capability = await getCapabilityBySlug("hpc-ai-infra");

    expect(capability?.metadata).toMatchObject({
      title: "超算与 AI Infra",
      status: "practiced",
      featured: true,
    });
    expect(capability?.content).toContain("2024 IndySCC 线上赛第三名");
    expect(capability?.content).toContain("2025 ASC 二等奖");
    expect(capability?.content).toContain("AlphaFold");
    expect(capability?.content).toContain("没有形成可复现的性能收益");
    expect(capability?.content).not.toMatch(/学校|队名|队员|学院|大学/);
  });

  it("loads all six anonymous capability records with three featured fields", async () => {
    vi.restoreAllMocks();

    const capabilities = await loadCapabilities();
    const featured = await loadCapabilities({ featuredOnly: true });

    expect(capabilities.map((capability) => capability.metadata.title)).toEqual([
      "超算与 AI Infra",
      "Agent 开发",
      "体系结构与操作系统",
      "网络安全",
      "电子基础与嵌入式",
      "算法与数据结构",
    ]);
    expect(featured.map((capability) => capability.metadata.title)).toEqual([
      "超算与 AI Infra",
      "Agent 开发",
      "体系结构与操作系统",
    ]);
    expect(capabilities.every((capability) => capability.metadata.updatedAt)).toBe(true);
  });

  it("keeps the security story non-operational and avoids unsupported mastery claims", async () => {
    vi.restoreAllMocks();

    const capabilities = await loadCapabilities();
    const security = capabilities.find((capability) => capability.slug === "security");
    const publicText = capabilities
      .map((capability) => `${capability.metadata.summary}\n${capability.content}`)
      .join("\n");

    expect(security?.content).toContain("py2.8");
    expect(security?.content).toContain("挖矿脚本");
    expect(security?.content).not.toMatch(/服务器地址|账号|漏洞入口|攻击步骤/);
    expect(publicText).not.toContain("精通");
  });
});
