import { beforeEach, describe, expect, it } from "vitest";
import { createThread, readThreads, saveMessages } from "@/lib/threads";
describe("Browser-saved conversations", () => {
  beforeEach(() => localStorage.clear());
  it("creates separate conversations and saves each message in its own thread", () => {
    createThread("first");
    createThread("second");
    saveMessages("first", [
      { id: "msg_first", role: "user", parts: [{ type: "text", text: "Emerald" }] },
    ]);
    saveMessages("second", [
      { id: "msg_second", role: "user", parts: [{ type: "text", text: "Ruby" }] },
    ]);
    expect(readThreads().find((t) => t.id === "first")?.messages[0]?.parts).toEqual([
      { type: "text", text: "Emerald" },
    ]);
    expect(readThreads().find((t) => t.id === "second")?.messages[0]?.parts).toEqual([
      { type: "text", text: "Ruby" },
    ]);
  });
  it("restores an existing conversation without duplicating it", () => {
    createThread("first");
    createThread("first");
    expect(readThreads().map((t) => t.id)).toEqual(["first"]);
  });
});
