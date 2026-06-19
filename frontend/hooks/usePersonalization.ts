'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  PersonalizationSettings,
  defaultPersonalizationSettings,
  CustomColorPalette,
  MoodSubcategory,
  MoodCombination,
  CustomVocabulary,
  MoodIntensity,
} from '@/lib/personalizationTypes';

const STORAGE_KEY = 'innerhue-personalization';
const INTENSITY_HISTORY_KEY = 'innerhue-intensity-history';

export function usePersonalization() {
  const [settings, setSettings] = useLocalStorage<PersonalizationSettings>(
    STORAGE_KEY,
    defaultPersonalizationSettings
  );

  const [intensityHistory, setIntensityHistory] = useLocalStorage<MoodIntensity[]>(
    INTENSITY_HISTORY_KEY,
    []
  );

  // ============ Custom Color Palettes ============

  const setCustomPalette = useCallback(
    (palette: CustomColorPalette) => {
      setSettings((prev) => {
        const filtered = prev.customPalettes.filter((p) => p.moodId !== palette.moodId);
        return {
          ...prev,
          customPalettes: [...filtered, palette],
        };
      });
    },
    [setSettings]
  );

  const removeCustomPalette = useCallback(
    (moodId: string) => {
      setSettings((prev) => ({
        ...prev,
        customPalettes: prev.customPalettes.filter((p) => p.moodId !== moodId),
      }));
    },
    [setSettings]
  );

  const getCustomPalette = useCallback(
    (moodId: string): CustomColorPalette | undefined => {
      return settings.customPalettes.find((p) => p.moodId === moodId);
    },
    [settings.customPalettes]
  );

  // ============ Mood Subcategories ============

  const addSubcategory = useCallback(
    (subcategory: Omit<MoodSubcategory, 'id' | 'createdAt'>) => {
      const newSubcategory: MoodSubcategory = {
        ...subcategory,
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      setSettings((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory],
      }));
      return newSubcategory;
    },
    [setSettings]
  );

  const removeSubcategory = useCallback(
    (id: string) => {
      setSettings((prev) => ({
        ...prev,
        subcategories: prev.subcategories.filter((s) => s.id !== id),
      }));
    },
    [setSettings]
  );

  const getSubcategoriesForMood = useCallback(
    (parentMoodId: string): MoodSubcategory[] => {
      return settings.subcategories.filter((s) => s.parentMoodId === parentMoodId);
    },
    [settings.subcategories]
  );

  // ============ Mood Combinations ============

  const addMoodCombination = useCallback(
    (combination: Omit<MoodCombination, 'id' | 'createdAt'>) => {
      const newCombination: MoodCombination = {
        ...combination,
        id: `combo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      setSettings((prev) => ({
        ...prev,
        moodCombinations: [...prev.moodCombinations, newCombination],
      }));
      return newCombination;
    },
    [setSettings]
  );

  const removeMoodCombination = useCallback(
    (id: string) => {
      setSettings((prev) => ({
        ...prev,
        moodCombinations: prev.moodCombinations.filter((c) => c.id !== id),
      }));
    },
    [setSettings]
  );

  const updateMoodCombination = useCallback(
    (id: string, updates: Partial<MoodCombination>) => {
      setSettings((prev) => ({
        ...prev,
        moodCombinations: prev.moodCombinations.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    [setSettings]
  );

  // ============ Custom Vocabulary ============

  const addCustomWord = useCallback(
    (word: Omit<CustomVocabulary, 'id' | 'createdAt'>) => {
      const newWord: CustomVocabulary = {
        ...word,
        id: `vocab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      setSettings((prev) => ({
        ...prev,
        customVocabulary: [...prev.customVocabulary, newWord],
      }));
      return newWord;
    },
    [setSettings]
  );

  const removeCustomWord = useCallback(
    (id: string) => {
      setSettings((prev) => ({
        ...prev,
        customVocabulary: prev.customVocabulary.filter((w) => w.id !== id),
      }));
    },
    [setSettings]
  );

  const updateCustomWord = useCallback(
    (id: string, updates: Partial<CustomVocabulary>) => {
      setSettings((prev) => ({
        ...prev,
        customVocabulary: prev.customVocabulary.map((w) =>
          w.id === id ? { ...w, ...updates } : w
        ),
      }));
    },
    [setSettings]
  );

  // ============ Intensity Tracking ============

  const recordIntensity = useCallback(
    (moodId: string, intensity: number) => {
      const entry: MoodIntensity = {
        moodId,
        intensity: Math.min(10, Math.max(1, intensity)),
        timestamp: Date.now(),
      };
      setIntensityHistory((prev) => [...prev, entry]);
      return entry;
    },
    [setIntensityHistory]
  );

  const getIntensityHistory = useCallback(
    (moodId?: string, limit?: number): MoodIntensity[] => {
      let history = moodId
        ? intensityHistory.filter((h) => h.moodId === moodId)
        : intensityHistory;
      
      if (limit) {
        history = history.slice(-limit);
      }
      
      return history;
    },
    [intensityHistory]
  );

  const setDefaultIntensity = useCallback(
    (intensity: number) => {
      setSettings((prev) => ({
        ...prev,
        defaultIntensity: Math.min(10, Math.max(1, intensity)),
      }));
    },
    [setSettings]
  );

  const toggleIntensityTracking = useCallback(
    (enabled: boolean) => {
      setSettings((prev) => ({
        ...prev,
        enableIntensityTracking: enabled,
      }));
    },
    [setSettings]
  );

  // ============ Reset ============

  const resetAllPersonalization = useCallback(() => {
    setSettings(defaultPersonalizationSettings);
    setIntensityHistory([]);
  }, [setSettings, setIntensityHistory]);

  // ============ Statistics ============

  const stats = useMemo(() => ({
    totalCustomPalettes: settings.customPalettes.length,
    totalSubcategories: settings.subcategories.length,
    totalCombinations: settings.moodCombinations.length,
    totalCustomWords: settings.customVocabulary.length,
    totalIntensityRecords: intensityHistory.length,
  }), [settings, intensityHistory]);

  return {
    // Settings
    settings,
    
    // Color Palettes
    setCustomPalette,
    removeCustomPalette,
    getCustomPalette,
    
    // Subcategories
    addSubcategory,
    removeSubcategory,
    getSubcategoriesForMood,
    
    // Combinations
    addMoodCombination,
    removeMoodCombination,
    updateMoodCombination,
    
    // Vocabulary
    addCustomWord,
    removeCustomWord,
    updateCustomWord,
    
    // Intensity
    recordIntensity,
    getIntensityHistory,
    setDefaultIntensity,
    toggleIntensityTracking,
    intensityHistory,
    
    // Utils
    resetAllPersonalization,
    stats,
  };
}
