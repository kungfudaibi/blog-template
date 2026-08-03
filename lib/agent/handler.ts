import { z } from "zod";

import {
  AgentApiError,
  normalizeAgentError,
} from "./errors";
import { buildAgentPrompt } from "./prompt";
import { ModelProviderError, type ModelProvider } from "./provider";
import type { RateLimiter } from "./rate-limit";
import { retrieveAgentSources } from "./retrieve";
import type { AgentSource, RetrievalResult } from "./types";
import {
  classifyQuestion,
  isProtectedIdentityQuestion,
  parseAgentRequest,
} from "./validation";

const MAX_REQUEST_BODY_CHARACTERS = 2_048;
const MAX_ANSWER_CHARACTERS = 2_000;

const modelResponseSchema = z
  .object({
    text: z.string().trim().min(1).max(10_000),
    model: z.string().trim().min(1).max(200),
  })
  .strict();

type AgentHandlerDependencies = {
  createProvider: () => ModelProvider;
  loadSources: () => Promise<AgentSource[]>;
  rateLimiter: RateLimiter;
};

function jsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]
    ?? "anonymous";

  return forwarded.trim().slice(0, 128) || "anonymous";
}

async function readJsonBody(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    throw new AgentApiError(
      "INVALID_REQUEST",
      "请求必须使用 application/json。",
      415,
      false,
    );
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BODY_CHARACTERS) {
    throw new AgentApiError("INVALID_REQUEST", "请求内容过长。", 400, false);
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_REQUEST_BODY_CHARACTERS) {
    throw new AgentApiError("INVALID_REQUEST", "请求内容过长。", 400, false);
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new AgentApiError("INVALID_REQUEST", "请求 JSON 无效。", 400, false);
  }
}

function citationsFor(result: RetrievalResult) {
  const citations = result.sources
    .filter(
      (source) =>
        source.href.startsWith("/")
        && !source.href.startsWith("//")
        && !source.href.split("/").includes(".."),
    )
    .map((source) => ({ title: source.title, href: source.href }));

  return [...new Map(citations.map((citation) => [citation.href, citation])).values()];
}

function limitAnswer(answer: string) {
  const characters = Array.from(answer.trim());

  return characters.length <= MAX_ANSWER_CHARACTERS
    ? characters.join("")
    : `${characters.slice(0, MAX_ANSWER_CHARACTERS - 1).join("").trimEnd()}…`;
}

function errorResponse(error: unknown) {
  const normalized = normalizeAgentError(error);

  return jsonResponse(
    {
      error: {
        code: normalized.code,
        message: normalized.message,
        retryable: normalized.retryable,
      },
    },
    normalized.status,
  );
}

export function createAgentHandler(dependencies: AgentHandlerDependencies) {
  return async function handleAgentRequest(request: Request) {
    try {
      const rateLimit = dependencies.rateLimiter.check(clientKey(request));
      if (!rateLimit.allowed) {
        return jsonResponse(
          {
            error: {
              code: "RATE_LIMITED",
              message: "提问有点频繁，请稍后再试。",
              retryable: true,
            },
          },
          429,
          { "retry-after": String(rateLimit.retryAfterSeconds) },
        );
      }

      const requestBody = await readJsonBody(request);
      const { question } = parseAgentRequest(requestBody);
      const scope = classifyQuestion(question);

      if (isProtectedIdentityQuestion(question)) {
        return jsonResponse({
          answer: "这些真实身份信息没有在本站公开，我不会猜测或协助反向识别站主。",
          citations: [],
          scope,
          model: null,
        });
      }

      const sources = await dependencies.loadSources();
      const retrieval = retrieveAgentSources(question, sources);

      if (scope === "personal" && retrieval.status === "insufficient") {
        return jsonResponse({
          answer: "关于这个问题，我目前没有足够的公开资料，不能替 zhujiechong 猜测。",
          citations: [],
          scope,
          model: null,
        });
      }

      const provider = dependencies.createProvider();
      const untrustedModelResponse = await provider.generate({
        prompt: buildAgentPrompt(question, scope, retrieval.sources),
        maxTokens: 400,
        temperature: 0.2,
      });
      const parsedModelResponse = modelResponseSchema.safeParse(
        untrustedModelResponse,
      );
      if (!parsedModelResponse.success) {
        throw new ModelProviderError(
          "INVALID_RESPONSE",
          "模型返回内容无效",
          true,
        );
      }
      const modelResponse = parsedModelResponse.data;
      const answer = scope === "professional"
        ? `以下回答基于通用技术知识，不代表 zhujiechong 的个人经历或观点。\n\n${modelResponse.text}`
        : modelResponse.text;

      return jsonResponse({
        answer: limitAnswer(answer),
        citations: citationsFor(retrieval),
        scope,
        model: modelResponse.model,
      });
    } catch (error) {
      return errorResponse(error);
    }
  };
}
