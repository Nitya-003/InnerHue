// Types for mood personalization features

export interface CustomColorPalette {
  moodId: string;
  primaryColor: string;
  glowColor: string;
}

export interface MoodSubcategory {
  id: string;
  name: string;
  parentMoodId: string;
  emoji?: string;
  description?: string;
  createdAt: number;
}

export interface MoodIntensity {
  moodId: string;
  intensity: number; // 1-10 scale
  timestamp: number;
}

export interface MoodCombination {
  id: string;
  name: string;
  description?: string;
  moodIds: string[]; // Array of mood IDs that make up this combination
  emoji?: string;
  color?: string;
  createdAt: number;
}

export interface CustomVocabulary {
  id: string;
  word: string;
  definition?: string;
  relatedMoodIds: string[];
  emoji?: string;
  color?: string;
  category?: 'positive' | 'negative' | 'neutral' | 'energetic' | 'calm' | 'stress' | 'intense' | 'playful';
  createdAt: number;
}

export interface PersonalizationSettings {
  customPalettes: CustomColorPalette[];
  subcategories: MoodSubcategory[];
  moodCombinations: MoodCombination[];
  customVocabulary: CustomVocabulary[];
  defaultIntensity: number;
  enableIntensityTracking: boolean;
}

export const defaultPersonalizationSettings: PersonalizationSettings = {
  customPalettes: [],
  subcategories: [],
  moodCombinations: [],
  customVocabulary: [],
  defaultIntensity: 5,
  enableIntensityTracking: true,
};

// Predefined color options for palette customization
export const colorPaletteOptions = [
  { name: 'Sunset', primary: '#FF6B6B', glow: '#FFA07A' },
  { name: 'Ocean', primary: '#4ECDC4', glow: '#7FFFD4' },
  { name: 'Forest', primary: '#2D5A27', glow: '#90EE90' },
  { name: 'Berry', primary: '#9B59B6', glow: '#D2B4DE' },
  { name: 'Golden', primary: '#F39C12', glow: '#F7DC6F' },
  { name: 'Rose', primary: '#E91E63', glow: '#F8BBD9' },
  { name: 'Sky', primary: '#3498DB', glow: '#85C1E9' },
  { name: 'Lavender', primary: '#9B59B6', glow: '#D7BDE2' },
  { name: 'Coral', primary: '#FF7F50', glow: '#FFDAB9' },
  { name: 'Mint', primary: '#1ABC9C', glow: '#A3E4D7' },
  { name: 'Plum', primary: '#8E44AD', glow: '#BB8FCE' },
  { name: 'Amber', primary: '#F1C40F', glow: '#FEF9E7' },
];

// Predefined subcategory suggestions
export const subcategorySuggestions: Record<string, string[]> = {
  stressed: ['Work Stress', 'Financial Stress', 'Relationship Stress', 'Health Stress', 'Academic Stress'],
  anxious: ['Social Anxiety', 'Performance Anxiety', 'General Worry', 'Future Uncertainty', 'Health Anxiety'],
  happy: ['Joy', 'Contentment', 'Excitement', 'Pride', 'Love'],
  sad: ['Grief', 'Disappointment', 'Loneliness', 'Melancholy', 'Heartbreak'],
  angry: ['Frustration', 'Irritation', 'Resentment', 'Rage', 'Annoyance'],
  calm: ['Peaceful', 'Relaxed', 'Serene', 'Tranquil', 'Meditative'],
};

// Combination suggestions
export const combinationSuggestions = [
  { name: 'Grateful but Tired', moodIds: ['grateful', 'stressed'], emoji: '🙏😴' },
  { name: 'Excited but Nervous', moodIds: ['excited', 'anxious'], emoji: '🤩😰' },
  { name: 'Happy yet Nostalgic', moodIds: ['happy', 'nostalgic'], emoji: '😊📸' },
  { name: 'Calm but Alert', moodIds: ['calm', 'energized'], emoji: '😌⚡' },
  { name: 'Hopeful yet Anxious', moodIds: ['hopeful', 'anxious'], emoji: '🌟😰' },
  { name: 'Content but Restless', moodIds: ['content', 'energized'], emoji: '😌🔥' },
];
