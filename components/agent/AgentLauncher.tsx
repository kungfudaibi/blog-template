"use client";

import { useCallback, useRef, useState } from "react";

import { AgentDialog } from "./AgentDialog";
import { PixelAgent } from "./PixelAgent";
import { useAgentChat } from "./useAgentChat";

export function AgentLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const chat = useAgentChat();

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    queueMicrotask(() => launcherRef.current?.focus());
  }, []);

  return (
    <aside className="agent-launcher" aria-label="阿竹助手">
      <button
        ref={launcherRef}
        type="button"
        className="agent-launcher__button"
        aria-label="询问阿竹"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="agent-dialog"
        onClick={() => setIsOpen(true)}
      >
        <PixelAgent size={72} />
        <span aria-hidden="true">问问阿竹</span>
      </button>

      {isOpen ? (
        <AgentDialog
          messages={chat.messages}
          status={chat.status}
          error={chat.error}
          onClose={closeDialog}
          onSubmit={(question) => void chat.sendQuestion(question)}
          onRetry={chat.retry}
        />
      ) : null}
    </aside>
  );
}
