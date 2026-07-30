import { ModelProviderError } from "./provider";

export type AgentApiErrorCode =
  | "INVALID_REQUEST"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "MODEL_NOT_CONFIGURED"
  | "MODEL_RATE_LIMITED"
  | "MODEL_TIMEOUT"
  | "MODEL_UNAVAILABLE"
  | "INTERNAL_ERROR";

export class AgentApiError extends Error {
  override readonly name = "AgentApiError";

  constructor(
    readonly code: AgentApiErrorCode,
    message: string,
    readonly status: number,
    readonly retryable = false,
  ) {
    super(message);
  }
}

export function normalizeAgentError(error: unknown): AgentApiError {
  if (error instanceof AgentApiError) return error;

  if (error instanceof ModelProviderError) {
    switch (error.code) {
      case "NOT_CONFIGURED":
      case "AUTHENTICATION_FAILED":
        return new AgentApiError(
          "MODEL_NOT_CONFIGURED",
          "阿竹的模型服务尚未配置好，请稍后再试。",
          503,
          false,
        );
      case "RATE_LIMITED":
        return new AgentApiError(
          "MODEL_RATE_LIMITED",
          "阿竹今天的免费模型额度可能已经用完，请稍后再试。",
          503,
          true,
        );
      case "TIMEOUT":
        return new AgentApiError(
          "MODEL_TIMEOUT",
          "阿竹这次思考超时了，请稍后重试。",
          504,
          true,
        );
      case "UPSTREAM_ERROR":
      case "INVALID_RESPONSE":
        return new AgentApiError(
          "MODEL_UNAVAILABLE",
          "阿竹暂时无法连接模型服务，请稍后重试。",
          503,
          true,
        );
      case "INVALID_REQUEST":
        return new AgentApiError(
          "INTERNAL_ERROR",
          "阿竹暂时无法处理这个问题。",
          500,
          false,
        );
    }
  }

  return new AgentApiError(
    "INTERNAL_ERROR",
    "阿竹暂时遇到问题，请稍后重试。",
    500,
    true,
  );
}
