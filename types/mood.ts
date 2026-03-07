/**
 * Mood types for InnerHue application
 */

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  spotifyPlaylistId?: string;
}

export interface MoodHistoryEntry {
  id: string;
  mood: string;
  timestamp: string;
  date: string;
  color?: string;
  emotion?: string;
}

export interface Suggestion {
  prompt: string;
  quote: string;
  author: string;
  keywords: string[];
  music: string;
}

export interface MoodStats {
  totalEntries: number;
  todayEntries: number;
  weekEntries: number;
  mostCommonMood: string | null;
  moodCounts: { [key: string]: number };
  weeklyData: MoodHistoryEntry[];
}
