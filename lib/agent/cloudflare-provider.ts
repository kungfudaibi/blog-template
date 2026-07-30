import { z } from "zod";

import { readCloudflareConfig, type CloudflareConfig } from "./env";
import {
  ModelProviderError,
  type ModelProvider,
  type ModelRequest,
  type ModelResponse,
} from "./provider";

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_TOKENS = 400;
const MAX_OUTPUT_TOKENS = 600;
const MAX_PROMPT_CHARACTERS = 10_000;

const cloudflareEnvelopeSchema = z.object({
  success: z.boolean(),
  result: z.unknown().optional(),
});

const cloudflareResultSchema = z.object({
  response: z.string().trim().min(1),
});

type CloudflareModelProviderOptions = {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  timeoutMs?: number;
};

function requestError(message: string) {
  return new ModelProviderError("INVALID_REQUEST", message, false);
}

function normalizeRequest(request: ModelRequest) {
  const prompt = request.prompt.trim();

  if (prompt.length === 0 || prompt.length > MAX_PROMPT_CHARACTERS) {
    throw requestError("模型提示词长度无效");
  }

  const maxTokens = request.maxTokens ?? DEFAULT_MAX_TOKENS;
  const temperature = request.temperature ?? 0.2;

  if (!Number.isFinite(maxTokens) || maxTokens < 1) {
    throw requestError("模型输出长度无效");
  }
  if (!Number.isFinite(temperature) || temperature < 0 || temperature > 1) {
    throw requestError("模型温度参数无效");
  }

  return {
    prompt,
    max_tokens: Math.min(Math.floor(maxTokens), MAX_OUTPUT_TOKENS),
    temperature,
    stream: false,
  };
}

function responseError(status: number) {
  if (status === 401 || status === 403) {
    return new ModelProviderError(
      "AUTHENTICATION_FAILED",
      "Cloudflare Workers AI 认证失败",
      false,
    );
  }

  if (status === 429) {
    return new ModelProviderError(
      "RATE_LIMITED",
      "Cloudflare Workers AI 免费额度或请求频率已达上限",
      true,
    );
  }

  return new ModelProviderError(
    "UPSTREAM_ERROR",
    "Cloudflare Workers AI 暂时不可用",
    status >= 500,
  );
}

export class CloudflareModelProvider implements ModelProvider {
  private readonly config: CloudflareConfig;
  private readonly fetchImplementation: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: CloudflareModelProviderOptions = {}) {
    this.config = readCloudflareConfig(options.env);
    this.fetchImplementation = options.fetch ?? fetch;
    this.timeoutMs = Math.min(
      Math.max(1, Math.floor(options.timeoutMs ?? DEFAULT_TIMEOUT_MS)),
      MAX_TIMEOUT_MS,
    );
  }

  async generate(request: ModelRequest): Promise<ModelResponse> {
    const body = normalizeRequest(request);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    let response: Response;

    try {
      // Source: https://developers.cloudflare.com/workers-ai/get-started/rest-api/
      response = await this.fetchImplementation(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/ai/run/${this.config.model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        },
      );
    } catch {
      if (controller.signal.aborted) {
        throw new ModelProviderError(
          "TIMEOUT",
          "Cloudflare Workers AI 请求超时",
          true,
        );
      }

      throw new ModelProviderError(
        "UPSTREAM_ERROR",
        "Cloudflare Workers AI 网络请求失败",
        true,
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) throw responseError(response.status);

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new ModelProviderError(
        "INVALID_RESPONSE",
        "Cloudflare Workers AI 返回了无效响应",
        true,
      );
    }

    const envelope = cloudflareEnvelopeSchema.safeParse(payload);
    if (!envelope.success) {
      throw new ModelProviderError(
        "INVALID_RESPONSE",
        "Cloudflare Workers AI 返回了无效响应",
        true,
      );
    }
    if (!envelope.data.success) throw responseError(502);

    const result = cloudflareResultSchema.safeParse(envelope.data.result);
    if (!result.success) {
      throw new ModelProviderError(
        "INVALID_RESPONSE",
        "Cloudflare Workers AI 返回了无效响应",
        true,
      );
    }

    return { text: result.data.response, model: this.config.model };
  }
}
