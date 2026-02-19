'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Activity, Trash2, Download, FileJson, FileText } from 'lucide-react';
import { MoodChart } from '@/components/MoodChart';
import { BentoDashboard } from '@/components/BentoDashboard';
import { useMoodStore } from '@/lib/useMoodStore';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AnalyticsPage() {
  const moodHistory = useMoodStore(state => state.moodHistory);
  const clearHistory = useMoodStore(state => state.clearHistory);
  const deleteMood = useMoodStore(state => state.deleteMood);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire mood history?')) {
      clearHistory();
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (id) deleteMood(id);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (moodHistory.length === 0) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `innerhue_mood_history_${timestamp}.${format}`;
    let content = '';
    let type = '';

    if (format === 'json') {
      content = JSON.stringify(moodHistory, null, 2);
      type = 'application/json';
    } else {
      // CSV Header
      const headers = ['Date', 'Time', 'Mood', 'Emotion', 'Color', 'ID'];
      const rows = moodHistory.map(entry => [
        new Date(entry.timestamp).toLocaleDateString(),
        new Date(entry.timestamp).toLocaleTimeString(),
        entry.mood,
        entry.emotion || '',
        entry.color || '',
        entry.id
      ].map(field => `"${field}"`).join(','));

      content = [headers.join(','), ...rows].join('\n');
      type = 'text/csv';
    }

    // Trigger Download
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br 
      from-violet-100 via-white to-fuchsia-100 
      dark:from-[#0f0f1a] dark:via-[#141427] dark:to-[#1a1a35] 
      transition-colors duration-500"
    >
      {/* Header */}
      <header className="p-4 md:p-6 sticky top-0 z-50 backdrop-blur-xl bg-white/40 dark:bg-black/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 
              rounded-xl bg-white/60 dark:bg-white/10 
              backdrop-blur-lg border border-white/40 
              dark:border-white/10 shadow-md 
              hover:shadow-purple-500/20 
              transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="hidden md:inline text-purple-600 dark:text-purple-400 font-medium">
                Back
              </span>
            </motion.button>
          </Link>

          <div className="flex items-center space-x-3">
            <Activity className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Analytics
            </h1>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">

          {moodHistory.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                No reflections yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Start your journey! Track your emotions to unlock insights.
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                  text-white font-semibold rounded-full shadow-lg 
                  hover:shadow-xl hover:shadow-purple-500/30 
                  transition-all duration-300"
                >
                  Track Your First Mood
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-10">

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring' as const, stiffness: 100 }}
              >
                <BentoDashboard />
              </motion.div>

              {/* History */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-white/5 backdrop-blur-xl 
                rounded-3xl p-6 md:p-10 shadow-2xl 
                border border-white/40 dark:border-white/10"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      History
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-full p-1 border border-gray-200 dark:border-white/10">
                      <button
                        onClick={() => handleExport('csv')}
                        className="p-2 rounded-full hover:bg-white dark:hover:bg-white/10 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-all"
                        title="Export as CSV"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 dark:bg-white/10" />
                      <button
                        onClick={() => handleExport('json')}
                        className="p-2 rounded-full hover:bg-white dark:hover:bg-white/10 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-all"
                        title="Export as JSON"
                      >
                        <FileJson className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleClearHistory}
                      className="text-sm font-semibold 
                      px-4 py-1.5 rounded-full 
                      bg-red-50 dark:bg-red-900/20 
                      text-red-500 
                      hover:bg-red-500 hover:text-white 
                      hover:shadow-lg hover:shadow-red-500/30 
                      transition-all duration-300"
                    >
                      Clear History
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {moodHistory.slice().reverse().slice(0, 15).map((entry, index) => (
                    <motion.div
                      key={entry.id || index}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.05 * index,
                        type: "spring",
                        stiffness: 120,
                        damping: 15
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="group relative flex items-center justify-between 
                      p-5 rounded-2xl 
                      bg-gradient-to-r from-white/70 to-white/40 
                      dark:from-white/10 dark:to-white/5 
                      backdrop-blur-xl border border-white/40 
                      dark:border-white/10 shadow-md 
                      hover:shadow-2xl hover:shadow-purple-500/20
                      transition-all duration-300"
                    >

                      {/* Gradient Hover Overlay */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 
                      group-hover:opacity-100 
                      bg-gradient-to-r from-purple-500/5 to-pink-500/5 
                      transition-opacity duration-300 pointer-events-none" />

                      <div className="flex items-center space-x-4 relative z-10">

                        {/* Status Dot */}
                        <div
                          className="w-3 h-3 rounded-full 
                          ring-4 ring-white dark:ring-black 
                          transition-all duration-300 
                          group-hover:scale-125"
                          style={{
                            backgroundColor: entry.color || '#ddd',
                            boxShadow: `0 0 12px ${entry.color || '#ddd'}`
                          }}
                        />

                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                            {entry.emotion || entry.mood}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {getTimeAgo(entry.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="text-sm text-gray-400 hidden sm:block">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 
                          p-2 rounded-full 
                          bg-red-50 dark:bg-red-900/20 
                          text-red-400 hover:text-white 
                          hover:bg-red-500 
                          hover:shadow-lg hover:shadow-red-500/40
                          transition-all duration-300"
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
    </motion.div>
  );
}
