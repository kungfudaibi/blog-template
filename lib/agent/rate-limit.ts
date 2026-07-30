export type RateLimitDecision = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export interface RateLimiter {
  check(key: string, now?: number): RateLimitDecision;
}

type SlidingWindowRateLimiterOptions = {
  maxRequests: number;
  windowMs: number;
  maxTrackedClients?: number;
};

export class SlidingWindowRateLimiter implements RateLimiter {
  private readonly attempts = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly maxTrackedClients: number;

  constructor(options: SlidingWindowRateLimiterOptions) {
    if (
      !Number.isInteger(options.maxRequests)
      || options.maxRequests < 1
      || !Number.isInteger(options.windowMs)
      || options.windowMs < 1
      || (
        options.maxTrackedClients !== undefined
        && (
          !Number.isInteger(options.maxTrackedClients)
          || options.maxTrackedClients < 1
        )
      )
    ) {
      throw new Error("Rate limiter options must be positive integers");
    }

    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
    this.maxTrackedClients = Math.max(100, options.maxTrackedClients ?? 10_000);
  }

  check(key: string, now = Date.now()): RateLimitDecision {
    const cutoff = now - this.windowMs;
    const recentAttempts = (this.attempts.get(key) ?? []).filter(
      (timestamp) => timestamp > cutoff,
    );

    if (recentAttempts.length >= this.maxRequests) {
      const retryAfterMs = this.windowMs - (now - recentAttempts[0]);
      this.attempts.set(key, recentAttempts);

      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1_000)),
      };
    }

    this.reserveClientSlot(key, cutoff);
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return { allowed: true, retryAfterSeconds: 0 };
  }

  private reserveClientSlot(key: string, cutoff: number) {
    if (this.attempts.has(key) || this.attempts.size < this.maxTrackedClients) {
      return;
    }

    for (const [clientKey, timestamps] of this.attempts) {
      if (timestamps.every((timestamp) => timestamp <= cutoff)) {
        this.attempts.delete(clientKey);
      }
    }

    if (this.attempts.size >= this.maxTrackedClients) {
      const oldestClient = this.attempts.keys().next().value as string | undefined;
      if (oldestClient) this.attempts.delete(oldestClient);
    }
  }
}
