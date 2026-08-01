"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AgentCitation = {
  title: string;
  href: string;
};

export type AgentMessage = {
  id: number;
  role: "user" | "agent";
  content: string;
  citations: AgentCitation[];
};

type AgentChatError = {
  message: string;
  retryable: boolean;
};

type AgentChatStatus = "idle" | "loading" | "error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isInternalHref(value: string) {
  return value.startsWith("/")
    && !value.startsWith("//")
    && !value.split("/").includes("..");
}

function parseCitations(value: unknown): AgentCitation[] {
  if (!Array.isArray(value)) return [];

  const citations = value
    .filter((citation): citation is { title: string; href: string } =>
      isRecord(citation)
      && typeof citation.title === "string"
      && citation.title.trim().length > 0
      && citation.title.trim().length <= 120
      && typeof citation.href === "string"
      && isInternalHref(citation.href),
    )
    .map((citation) => ({
      title: citation.title.trim(),
      href: citation.href,
    }));

  return [
    ...new Map(citations.map((citation) => [citation.href, citation])).values(),
  ].slice(0, 3);
}

function parseSuccess(value: unknown) {
  if (
    !isRecord(value)
    || typeof value.answer !== "string"
    || value.answer.trim().length === 0
    || Array.from(value.answer).length > 2_000
    || (value.scope !== "personal" && value.scope !== "professional")
    || !(
      value.model === null
      || (
        typeof value.model === "string"
        && value.model.length > 0
        && value.model.length <= 200
      )
    )
  ) {
    return undefined;
  }

  return {
    answer: value.answer.trim(),
    citations: parseCitations(value.citations),
  };
}

function parseFailure(value: unknown): AgentChatError {
  if (
    isRecord(value)
    && isRecord(value.error)
    && typeof value.error.message === "string"
    && value.error.message.length > 0
    && value.error.message.length <= 200
    && typeof value.error.retryable === "boolean"
  ) {
    return {
      message: value.error.message,
      retryable: value.error.retryable,
    };
  }

  return { message: "阿竹暂时无法回答，请稍后再试。", retryable: true };
}

async function readResponse(response: Response) {
  try {
    return await response.json() as unknown;
  } catch {
    return undefined;
  }
}

export function useAgentChat() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [status, setStatus] = useState<AgentChatStatus>("idle");
  const [error, setError] = useState<AgentChatError>();
  const nextMessageId = useRef(1);
  const lastQuestion = useRef<string | undefined>(undefined);
  const activeRequest = useRef<AbortController | undefined>(undefined);

  useEffect(() => () => activeRequest.current?.abort(), []);

  const sendQuestion = useCallback(async (
    rawQuestion: string,
    appendUserMessage = true,
  ) => {
    const question = rawQuestion.trim();
    if (!question || question.length > 500 || activeRequest.current) return;

    lastQuestion.current = question;
    setError(undefined);
    setStatus("loading");
    if (appendUserMessage) {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "user",
          content: question,
          citations: [],
        },
      ]);
    }

    const controller = new AbortController();
    activeRequest.current = controller;

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });
      const payload = await readResponse(response);

      if (!response.ok) throw parseFailure(payload);

      const parsed = parseSuccess(payload);
      if (!parsed) throw parseFailure(undefined);

      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "agent",
          content: parsed.answer,
          citations: parsed.citations,
        },
      ]);
      setStatus("idle");
    } catch (reason) {
      if (controller.signal.aborted) return;

      const normalized = isRecord(reason)
        && typeof reason.message === "string"
        && typeof reason.retryable === "boolean"
        ? { message: reason.message, retryable: reason.retryable }
        : parseFailure(undefined);
      setError(normalized);
      setStatus("error");
    } finally {
      if (activeRequest.current === controller) activeRequest.current = undefined;
    }
  }, []);

  const retry = useCallback(() => {
    if (lastQuestion.current) void sendQuestion(lastQuestion.current, false);
  }, [sendQuestion]);

  return { messages, status, error, sendQuestion, retry };
}
