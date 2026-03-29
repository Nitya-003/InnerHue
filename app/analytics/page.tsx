'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Heart, Calendar, Download, ChevronDown, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import MoodPieChart from '@/components/MoodPieChart';
import MoodBarChart from '@/components/MoodBarChart';
import { MoodStats } from '@/components/MoodStats';
import { useMoodStore } from '@/lib/useMoodStore';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getExportDateString() {
  return new Date().toISOString().slice(0, 10);
}

export default function AnalyticsPage() {
  const moodHistory = useMoodStore(s => s.moodHistory);
  const stats = useMoodStore(s => s.stats);
  const deleteMood = useMoodStore(s => s.deleteMood);
  const clearHistory = useMoodStore(s => s.clearHistory);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const uniqueMoods = useMemo(() => {
    const set = new Set<string>();
    moodHistory.forEach(e => {
      const label = e.emotion || e.mood;
      if (label) set.add(label);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [moodHistory]);

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return moodHistory.filter(entry => {
      const moodLabel = (entry.emotion || entry.mood || '').toLowerCase();
      const notes = (entry.notes || '').toLowerCase();
      const matchesQuery = !q || moodLabel.includes(q) || notes.includes(q);
      const displayMood = entry.emotion || entry.mood || '';
      const matchesMood =
        selectedMoodFilter === 'all' || displayMood === selectedMoodFilter;
      return matchesQuery && matchesMood;
    });
  }, [moodHistory, searchQuery, selectedMoodFilter]);

  const moodData = useMemo(() => {
    return Object.entries(stats.moodCounts || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([mood, count]) => ({
        mood,
        count: count as number,
      }));
  }, [stats.moodCounts]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire mood history?')) {
      clearHistory();
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (id) deleteMood(id);
  };

  const exportAsJson = useCallback(() => {
    setExportMenuOpen(false);
    const json = JSON.stringify(moodHistory, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `innerhue-history-${getExportDateString()}.json`);
  }, [moodHistory]);

  const exportAsCsv = useCallback(() => {
    setExportMenuOpen(false);
    const escapeCsv = (val: unknown): string => {
      if (val == null) return '';
      const s = String(val);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const headers = ['id', 'mood', 'timestamp', 'date', 'color', 'notes'] as const;
    const rows = moodHistory.map((entry) =>
      [
        entry.id,
        entry.emotion ?? entry.mood,
        entry.timestamp,
        entry.date,
        entry.color,
        entry.notes,
      ].map(escapeCsv).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `innerhue-history-${getExportDateString()}.csv`);
  }, [moodHistory]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/80 text-foreground">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-transparent dark:border-white/5"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 p-2 rounded-lg bg-card/70 backdrop-blur shadow-sm hover:shadow-md transition-all border border-border"
            >
              <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              <span className="text-purple-600 dark:text-purple-300 font-medium">Back</span>
            </motion.button>
          </Link>

          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Mood Analytics
            </h1>
          </div>

          <div className="flex items-center justify-end min-w-[5rem]">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <MoodStats />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <MoodPieChart data={moodData} />
                <MoodBarChart data={moodData} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border"
              >
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-2xl font-bold text-foreground">History</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setExportMenuOpen(prev => !prev)}
                        onBlur={() => setTimeout(() => setExportMenuOpen(false), 150)}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <Download className="w-4 h-4" />
                        Export Data
                        <ChevronDown className={`w-4 h-4 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {exportMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 py-1 w-44 bg-popover rounded-xl shadow-lg border border-border z-10">
                          <button
                            type="button"
                            onClick={exportAsJson}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-t-lg"
                          >
                            Download as JSON
                          </button>
                          <button
                            type="button"
                            onClick={exportAsCsv}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-b-lg"
                          >
                            Download as CSV
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="rounded-full border border-transparent px-3 py-1 text-sm font-medium text-destructive transition-colors hover:border-destructive/30 hover:bg-destructive/10"
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
                      className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                            selectedMoodFilter === mood
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-background text-foreground border-border hover:bg-muted hover:border-purple-200 dark:hover:border-purple-500/40'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
                                {`"${entry.notes}"`}
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
                            type="button"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="rounded-full p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
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
