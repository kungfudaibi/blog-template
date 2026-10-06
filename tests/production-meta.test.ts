import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ErrorPage from "@/app/error";
import NotFoundPage from "@/app/not-found";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getSiteUrl } from "@/lib/site";
import {
  createSecurityHeaderRules,
  createSecurityHeaders,
} from "@/lib/security-headers";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("public discovery metadata", () => {
  it("uses the public domain for a production build without SITE_URL", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("NODE_ENV", "production");

    expect(getSiteUrl().origin).toBe("https://www.zhujiechong.org");
  });

  it("does not publish a localhost canonical when local settings reach production", () => {
    vi.stubEnv("SITE_URL", "http://localhost:3000");
    vi.stubEnv("NODE_ENV", "production");

    expect(getSiteUrl().origin).toBe("https://www.zhujiechong.org");
  });

  it("lists only public pages in the sitemap", async () => {
    vi.stubEnv("SITE_URL", "https://zhujiechong.example");

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        "https://zhujiechong.example/",
        "https://zhujiechong.example/about",
        "https://zhujiechong.example/blog",
        "https://zhujiechong.example/capabilities",
        "https://zhujiechong.example/projects",
        encodeURI("https://zhujiechong.example/blog/运维日志-与codex救回系统盘"),
        "https://zhujiechong.example/moments/disco-elysium",
        "https://zhujiechong.example/projects/campus-mirror",
        "https://zhujiechong.example/projects/fpga-smart-car",
      ]),
    );
    expect(urls.filter((url) => url.includes("/projects/"))).toEqual([
      "https://zhujiechong.example/projects/campus-mirror",
      "https://zhujiechong.example/projects/fpga-smart-car",
    ]);
    expect(urls.some((url) => url.includes("building-this-site") || url.includes("content-is-a-contract")))
      .toBe(false);
    expect(urls.every((url) => !url.includes("/api/") && !url.includes("/profile/"))).toBe(
      true,
    );
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("publishes crawler rules and the canonical sitemap address", () => {
    vi.stubEnv("SITE_URL", "https://zhujiechong.example");

    expect(robots()).toEqual({
      rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
      sitemap: "https://zhujiechong.example/sitemap.xml",
      host: "https://zhujiechong.example",
    });
  });
});

describe("security response headers", () => {
  it("uses a production CSP without development-only script evaluation", () => {
    const headers = Object.fromEntries(
      createSecurityHeaders(false).map(({ key, value }) => [key, value]),
    );

    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("connect-src 'self'");
    expect(headers["Content-Security-Policy"]).not.toContain("'unsafe-eval'");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });

  it("keeps Next development tooling usable without weakening production", () => {
    const headers = Object.fromEntries(
      createSecurityHeaders(true).map(({ key, value }) => [key, value]),
    );

    expect(headers["Content-Security-Policy"]).toContain("'unsafe-eval'");
    expect(headers["Content-Security-Policy"]).toContain("ws:");
  });

  it("applies the headers to every route", async () => {
    const rules = createSecurityHeaderRules(false);

    expect(rules).toEqual([
      expect.objectContaining({
        source: "/:path*",
        headers: expect.arrayContaining([
          expect.objectContaining({ key: "Content-Security-Policy" }),
        ]),
      }),
    ]);
  });
});

describe("branded recovery pages", () => {
  it("offers a route home from a missing page", () => {
    render(createElement(NotFoundPage));

    expect(screen.getByRole("heading", { name: "页面没有找到" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/");
  });

  it("lets visitors retry an application error without exposing its details", () => {
    const reset = vi.fn();

    render(createElement(ErrorPage, { error: new Error("private failure"), reset }));

    screen.getByRole("button", { name: "再试一次" }).click();
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.queryByText("private failure")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/");
  });
});
