import {
  buildAgentSources,
  CloudflareModelProvider,
  SlidingWindowRateLimiter,
} from "@/lib/agent";
import { createAgentHandler } from "@/lib/agent/handler";

export const runtime = "nodejs";

const rateLimiter = new SlidingWindowRateLimiter({
  maxRequests: 5,
  windowMs: 60_000,
});

export const POST = createAgentHandler({
  createProvider: () => new CloudflareModelProvider(),
  loadSources: buildAgentSources,
  rateLimiter,
});
