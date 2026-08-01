"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { MAX_QUESTION_CHARACTERS } from "@/lib/agent/constants";

import { PixelAgent } from "./PixelAgent";
import type { AgentMessage } from "./useAgentChat";

type AgentDialogProps = {
  messages: AgentMessage[];
  status: "idle" | "loading" | "error";
  error?: { message: string; retryable: boolean };
  onClose: () => void;
  onSubmit: (question: string) => void;
  onRetry: () => void;
};

export function AgentDialog({
  messages,
  status,
  error,
  onClose,
  onSubmit,
  onRetry,
}: AgentDialogProps) {
  const [question, setQuestion] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || status === "loading") return;

    onSubmit(trimmedQuestion);
    setQuestion("");
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), textarea:not([disabled])",
      ) ?? [],
    );
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <div className="agent-overlay" role="presentation">
      <div
        ref={dialogRef}
        className="agent-dialog"
        id="agent-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-dialog-title"
        aria-describedby="agent-dialog-description"
        onKeyDown={handleDialogKeyDown}
      >
        <header className="agent-dialog__header">
          <PixelAgent size={76} decorative />
          <div>
            <p className="eyebrow">PUBLIC PROFILE AGENT</p>
            <h2 id="agent-dialog-title">问问阿竹</h2>
            <p id="agent-dialog-description">只根据公开资料回答个人问题。</p>
          </div>
          <button type="button" className="agent-dialog__close" onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">关闭阿竹</span>
          </button>
        </header>

        <div className="agent-dialog__messages" role="log" aria-live="polite">
          {messages.length === 0 ? (
            <div className="agent-dialog__empty">
              <strong>还没有对话</strong>
              <p>可以问我的公开资料、作品、文章，或博客涉及的专业问题。</p>
            </div>
          ) : (
            messages.map((message) => (
              <article
                className={`agent-message agent-message--${message.role}`}
                key={message.id}
                aria-label={message.role === "user" ? "你的消息" : "阿竹的回答"}
              >
                <p>{message.content}</p>
                {message.citations.length > 0 ? (
                  <nav aria-label="回答引用">
                    <span>参考：</span>
                    {message.citations.map((citation) => (
                      <Link href={citation.href} key={citation.href}>
                        {citation.title}
                      </Link>
                    ))}
                  </nav>
                ) : null}
              </article>
            ))
          )}

          {status === "loading" ? (
            <p className="agent-dialog__status" role="status">
              阿竹正在思考<span aria-hidden="true">…</span>
            </p>
          ) : null}
          {status === "error" && error ? (
            <div className="agent-dialog__error" role="alert">
              <p>{error.message}</p>
              {error.retryable ? (
                <button type="button" onClick={onRetry}>重试</button>
              ) : null}
            </div>
          ) : null}
        </div>

        <form className="agent-dialog__form" onSubmit={submit}>
          <label htmlFor="agent-question">你的问题</label>
          <textarea
            ref={inputRef}
            id="agent-question"
            name="question"
            rows={2}
            maxLength={MAX_QUESTION_CHARACTERS}
            value={question}
            disabled={status === "loading"}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                submit();
              }
            }}
          />
          <div>
            <small>Ctrl / ⌘ + Enter 发送 · 最多 {MAX_QUESTION_CHARACTERS} 字</small>
            <button
              type="submit"
              disabled={status === "loading" || question.trim().length === 0}
            >
              发送问题
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
