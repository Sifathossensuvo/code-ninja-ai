// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { CHAT_MODEL } from "@/lib/ai-model";
import { createOpenRouterCall } from "@/lib/server/openrouter";

afterEach(() => vi.unstubAllGlobals());

describe("OpenRouter chat", () => {
  it("uses the selected free coding model", () => {
    expect(CHAT_MODEL.id).toBe("cohere/north-mini-code:free");
    expect(CHAT_MODEL.id.endsWith(":free")).toBe(true);
  });

  it("streams through OpenRouter and keeps follow-up history", async () => {
    const fetchMock = vi.fn(async (_url: unknown, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.model).toBe("cohere/north-mini-code:free");
      expect(body.stream).toBe(true);
      expect(body.messages).toEqual([
        { role: "system", content: "Help with code." },
        { role: "user", content: "My project is Emerald." },
        { role: "assistant", content: "OK" },
        { role: "user", content: "What is my project name?" },
      ]);
      return new Response(
        'data: {"id":"test","object":"chat.completion.chunk","created":0,"model":"cohere/north-mini-code:free","choices":[{"index":0,"delta":{"role":"assistant","content":"Emerald"},"finish_reason":null}]}\n\n' +
          'data: {"id":"test","object":"chat.completion.chunk","created":0,"model":"cohere/north-mini-code:free","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}\n\n' +
          "data: [DONE]\n\n",
        { headers: { "Content-Type": "text/event-stream" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = createOpenRouterCall(
      new Request("http://localhost/api/chat"),
      "test-credential",
      [
        { role: "user", content: "My project is Emerald." },
        { role: "assistant", content: "OK" },
        { role: "user", content: "What is my project name?" },
      ],
      "Help with code.",
    );
    expect(await result.text).toBe("Emerald");
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://openrouter.ai/api/v1/chat/completions",
    );
  });
});
