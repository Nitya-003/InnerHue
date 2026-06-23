import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export interface ServerMoodStats {
  totalEntries: number;
  todayEntries: number;
  weekEntries: number;
  mostCommonMood: string | null;
  moodCounts: Record<string, number>;
}

export function useServerAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<ServerMoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      if (!user) {
        if (!authLoading && isMounted) {
          setLoading(false);
          setStats(null);
        }
        return;
      }

      try {
        setLoading(true);

        // Guard: auth is null when Firebase is not configured
        if (!isFirebaseConfigured || !auth) {
          throw new Error('Firebase is not configured in this environment');
        }

        const token = await auth.currentUser?.getIdToken(true);

        if (!token) {
          throw new Error('Failed to get auth token');
        }

        const res = await fetch('/api/analytics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data: ServerMoodStats = await res.json();
        if (isMounted) {
          setStats(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('Error fetching server analytics:', message);
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  return { stats, loading, error };
}