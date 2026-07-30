import { describe, expect, it } from "vitest";

import { SlidingWindowRateLimiter } from "@/lib/agent";

describe("SlidingWindowRateLimiter", () => {
  it("blocks requests inside the window and recovers after expiry", () => {
    const limiter = new SlidingWindowRateLimiter({
      maxRequests: 2,
      windowMs: 60_000,
    });

    expect(limiter.check("client", 1_000).allowed).toBe(true);
    expect(limiter.check("client", 2_000).allowed).toBe(true);
    expect(limiter.check("client", 3_000)).toEqual({
      allowed: false,
      retryAfterSeconds: 58,
    });
    expect(limiter.check("client", 61_001).allowed).toBe(true);
  });

  it("keeps independent windows for different client keys", () => {
    const limiter = new SlidingWindowRateLimiter({
      maxRequests: 1,
      windowMs: 60_000,
    });

    expect(limiter.check("first", 1_000).allowed).toBe(true);
    expect(limiter.check("first", 2_000).allowed).toBe(false);
    expect(limiter.check("second", 2_000).allowed).toBe(true);
  });

  it("rejects mutable or non-finite limit configurations", () => {
    expect(
      () => new SlidingWindowRateLimiter({ maxRequests: Number.NaN, windowMs: 1 }),
    ).toThrow(/positive integers/);
    expect(
      () => new SlidingWindowRateLimiter({ maxRequests: 1, windowMs: 0 }),
    ).toThrow(/positive integers/);
  });
});
