import { describe, expect, it, vi } from "vitest";

import {
  CLOUDFLARE_DEFAULT_MODEL,
  CloudflareModelProvider,
  MockModelProvider,
  ModelProviderError,
} from "@/lib/agent";

const ACCOUNT_ID = "0123456789abcdef0123456789abcdef";
const API_TOKEN = "test-token-that-is-never-a-real-secret";

function testEnv(overrides: Record<string, string | undefined> = {}) {
  return {
    CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID,
    CLOUDFLARE_AI_API_TOKEN: API_TOKEN,
    ...overrides,
  };
}

describe("MockModelProvider", () => {
  it("returns a deterministic response without network access", async () => {
    const provider = new MockModelProvider("固定测试回答");

    await expect(provider.generate({ prompt: "测试问题" })).resolves.toEqual({
      text: "固定测试回答",
      model: "mock",
    });
    expect(provider.requests).toEqual([{ prompt: "测试问题" }]);
  });
});

describe("CloudflareModelProvider", () => {
  it("uses the documented REST endpoint and validates the success envelope", async () => {
    const fetchStub = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        result: { response: "来自 Qwen 的回答" },
        success: true,
        errors: [],
        messages: [],
      }),
    );
    const provider = new CloudflareModelProvider({
      env: testEnv(),
      fetch: fetchStub,
    });

    await expect(
      provider.generate({ prompt: "你好", maxTokens: 320, temperature: 0.2 }),
    ).resolves.toEqual({
      text: "来自 Qwen 的回答",
      model: CLOUDFLARE_DEFAULT_MODEL,
    });

    expect(fetchStub).toHaveBeenCalledOnce();
    const [url, init] = fetchStub.mock.calls[0] ?? [];
    expect(url).toBe(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${CLOUDFLARE_DEFAULT_MODEL}`,
    );
    expect(init?.headers).toMatchObject({
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    });
    expect(JSON.parse(String(init?.body))).toEqual({
      prompt: "你好",
      max_tokens: 320,
      temperature: 0.2,
      stream: false,
    });
  });

  it.each([
    [401, "AUTHENTICATION_FAILED", false],
    [403, "AUTHENTICATION_FAILED", false],
    [429, "RATE_LIMITED", true],
    [500, "UPSTREAM_ERROR", true],
  ] as const)(
    "maps HTTP %s to stable error code %s",
    async (status, code, retryable) => {
      const provider = new CloudflareModelProvider({
        env: testEnv(),
        fetch: vi.fn<typeof fetch>().mockResolvedValue(
          Response.json({ success: false }, { status }),
        ),
      });

      const error = await provider.generate({ prompt: "测试" }).catch(
        (reason) => reason,
      );

      expect(error).toBeInstanceOf(ModelProviderError);
      expect(error).toMatchObject({ code, retryable });
      expect(error.message).not.toContain(API_TOKEN);
    },
  );

  it("rejects a malformed successful response", async () => {
    const provider = new CloudflareModelProvider({
      env: testEnv(),
      fetch: vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({ result: {}, success: true, errors: [], messages: [] }),
      ),
    });

    await expect(provider.generate({ prompt: "测试" })).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
      retryable: true,
    });
  });

  it("does not expose upstream network details or tokens", async () => {
    const provider = new CloudflareModelProvider({
      env: testEnv(),
      fetch: vi.fn<typeof fetch>().mockRejectedValue(
        new Error(`network failed with ${API_TOKEN}`),
      ),
    });

    const error = await provider.generate({ prompt: "测试" }).catch(
      (reason) => reason,
    );

    expect(error).toMatchObject({ code: "UPSTREAM_ERROR", retryable: true });
    expect(error.message).not.toContain(API_TOKEN);
    expect(error.message).not.toContain("network failed");
  });

  it("normalizes non-Error fetch rejections", async () => {
    const provider = new CloudflareModelProvider({
      env: testEnv(),
      fetch: vi.fn<typeof fetch>().mockRejectedValue(null),
    });

    await expect(provider.generate({ prompt: "测试" })).rejects.toMatchObject({
      code: "UPSTREAM_ERROR",
      retryable: true,
    });
  });

  it("aborts slow requests and reports a retryable timeout", async () => {
    const hangingFetch = vi.fn<typeof fetch>((_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      }),
    );
    const provider = new CloudflareModelProvider({
      env: testEnv(),
      fetch: hangingFetch,
      timeoutMs: 5,
    });

    await expect(provider.generate({ prompt: "测试超时" })).rejects.toMatchObject({
      code: "TIMEOUT",
      retryable: true,
    });
  });

  it("fails closed when server-only configuration is absent or invalid", () => {
    expect(
      () =>
        new CloudflareModelProvider({
          env: {},
          fetch: vi.fn<typeof fetch>(),
        }),
    ).toThrowError(ModelProviderError);
    expect(
      () =>
        new CloudflareModelProvider({
          env: testEnv({ CLOUDFLARE_AI_MODEL: "https://unexpected.example" }),
          fetch: vi.fn<typeof fetch>(),
        }),
    ).toThrowError(ModelProviderError);
  });
});
