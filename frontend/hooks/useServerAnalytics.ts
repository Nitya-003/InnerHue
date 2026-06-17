import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { auth } from '@/lib/firebase';

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
        // Get the Firebase auth token to securely pass to our server
        const token = await auth.currentUser?.getIdToken(true);
        
        if (!token) {
          throw new Error('Failed to get auth token');
        }

        const res = await fetch('/api/analytics', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data: ServerMoodStats = await res.json();
        if (isMounted) {
          setStats(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error fetching server analytics:', err);
          setError(err.message);
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
