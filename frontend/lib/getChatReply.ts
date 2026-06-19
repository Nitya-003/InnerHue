import { getFallbackResponse } from '@/lib/chatFallback';

type ChatMessage = { role: string; content: string };

/**
 * Tries POST /api/chat (when a Node server exposes it, e.g. `next dev` with a route handler).
 * On static export (GitHub Pages) there is no API — uses local fallbacks.
 */
export async function getChatReply(
  messages: ChatMessage[],
  emotion: string | undefined,
  signal?: AbortSignal
): Promise<string> {
  try {
    const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const res = await fetch(`${prefix}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        emotion: emotion ?? 'default',
      }),
      signal,
    });
    if (res.ok) {
      const data = (await res.json()) as { reply?: unknown };
      if (typeof data.reply === 'string' && data.reply.trim()) {
        return data.reply;
      }
    }
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw e;
    }
    // network / 404 on static hosting
  }
  return getFallbackResponse(emotion ?? 'default', messages.length);
}
