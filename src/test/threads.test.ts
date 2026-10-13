import { beforeEach, describe, expect, it } from "vitest";
import { clearThreads, createThread, deleteThread, readThreads, saveMessages } from "@/lib/threads";
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
  it("deletes only the selected chat and preserves other conversations", () => {
    createThread("first");
    createThread("second");
    saveMessages("second", [{ id: "ruby", role: "user", parts: [{ type: "text", text: "Ruby" }] }]);
    deleteThread("first");
    expect(readThreads().map((t) => t.id)).toEqual(["second"]);
    expect(readThreads()[0]?.messages[0]?.parts).toEqual([{ type: "text", text: "Ruby" }]);
  });
  it("clears every saved chat from browser history", () => {
    createThread("first");
    createThread("second");
    clearThreads();
    expect(readThreads()).toEqual([]);
  });
  it("does not restore a deleted chat when a pending reply finishes", () => {
    createThread("first");
    deleteThread("first");
    saveMessages("first", [{ id: "late", role: "assistant", parts: [{ type: "text", text: "Late reply" }] }]);
    expect(readThreads()).toEqual([]);
  });
});
