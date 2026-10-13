import type { UIMessage } from 'ai';
export type NinjaThread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };
const KEY = 'code-ninja-threads-v1';
export function readThreads(): NinjaThread[] {
  if (typeof window === 'undefined') return [];
  try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value.filter(t => typeof t.id === 'string' && Array.isArray(t.messages)) : []; } catch { return []; }
}
export function writeThreads(threads: NinjaThread[]) { localStorage.setItem(KEY, JSON.stringify(threads)); }
export function createThread(id: string = crypto.randomUUID()): NinjaThread {
  const thread = { id, title: 'New Session', updatedAt: Date.now(), messages: [] };
  const threads = readThreads();
  const existing = threads.find(t => t.id === id);
  if (existing) return existing;
  writeThreads([thread, ...threads]); return thread;
}
export function saveMessages(id: string, messages: UIMessage[]) {
  const threads = readThreads();
  const thread = threads.find(t => t.id === id);
  if (!thread) return;
  const first = messages.find(m => m.role === 'user')?.parts.find(p => p.type === 'text');
  writeThreads(threads.map(t => t.id === id ? { ...t, messages, title: first?.type === 'text' ? first.text.slice(0, 28) : t.title, updatedAt: Date.now() } : t));
}
