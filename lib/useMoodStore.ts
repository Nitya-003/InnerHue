import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { saveMoodToCloud, deleteMoodFromCloud } from './firebaseSync';

// Types
export interface MoodEntry {
  id: string;
  mood: string;
  emotion: string;
  timestamp: string;
  date: string;
  color?: string;
  notes?: string;
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
  addMood: (mood: Omit<MoodEntry, 'id' | 'timestamp'>) => string;
  updateMoodNotes: (id: string, notes: string) => void;
  deleteMood: (id: string) => void;
  clearHistory: () => void;
  setMergedCloudMoods: (moods: MoodEntry[]) => void;

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
        const id = crypto.randomUUID();
        const newEntry: MoodEntry = {
          ...mood,
          id,
          timestamp: new Date().toISOString(),
        };

        saveMoodToCloud(newEntry); // Async fire-and-forget

        set(state => {
          const newHistory = [...state.moodHistory, newEntry];
          return {
            moodHistory: newHistory,
            stats: computeStats(newHistory),
          };
        });

        return id;
      },

      updateMoodNotes: (id, notes) => {
        let updatedEntry: MoodEntry | null = null;
        set(state => {
          const newHistory = state.moodHistory.map(entry => {
            if (entry.id === id) {
              updatedEntry = { ...entry, notes };
              return updatedEntry;
            }
            return entry;
          });
          return {
            moodHistory: newHistory,
            stats: computeStats(newHistory),
          };
        });
        
        if (updatedEntry) {
          saveMoodToCloud(updatedEntry);
        }
      },

      deleteMood: (id) => {
        deleteMoodFromCloud(id); // Async fire-and-forget
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

      setMergedCloudMoods: (cloudMoods) => {
        set(state => {
          const existingIds = new Set(state.moodHistory.map(e => e.id));
          const toAdd = cloudMoods.filter(m => !existingIds.has(m.id));
          if (toAdd.length === 0) return state; // No new cloud moods

          const newHistory = [...state.moodHistory, ...toAdd];
          // Sort by timestamp descending
          newHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          return {
            moodHistory: newHistory,
            stats: computeStats(newHistory),
          };
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
        if (state) {
          state._computeStats();
        }
        if (typeof window === 'undefined') return;
        queueMicrotask(() => {
          try {
            const raw = localStorage.getItem('moodHistory');
            if (!raw) return;
            const legacy = JSON.parse(raw) as Array<{
              id?: string;
              mood: string;
              timestamp: string;
              date: string;
              color?: string;
              emotion?: string;
            }>;
            if (!Array.isArray(legacy)) {
              localStorage.removeItem('moodHistory');
              return;
            }
            const existingIds = new Set(
              useMoodStore.getState().moodHistory.map(e => e.id)
            );
            const toAdd: MoodEntry[] = [];
            for (const e of legacy) {
              const entryId = e.id || crypto.randomUUID();
              if (existingIds.has(entryId)) continue;
              existingIds.add(entryId);
              toAdd.push({
                id: entryId,
                mood: e.mood,
                emotion: e.emotion ?? e.mood,
                timestamp: e.timestamp,
                date: e.date,
                color: e.color,
              });
            }
            if (toAdd.length > 0) {
              useMoodStore.setState(s => {
                const moodHistory = [...s.moodHistory, ...toAdd];
                return {
                  moodHistory,
                  stats: computeStats(moodHistory),
                };
              });
            }
            localStorage.removeItem('moodHistory');
          } catch {
            localStorage.removeItem('moodHistory');
          }
        });
      },
    }
  )
);
