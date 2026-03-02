import { fallbackQuotes, Quote } from '@/data/fallbackQuotes';

export const getQuoteByMood = async (tag: string): Promise<Quote> => {
  try {
    const controller = new AbortController();
    // 2 second timeout for the API call
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://api.quotable.io/random?tags=${tag}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();
    return {
      content: data.content,
      author: data.author,
      tags: data.tags
    };
  } catch (error) {
    console.warn("Quote API failed or timed out, using fallback.");

    // Artificial delay for smooth UI transition (prevents instant layout shift)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter fallback quotes by tag
    const relevantQuotes = fallbackQuotes.filter(q => q.tags?.includes(tag));

    // If no specific tag match, use any quote
    const pool = relevantQuotes.length > 0 ? relevantQuotes : fallbackQuotes;

    return pool[Math.floor(Math.random() * pool.length)];
  }
};
