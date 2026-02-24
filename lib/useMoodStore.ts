import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface MoodEntry {
  id: string;
  mood: string;
  emotion: string;
  timestamp: string;
  date: string;
  color?: string;
}

export interface MoodStats {
  totalEntries: number;
  todayEntries: number;
  weekEntries: number;
  mostCommonMood: string | null;
  moodCounts: Record<string, number>;
  weeklyData: MoodEntry[];
}

interface MoodStore {
  // State
  moodHistory: MoodEntry[];
  stats: MoodStats;
  
  // Actions
  addMood: (mood: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  deleteMood: (id: string) => void;
  clearHistory: () => void;
  
  // Selectors
  getMoodById: (id: string) => MoodEntry | undefined;
  getMoodsByDateRange: (startDate: Date, endDate: Date) => MoodEntry[];
  
  // Internal
  _computeStats: () => void;
}

// Pure function for computing stats
const computeStats = (history: MoodEntry[]): MoodStats => {
  const moodCounts: Record<string, number> = {};
  const today = new Date().toDateString();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  
  const weeklyData: MoodEntry[] = [];
  
  history.forEach(entry => {
    // Support both new (emotion) and old (mood) formats
    const moodKey = entry.emotion || entry.mood;
    moodCounts[moodKey] = (moodCounts[moodKey] || 0) + 1;
    
    const entryDate = new Date(entry.timestamp);
    if (entryDate >= weekStart) {
      weeklyData.push(entry);
    }
  });
  
  const todayEntries = history.filter(
    entry => new Date(entry.timestamp).toDateString() === today
  ).length;
  
  const mostCommon = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)[0];
  
  return {
    totalEntries: history.length,
    todayEntries,
    weekEntries: weeklyData.length,
    mostCommonMood: mostCommon ? mostCommon[0] : null,
    moodCounts,
    weeklyData,
  };
};

// Initial stats
const initialStats: MoodStats = {
  totalEntries: 0,
  todayEntries: 0,
  weekEntries: 0,
  mostCommonMood: null,
  moodCounts: {},
  weeklyData: [],
};

// Create the store
export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      moodHistory: [],
      stats: initialStats,
      
      addMood: (mood) => {
        const newEntry: MoodEntry = {
          ...mood,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        
        set(state => {
          const newHistory = [...state.moodHistory, newEntry];
          return {
            moodHistory: newHistory,
            stats: computeStats(newHistory),
          };
        });
      },
      
      deleteMood: (id) => {
        set(state => {
          const newHistory = state.moodHistory.filter(entry => entry.id !== id);
          return {
            moodHistory: newHistory,
            stats: computeStats(newHistory),
          };
        });
      },
      
      clearHistory: () => {
        set({
          moodHistory: [],
          stats: initialStats,
        });
      },
      
      getMoodById: (id) => {
        return get().moodHistory.find(entry => entry.id === id);
      },
      
      getMoodsByDateRange: (startDate, endDate) => {
        return get().moodHistory.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= startDate && entryDate <= endDate;
        });
      },
      
      _computeStats: () => {
        set(state => ({
          stats: computeStats(state.moodHistory),
        }));
      },
    }),
    {
      name: 'mood-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        moodHistory: state.moodHistory,
      }),
      onRehydrateStorage: () => (state) => {
        // Recompute stats after hydration from localStorage
        if (state) {
          state._computeStats();
        }
      },
    }
  )
);
