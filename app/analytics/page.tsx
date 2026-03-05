'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Activity, Trash2, Download, ChevronDown } from 'lucide-react';
import MoodPieChart from '@/components/MoodPieChart';
import MoodBarChart from '@/components/MoodBarChart';
import { MoodStats } from '@/components/MoodStats';
import type { MoodHistoryEntry, MoodStats as MoodStatsType } from '@/types/mood';

export default function AnalyticsPage() {
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
  const [stats, setStats] = useState<MoodStatsType>({
    totalEntries: 0,
    todayEntries: 0,
    weekEntries: 0,
    mostCommonMood: null,
    moodCounts: {},
    weeklyData: []
  });

  const calculateStats = useCallback((history: MoodHistoryEntry[]) => {
    const moodCounts: { [key: string]: number } = {};
    const today = new Date().toDateString();
    const thisWeek: MoodHistoryEntry[] = [];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    history.forEach((entry) => {
      // Support both new (emotion) and old (mood) formats
      const moodKey = entry.emotion || entry.mood;
      moodCounts[moodKey] = (moodCounts[moodKey] || 0) + 1;

      const entryDate = new Date(entry.timestamp);
      if (entryDate >= weekStart) {
        thisWeek.push(entry);
      }
    });

    const mostCommon = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0];

    setStats({
      totalEntries: history.length,
      todayEntries: history.filter((entry) => new Date(entry.timestamp).toDateString() === today).length,
      weekEntries: thisWeek.length,
      mostCommonMood: mostCommon ? mostCommon[0] : null,
      moodCounts,
      weeklyData: thisWeek
    });
  }, []);

    return moodHistory.filter((entry: any) => {
      const moodLabel = (entry.emotion || entry.mood || '').toLowerCase();
      const notes = (entry.notes || '').toLowerCase();

  useEffect(() => {
    loadData();

      const matchesMood =
        selectedMoodFilter === 'all' ||
        moodLabel === (selectedMoodFilter || '').toLowerCase();

      return matchesQuery && matchesMood;
    });
  }, [moodHistory, searchQuery, selectedMoodFilter]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire mood history?')) {
      clearHistory();
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (id) {
      deleteMood(id);
    }
  };

  const exportAsJson = () => {
    setExportMenuOpen(false);
    const data = useMoodStore.getState().moodHistory;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `innerhue-history-${getExportDateString()}.json`);
  };

  const exportAsCsv = () => {
    setExportMenuOpen(false);
    const data = useMoodStore.getState().moodHistory;
    const escapeCsv = (val: unknown): string => {
      if (val == null) return '';
      const s = String(val);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const headers = ['id', 'mood', 'timestamp', 'date', 'color', 'notes'];
    const rows = data.map((entry: any) =>
      headers.map(h => escapeCsv(h === 'mood' ? (entry.emotion ?? entry.mood) : entry[h])).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `innerhue-history-${getExportDateString()}.csv`);
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

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setExportMenuOpen(prev => !prev)}
                        onBlur={() => setTimeout(() => setExportMenuOpen(false), 150)}
                        className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full transition-colors font-medium border border-purple-200 hover:border-purple-300"
                      >
                        <Download className="w-4 h-4" />
                        Export Data
                        <ChevronDown className={`w-4 h-4 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {exportMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 py-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={exportAsJson}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-t-lg"
                          >
                            Download as JSON
                          </button>
                          <button
                            onClick={exportAsCsv}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-b-lg"
                          >
                            Download as CSV
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors font-medium border border-transparent hover:border-red-200"
                    >
                      Clear History
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-xs">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search by mood or notes..."
                      className="w-full rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>

                  {uniqueMoods.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMoodFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          selectedMoodFilter === 'all'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                        }`}
                      >
                        All moods
                      </button>
                      {uniqueMoods.map(mood => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setSelectedMoodFilter(mood)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            selectedMoodFilter === mood
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* history cards */}
                {filteredHistory.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">
                    No reflections match your current search or filters.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredHistory.slice().reverse().slice(0, 15).map((entry, index) => (
                      <motion.div
                        key={entry.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="group flex items-center justify-between rounded-xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur hover:bg-white/80 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Status Dot */}
                          <div
                            className="h-3 w-3 rounded-full shadow-sm"
                            style={{ backgroundColor: entry.color || '#ddd', boxShadow: `0 0 8px ${entry.color || '#ddd'}` }}
                          />

                          <div>
                            <div className="flex items-center font-semibold capitalize text-gray-800">
                              {entry.emotion || entry.mood}
                            </div>
                            {entry.notes && (
                              <p className="mt-1 max-w-sm text-sm italic text-gray-600 line-clamp-2">
                                "{entry.notes}"
                              </p>
                            )}
                            <div className="text-xs font-medium text-gray-500">
                              {getTimeAgo(entry.timestamp)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="hidden text-sm text-gray-400 sm:block">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="opacity-0 p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 rounded-full group-hover:opacity-100"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
