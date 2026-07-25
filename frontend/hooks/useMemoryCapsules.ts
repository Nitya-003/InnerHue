import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  MemoryCapsule,
  CreateCapsuleInput,
  CapsuleReflection,
  checkIsCapsuleUnlocked,
} from '@/lib/memoryCapsule';

const CAPSULES_STORAGE_KEY = 'innerhue_memory_capsules';

// Initial sample capsules for a warm user experience
const initialCapsules: MemoryCapsule[] = [
  {
    id: 'sample-unlocked-1',
    title: 'First Step into InnerHue',
    message: 'Welcome to your emotional journey! Looking back, remember how far you have come. Be patient and kind to yourself every day.',
    currentMood: 'hopeful',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    unlockDate: new Date(Date.now() - 60 * 1000).toISOString(),
    tags: ['welcome', 'growth', 'mindfulness'],
    isUnlocked: true,
    reflection: {
      currentMood: 'peaceful',
      text: 'I feel much more centered and grounded today than I did last week!',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'sample-locked-2',
    title: 'Letter for Next Month',
    message: 'Hey future me! By the time you open this, I hope you have completed your current goals and taken time to relax.',
    currentMood: 'calm',
    createdAt: new Date().toISOString(),
    unlockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['future-self', 'goals'],
    isUnlocked: false,
  },
];

export function useMemoryCapsules() {
  const [capsules, setCapsules] = useLocalStorage<MemoryCapsule[]>(
    CAPSULES_STORAGE_KEY,
    initialCapsules
  );

  // Compute updated unlocked status for all capsules
  const processedCapsules = useMemo(() => {
    return capsules.map((capsule) => {
      const unlockedNow = checkIsCapsuleUnlocked(capsule.unlockDate);
      if (capsule.isUnlocked !== unlockedNow) {
        return { ...capsule, isUnlocked: unlockedNow };
      }
      return capsule;
    });
  }, [capsules]);

  // Add a new capsule
  const addCapsule = useCallback(
    (input: CreateCapsuleInput): MemoryCapsule => {
      const newCapsule: MemoryCapsule = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `capsule-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: input.title.trim(),
        message: input.message.trim(),
        currentMood: input.currentMood,
        createdAt: new Date().toISOString(),
        unlockDate: input.unlockDate,
        tags: input.tags.map((t) => t.trim()).filter(Boolean),
        isUnlocked: checkIsCapsuleUnlocked(input.unlockDate),
      };

      setCapsules((prev) => [newCapsule, ...prev]);
      return newCapsule;
    },
    [setCapsules]
  );

  // Save reflection after unlock
  const updateCapsuleReflection = useCallback(
    (id: string, reflection: CapsuleReflection) => {
      setCapsules((prev) =>
        prev.map((capsule) => {
          if (capsule.id === id) {
            return {
              ...capsule,
              reflection,
            };
          }
          return capsule;
        })
      );
    },
    [setCapsules]
  );

  // Delete a capsule
  const deleteCapsule = useCallback(
    (id: string) => {
      setCapsules((prev) => prev.filter((capsule) => capsule.id !== id));
    },
    [setCapsules]
  );

  // Get capsule by ID
  const getCapsuleById = useCallback(
    (id: string) => {
      return processedCapsules.find((c) => c.id === id);
    },
    [processedCapsules]
  );

  // Compute statistics
  const stats = useMemo(() => {
    const total = processedCapsules.length;
    const unlocked = processedCapsules.filter((c) => c.isUnlocked).length;
    const locked = total - unlocked;

    return { total, locked, unlocked };
  }, [processedCapsules]);

  return {
    capsules: processedCapsules,
    addCapsule,
    updateCapsuleReflection,
    deleteCapsule,
    getCapsuleById,
    stats,
  };
}
