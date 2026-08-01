import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AgentLauncher } from "@/components/agent/AgentLauncher";

afterEach(() => {
  vi.unstubAllGlobals();
});

async function openAndAsk(question: string) {
  const user = userEvent.setup();

  render(<AgentLauncher />);
  await user.click(screen.getByRole("button", { name: "询问阿竹" }));
  await user.type(screen.getByRole("textbox", { name: "你的问题" }), question);
  await user.click(screen.getByRole("button", { name: "发送问题" }));

  return user;
}

describe("agent question flow", () => {
  it("retries a recoverable failure without duplicating the user message", async () => {
    const fetchStub = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json(
          {
            error: {
              code: "MODEL_TIMEOUT",
              message: "阿竹这次思考超时了，请稍后重试。",
              retryable: true,
            },
          },
          { status: 504 },
        ),
      )
      .mockResolvedValueOnce(
        Response.json({
          answer: "重试后的通用技术回答。",
          citations: [],
          scope: "professional",
          model: "mock",
        }),
      );
    vi.stubGlobal("fetch", fetchStub);

    const user = await openAndAsk("什么是 TypeScript？");
    expect(
      await screen.findByText("阿竹这次思考超时了，请稍后重试。"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "重试" }));

    expect(await screen.findByText("重试后的通用技术回答。")).toBeInTheDocument();
    expect(fetchStub).toHaveBeenCalledTimes(2);
    expect(screen.getAllByRole("article", { name: "你的消息" })).toHaveLength(1);
  });

  it("renders an honest no-source answer as a normal completed response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({
          answer: "关于这个问题，我目前没有足够的公开资料，不能替 zhujiechong 猜测。",
          citations: [],
          scope: "personal",
          model: null,
        }),
      ),
    );

    await openAndAsk("zhujiechong 的出生日期是什么？");

    const answer = await screen.findByRole("article", { name: "阿竹的回答" });
    expect(within(answer).getByText(/没有足够的公开资料/)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("fails safely when a successful HTTP response has an invalid shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({ answer: "缺少响应契约字段" }),
      ),
    );

    await openAndAsk("什么是 API？");

    expect(
      await screen.findByText("阿竹暂时无法回答，请稍后再试。"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "重试" })).toBeInTheDocument();
  });
});
