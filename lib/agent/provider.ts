export type ModelRequest = {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
};

export type ModelResponse = {
  text: string;
  model: string;
};

export interface ModelProvider {
  generate(request: ModelRequest): Promise<ModelResponse>;
}

export type ModelProviderErrorCode =
  | "NOT_CONFIGURED"
  | "INVALID_REQUEST"
  | "AUTHENTICATION_FAILED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "UPSTREAM_ERROR"
  | "INVALID_RESPONSE";

export class ModelProviderError extends Error {
  override readonly name = "ModelProviderError";

  constructor(
    readonly code: ModelProviderErrorCode,
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}

export class MockModelProvider implements ModelProvider {
  readonly requests: ModelRequest[] = [];

  constructor(private readonly responseText = "模拟回答") {}

  async generate(request: ModelRequest): Promise<ModelResponse> {
    this.requests.push({ ...request });

    return { text: this.responseText, model: "mock" };
  }
}
