/**
 * Emotional Memory Capsule data structures and helper utilities.
 */

export interface CapsuleReflection {
  currentMood: string;
  text: string;
  createdAt: string;
}

export interface MemoryCapsule {
  id: string;
  title: string;
  message: string;
  currentMood: string;
  createdAt: string;
  unlockDate: string;
  tags: string[];
  isUnlocked: boolean;
  reflection?: CapsuleReflection;
}

export interface CreateCapsuleInput {
  title: string;
  message: string;
  currentMood: string;
  unlockDate: string;
  tags: string[];
}

/**
 * Checks if a capsule is past its unlock date.
 */
export function checkIsCapsuleUnlocked(unlockDateIso: string): boolean {
  if (!unlockDateIso) return false;
  const unlockTime = new Date(unlockDateIso).getTime();
  if (isNaN(unlockTime)) return false;
  return Date.now() >= unlockTime;
}

/**
 * Filters and sorts memory capsules based on search query, status, and mood.
 * Newest capsules are returned first.
 */
export function filterCapsules(
  capsules: MemoryCapsule[],
  query: string = '',
  statusFilter: 'all' | 'locked' | 'unlocked' = 'all',
  moodFilter: string = 'all'
): MemoryCapsule[] {
  const normalizedQuery = query.trim().toLowerCase();

  return capsules
    .filter((capsule) => {
      const isUnlocked = capsule.isUnlocked || checkIsCapsuleUnlocked(capsule.unlockDate);

      // Status filter
      if (statusFilter === 'locked' && isUnlocked) return false;
      if (statusFilter === 'unlocked' && !isUnlocked) return false;

      // Mood filter
      if (moodFilter !== 'all' && capsule.currentMood.toLowerCase() !== moodFilter.toLowerCase()) {
        return false;
      }

      // Search query filter (matches title, message, or tags)
      if (normalizedQuery) {
        const titleMatch = capsule.title.toLowerCase().includes(normalizedQuery);
        const messageMatch = isUnlocked ? capsule.message.toLowerCase().includes(normalizedQuery) : false;
        const tagMatch = capsule.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
        const moodMatch = capsule.currentMood.toLowerCase().includes(normalizedQuery);

        if (!titleMatch && !messageMatch && !tagMatch && !moodMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
