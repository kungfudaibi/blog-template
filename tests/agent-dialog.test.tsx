import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AgentLauncher } from "@/components/agent/AgentLauncher";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AgentLauncher", () => {
  it("opens with keyboard focus, sends a question, renders citations, and restores focus", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const fetchStub = vi.fn<typeof fetch>(() =>
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    vi.stubGlobal("fetch", fetchStub);
    const user = userEvent.setup();

    render(<AgentLauncher />);

    const launcher = screen.getByRole("button", { name: "询问阿竹" });
    expect(screen.getByRole("img", { name: "阿竹像素机器人" }))
      .toHaveAttribute("src", expect.stringContaining("azhu.png"));

    await user.click(launcher);

    const dialog = screen.getByRole("dialog", { name: "问问阿竹" });
    const questionInput = screen.getByRole("textbox", { name: "你的问题" });
    expect(dialog).toBeInTheDocument();
    expect(questionInput).toHaveFocus();
    expect(screen.getByText("还没有对话")).toBeInTheDocument();

    await user.type(questionInput, "zhujiechong 是做什么的？");
    await user.keyboard("{Control>}{Enter}{/Control}");

    expect(screen.getByRole("status")).toHaveTextContent("阿竹正在思考");
    expect(fetchStub).toHaveBeenCalledWith(
      "/api/agent",
      expect.objectContaining({ method: "POST" }),
    );

    resolveRequest?.(
      Response.json({
        answer: "他是一名程序员。",
        citations: [{ title: "公开介绍", href: "/about" }],
        scope: "personal",
        model: "mock",
      }),
    );

    expect(await screen.findByText("他是一名程序员。")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "公开介绍" })).toHaveAttribute(
      "href",
      "/about",
    );

    await user.keyboard("{Escape}");
    await waitFor(() => expect(launcher).toHaveFocus());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows a safe retry state for API failures", async () => {
    const fetchStub = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json(
        {
          error: {
            code: "MODEL_NOT_CONFIGURED",
            message: "阿竹的模型服务尚未配置好，请稍后再试。",
            retryable: false,
          },
        },
        { status: 503 },
      ),
    );
    vi.stubGlobal("fetch", fetchStub);
    const user = userEvent.setup();

    render(<AgentLauncher />);
    await user.click(screen.getByRole("button", { name: "询问阿竹" }));
    await user.type(screen.getByRole("textbox", { name: "你的问题" }), "什么是 TypeScript？");
    await user.click(screen.getByRole("button", { name: "发送问题" }));

    expect(
      await screen.findByText("阿竹的模型服务尚未配置好，请稍后再试。"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "重试" })).not
      .toBeInTheDocument();
  });

  it("never renders external or traversal-shaped citations", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({
          answer: "测试回答",
          citations: [
            { title: "外部地址", href: "https://unexpected.example" },
            { title: "目录穿越", href: "/../private" },
          ],
          scope: "professional",
          model: "mock",
        }),
      ),
    );
    const user = userEvent.setup();

    render(<AgentLauncher />);
    await user.click(screen.getByRole("button", { name: "询问阿竹" }));
    await user.type(screen.getByRole("textbox", { name: "你的问题" }), "什么是 API？");
    await user.click(screen.getByRole("button", { name: "发送问题" }));

    expect(await screen.findByText("测试回答")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
