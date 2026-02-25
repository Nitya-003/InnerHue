/**
 * Mood type definitions for InnerHue application
 */

/**
 * Represents a mood with its visual properties
 */
export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
}

/**
 * Represents mood suggestions for journaling and activities
 */
export interface MoodSuggestion {
  prompt: string;
  quote: string;
  author: string;
  keywords: string[];
  music: string;
}

/**
 * Represents a song in a music playlist
 */
export interface Song {
  title: string;
  artist: string;
  duration: string;
}

/**
 * Represents a music playlist for a mood
 */
export interface MoodPlaylist {
  id: string;
  name: string;
  description: string;
  color: string;
  songs: Song[];
}

/**
 * Represents a mood entry in the history
 */
export interface MoodHistoryEntry {
  mood: string;
  timestamp: string;
  date: string;
}
