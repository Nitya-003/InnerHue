import { useEffect, useState } from 'react';

export interface CustomMood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  category: string;
  isCustom: true;
  createdAt: string;
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  category?: string;
  isCustom?: boolean;
}

const CUSTOM_MOODS_STORAGE_KEY = 'customMoods';

/**
 * Utility functions for managing custom moods in localStorage
 */
export const CustomMoodStorage = {
  /**
   * Get all custom moods from localStorage
   */
  getCustomMoods(): CustomMood[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(CUSTOM_MOODS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading custom moods from localStorage:', error);
      return [];
    }
  },

  /**
   * Save a new custom mood to localStorage
   */
  saveCustomMood(mood: Omit<CustomMood, 'id' | 'isCustom' | 'createdAt'>): CustomMood {
    const customMoods = this.getCustomMoods();
    
    const newMood: CustomMood = {
      ...mood,
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    customMoods.push(newMood);
    
    try {
      localStorage.setItem(CUSTOM_MOODS_STORAGE_KEY, JSON.stringify(customMoods));
      // Dispatch a custom event to notify components of the change
      window.dispatchEvent(new CustomEvent('customMoodsUpdated', { detail: customMoods }));
    } catch (error) {
      console.error('Error saving custom mood to localStorage:', error);
      throw new Error('Failed to save custom mood');
    }

    return newMood;
  },

  /**
   * Delete a custom mood by ID
   */
  deleteCustomMood(moodId: string): boolean {
    const customMoods = this.getCustomMoods();
    const filteredMoods = customMoods.filter(mood => mood.id !== moodId);
    
    if (filteredMoods.length === customMoods.length) {
      return false; // Mood not found
    }

    try {
      localStorage.setItem(CUSTOM_MOODS_STORAGE_KEY, JSON.stringify(filteredMoods));
      window.dispatchEvent(new CustomEvent('customMoodsUpdated', { detail: filteredMoods }));
      return true;
    } catch (error) {
      console.error('Error deleting custom mood from localStorage:', error);
      return false;
    }
  },

  /**
   * Check if a mood name already exists (case-insensitive)
   */
  moodNameExists(name: string): boolean {
    const customMoods = this.getCustomMoods();
    return customMoods.some(mood => 
      mood.name.toLowerCase() === name.toLowerCase()
    );
  },

  /**
   * Generate a glow color from a base color
   */
  generateGlowColor(baseColor: string): string {
    // Simple glow generation - make color slightly lighter
    // This is a basic implementation; could be enhanced with proper color manipulation
    if (baseColor.startsWith('#')) {
      // Convert hex to RGB, increase brightness, convert back
      const hex = baseColor.slice(1);
      const num = parseInt(hex, 16);
      const r = Math.min(255, (num >> 16) + 30);
      const g = Math.min(255, ((num >> 8) & 0x00FF) + 30);
      const b = Math.min(255, (num & 0x0000FF) + 30);
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    return baseColor; // fallback
  },

  /**
   * Clear all custom moods
   */
  clearAllCustomMoods(): void {
    try {
      localStorage.removeItem(CUSTOM_MOODS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('customMoodsUpdated', { detail: [] }));
    } catch (error) {
      console.error('Error clearing custom moods from localStorage:', error);
    }
  }
};

/**
 * Get combined list of default and custom moods
 */
export function getCombinedMoods(defaultMoods: Mood[]): Mood[] {
  const customMoods = CustomMoodStorage.getCustomMoods();
  return [...defaultMoods, ...customMoods];
}

/**
 * Hook for listening to custom mood changes
 */
export function useCustomMoods(defaultMoods: Mood[] = []) {
  if (typeof window === 'undefined') {
    return {
      allMoods: defaultMoods,
      customMoods: [],
      addCustomMood: () => Promise.reject(new Error('Not available on server')),
      deleteCustomMood: () => false,
      refreshMoods: () => {}
    };
  }

  const [customMoods, setCustomMoods] = useState<CustomMood[]>([]);

  useEffect(() => {
    // Load initial custom moods
    const loadCustomMoods = () => {
      const moods = CustomMoodStorage.getCustomMoods();
      setCustomMoods(moods);
    };

    loadCustomMoods();

    // Listen for custom mood updates
    const handleCustomMoodsUpdate = (event: CustomEvent) => {
      setCustomMoods(event.detail);
    };

    window.addEventListener('customMoodsUpdated', handleCustomMoodsUpdate as EventListener);

    return () => {
      window.removeEventListener('customMoodsUpdated', handleCustomMoodsUpdate as EventListener);
    };
  }, []);

  const addCustomMood = async (moodData: Omit<CustomMood, 'id' | 'isCustom' | 'createdAt'>): Promise<CustomMood> => {
    return CustomMoodStorage.saveCustomMood(moodData);
  };

  const deleteCustomMood = (moodId: string): boolean => {
    return CustomMoodStorage.deleteCustomMood(moodId);
  };

  const refreshMoods = () => {
    const moods = CustomMoodStorage.getCustomMoods();
    setCustomMoods(moods);
  };

  return {
    allMoods: getCombinedMoods(defaultMoods),
    customMoods,
    addCustomMood,
    deleteCustomMood,
    refreshMoods
  };
}