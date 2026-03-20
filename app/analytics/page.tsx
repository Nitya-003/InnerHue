'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Activity, Trash2, Download, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import MoodPieChart from '@/components/MoodPieChart';
import MoodBarChart from '@/components/MoodBarChart';
import { MoodStats } from '@/components/MoodStats';
import { useMoodStore } from '@/lib/useMoodStore';

interface MoodEntryView {
  id?: string;
  mood?: string;
  emotion?: string;
  timestamp: string;
  date?: string;
  color?: string;
  notes?: string;
}

const getExportDateString = () => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export default function AnalyticsPage() {
  const moodHistory = useMoodStore(state => state.moodHistory) as MoodEntryView[];
  const moodCounts = useMoodStore(state => state.stats.moodCounts);
  const clearHistory = useMoodStore(state => state.clearHistory);
  const deleteMood = useMoodStore(state => state.deleteMood);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const filteredHistory = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return moodHistory.filter((entry) => {
      const moodLabel = (entry.emotion || entry.mood || '').toLowerCase();
      const notes = (entry.notes || '').toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 ||
        moodLabel.includes(normalizedQuery) ||
        notes.includes(normalizedQuery);
      const matchesMood =
        selectedMoodFilter === 'all' ||
        moodLabel === selectedMoodFilter.toLowerCase();

      return matchesQuery && matchesMood;
    });
  }, [moodHistory, searchQuery, selectedMoodFilter]);

  const uniqueMoods = useMemo(() => {
    const values = new Set(
      moodHistory
        .map((entry) => (entry.emotion || entry.mood || '').trim())
        .filter(Boolean)
    );
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [moodHistory]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire mood history?')) {
      clearHistory();
    }
  };

  const handleDeleteEntry = (id?: string) => {
    if (id) {
      deleteMood(id);
    }
  };

  const exportAsJson = () => {
    setExportMenuOpen(false);
    const data = moodHistory;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `innerhue-history-${getExportDateString()}.json`);
  };

  const exportAsCsv = () => {
    setExportMenuOpen(false);
    const data = moodHistory;
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
    return Object.entries(moodCounts || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([mood, count]) => ({
        mood,
        count: count as number,
      }));
  }, [moodCounts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
              className="flex items-center space-x-2 p-2 rounded-lg bg-card/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
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

          <ThemeToggle />
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
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No reflections yet</h2>
              <p className="text-muted-foreground mb-8">Start your journey! Track your emotions to see insights here.</p>
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
                className="bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <h3 className="text-2xl font-bold text-foreground">History</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        onBlur={() => setTimeout(() => setExportMenuOpen(false), 150)}
                        className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full transition-colors font-medium border border-purple-200 hover:border-purple-300"
                      >
                        <Download className="w-4 h-4" />
                        Export Data
                        <ChevronDown className={`w-4 h-4 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {exportMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 py-1 w-44 bg-popover rounded-xl shadow-lg border border-border z-10">
                          <button
                            onClick={exportAsJson}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-t-lg"
                          >
                            Download as JSON
                          </button>
                          <button
                            onClick={exportAsCsv}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-b-lg"
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
                      className="w-full rounded-full border border-input bg-background/70 px-4 py-2 text-sm text-foreground shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
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
                            : 'bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/30'
                        }`}
                      >
                        All moods
                      </button>
                      {uniqueMoods.map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setSelectedMoodFilter(mood)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            selectedMoodFilter === mood
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/30'
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
                  <p className="py-6 text-center text-sm text-muted-foreground">
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
                        className="group flex items-center justify-between rounded-xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur hover:bg-card/80 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Status Dot */}
                          <div
                            className="h-3 w-3 rounded-full shadow-sm"
                            style={{ backgroundColor: entry.color || '#ddd', boxShadow: `0 0 8px ${entry.color || '#ddd'}` }}
                          />

                          <div>
                            <div className="flex items-center font-semibold capitalize text-foreground">
                              {entry.emotion || entry.mood}
                            </div>
                            {entry.notes && (
                              <p className="mt-1 max-w-sm text-sm italic text-muted-foreground line-clamp-2">
                                "{entry.notes}"
                              </p>
                            )}
                            <div className="text-xs font-medium text-muted-foreground">
                              {getTimeAgo(entry.timestamp)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="hidden text-sm text-muted-foreground sm:block">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="opacity-0 p-2 text-muted-foreground transition-all hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500 rounded-full group-hover:opacity-100"
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
