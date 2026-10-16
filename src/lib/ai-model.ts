// Public model identity only. Credentials are read inside the server handler.
export const CHAT_MODEL = {
  id: "cohere/north-mini-code:free",
  label: "North Mini Code",
  baseURL: "https://openrouter.ai/api/v1",
} as const;
