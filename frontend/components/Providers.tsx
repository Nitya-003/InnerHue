'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMoodStore } from '@/lib/useMoodStore';
import { fetchMoodsFromCloud, syncLocalToCloud } from '@/lib/firebaseSync';

function AuthSync() {
  const { user } = useAuth();
  const setMergedCloudMoods = useMoodStore(state => state.setMergedCloudMoods);
  const localMoodHistory = useMoodStore(state => state.moodHistory);

  useEffect(() => {
    if (user) {
      // User logged in, fetch from cloud and sync local to cloud
      const sync = async () => {
        const cloudMoods = await fetchMoodsFromCloud();
        if (cloudMoods.length > 0) {
          setMergedCloudMoods(cloudMoods);
        }
        
        // Push any local moods up to cloud that aren't there yet
        if (localMoodHistory.length > 0) {
          await syncLocalToCloud(localMoodHistory);
        }
      };
      sync();
    }
  }, [user]); // We intentionally do not include localMoodHistory to avoid infinite sync loops

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthSync />
      {children}
    </ThemeProvider>
  );
}
