import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText, type ModelMessage } from "ai";
import { CHAT_MODEL } from "@/lib/ai-model";

export function createOpenRouterCall(
  request: Request,
  apiKey: string,
  messages: ModelMessage[],
  system: string,
) {
  const provider = createOpenAICompatible({
    name: "openrouter",
    baseURL: CHAT_MODEL.baseURL,
    apiKey,
    headers: { "X-OpenRouter-Title": "The Code Ninja" },
  });
  return streamText({
    model: provider.chatModel(CHAT_MODEL.id),
    system,
    messages,
    maxRetries: 0,
    abortSignal: request.signal,
  });
}