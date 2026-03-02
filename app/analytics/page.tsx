'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Heart, Activity, Trash2 } from 'lucide-react';
import MoodPieChart from '@/components/MoodPieChart';
import MoodBarChart from '@/components/MoodBarChart';
import { MoodStats } from '@/components/MoodStats';

export default function AnalyticsPage() {
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  const calculateStats = useCallback((history: any[]) => {
    const moodCounts: { [key: string]: number } = {};
    const today = new Date().toDateString();
    const thisWeek: any[] = [];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    history.forEach((entry: any) => {
      // Support both new (emotion) and old (mood) formats
      const moodKey = entry.emotion || entry.mood;
      moodCounts[moodKey] = (moodCounts[moodKey] || 0) + 1;

      const entryDate = new Date(entry.timestamp);
      if (entryDate >= weekStart) {
        thisWeek.push(entry);
      }
    });

    const mostCommon = Object.entries(moodCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0];

    setStats({
      totalEntries: history.length,
      todayEntries: history.filter((entry: any) => new Date(entry.timestamp).toDateString() === today).length,
      weekEntries: thisWeek.length,
      mostCommonMood: mostCommon ? mostCommon[0] : null,
      moodCounts,
      weeklyData: thisWeek
    });
  }, []);

  const loadData = useCallback(() => {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(history);
    calculateStats(history);
  }, [calculateStats]);

  useEffect(() => {
    loadData();

    // Listen for updates from other tabs/components
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [loadData]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire mood history?')) {
      localStorage.setItem('moodHistory', '[]');
      setMoodHistory([]);
      calculateStats([]);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleDeleteEntry = (id: string, index: number) => {
    const newHistory = [...moodHistory];
    let updatedHistory;

    if (id) {
      updatedHistory = newHistory.filter(item => item.id !== id);
    } else {
      // Fallback: remove by index for legacy data
      // Note: passed index is from the visual reversed list
      // We'll rely on ID for best results
      return;
    }

    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    setMoodHistory(updatedHistory);
    calculateStats(updatedHistory);
    window.dispatchEvent(new Event('storage'));
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Prepare mood data for charts
  const moodData = useMemo(() => {
    return Object.entries(stats.moodCounts || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([mood, count]) => ({
        mood,
        count: count as number,
      }));
  }, [stats.moodCounts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 p-2 rounded-lg bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Back</span>
            </motion.button>
          </Link>

          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Analytics
            </h1>
          </div>

          <div className="w-20" /> {/* Spacer */}
        </div>
      </motion.header>

      {/* Main */}
      <main id="main" className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {moodHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No reflections yet</h2>
              <p className="text-gray-500 mb-8">Start your journey! Track your emotions to see insights here.</p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Track Your First Mood
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <MoodStats />
              </motion.div>

              {/* Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <MoodPieChart data={moodData} />
                <MoodBarChart data={moodData} />
              </motion.div>

              {/* History Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <h3 className="text-2xl font-bold text-gray-800">History</h3>
                  </div>

                  <button
                    onClick={handleClearHistory}
                    className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors font-medium border border-transparent hover:border-red-200"
                  >
                    Clear History
                  </button>
                </div>

                {/* history cards */}
                <div className="space-y-3">
                  {moodHistory.slice().reverse().slice(0, 15).map((entry, index) => (
                    <motion.div
                      key={entry.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur border border-white/40 shadow-sm hover:shadow-md transition-all hover:bg-white/80"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Status Dot */}
                        <div
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: entry.color || '#ddd', boxShadow: `0 0 8px ${entry.color || '#ddd'}` }}
                        />

                        <div>
                          <div className="font-semibold text-gray-800 capitalize flex items-center">
                            {entry.emotion || entry.mood}
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 italic mt-1 max-w-sm line-clamp-2">
                              "{entry.notes}"
                            </p>
                          )}
                          <div className="text-xs text-gray-500 font-medium">
                            {getTimeAgo(entry.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400 hidden sm:block">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id, index)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
