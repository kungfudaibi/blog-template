import { z } from "zod";

import { ModelProviderError } from "./provider";

export const CLOUDFLARE_DEFAULT_MODEL = "@cf/qwen/qwen3-30b-a3b-fp8";

const cloudflareConfigSchema = z
  .object({
    accountId: z.string().regex(/^[a-f0-9]{32}$/i),
    apiToken: z.string().min(20).max(512),
    model: z
      .string()
      .regex(/^@cf\/[a-z0-9_.-]+\/[a-z0-9_.-]+$/i),
  })
  .strict();

export type CloudflareConfig = z.infer<typeof cloudflareConfigSchema>;

export function readCloudflareConfig(
  env: Record<string, string | undefined> = process.env,
): CloudflareConfig {
  const parsed = cloudflareConfigSchema.safeParse({
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: env.CLOUDFLARE_AI_API_TOKEN,
    model: env.CLOUDFLARE_AI_MODEL || CLOUDFLARE_DEFAULT_MODEL,
  });

  if (!parsed.success) {
    throw new ModelProviderError(
      "NOT_CONFIGURED",
      "Cloudflare Workers AI 尚未正确配置",
      false,
    );
  }

  return parsed.data;
}
