import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const schema = z.object({
          conversationId: z.string().min(1).max(100),
          messages: z
            .array(
              z
                .object({
                  id: z.string().max(100),
                  role: z.enum(["user", "assistant"]),
                  parts: z.array(z.object({ type: z.string().max(80) }).passthrough()).max(100),
                })
                .passthrough(),
            )
            .min(1)
            .max(250),
        });
        try {
          const raw = await request.text();
          if (raw.length > 400000)
            return Response.json(
              { error: "Conversation is too large. Start a new session." },
              { status: 400 },
            );
          const parsed = schema.safeParse(JSON.parse(raw));
          if (!parsed.success)
            return Response.json({ error: "Invalid conversation." }, { status: 400 });
          const apiKey = process.env["OPENROUTER_API_KEY"];
          if (!apiKey)
            return Response.json(
              { error: "OpenRouter is not configured. Add OPENROUTER_API_KEY in your hosting environment settings and redeploy." },
              { status: 401 },
            );
          const { createOpenRouterCall } = await import("@/lib/server/openrouter");
          const messages = parsed.data.messages as UIMessage[];
          const result = createOpenRouterCall(
            request,
            apiKey,
            await convertToModelMessages(
              messages.map((message) => ({
                ...message,
                // OpenRouter cannot replay encrypted reasoning from the previous provider.
                parts: message.parts.filter((part) => part.type === "text"),
              })),
            ),
            "You are The Code Ninja, a friendly expert coding assistant. Help generate, explain, fix and optimize code. Be concise, practical, and use markdown with fenced code blocks. Never pretend to run code, search the web, or create files. Your user works in a neon hacker terminal.",
          );
          const response = result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: true,
            onFinish: () => {},
            onError: (error) => {
              const e = error as { responseBody?: string; message?: string };
              try {
                const body = JSON.parse(e.responseBody || "{}");
                return body.message || body.error?.message || e.message || "AI request failed.";
              } catch {
                return e.message || "AI request failed.";
              }
            },
          });
          return response;
        } catch (error) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return Response.json(
            { error: error instanceof Error ? error.message : "Unable to process this request." },
            { status: 400 },
          );
        }
      },
    },
  },
});
