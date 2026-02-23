'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Heart,
  Activity,
  Trash2,
} from 'lucide-react';

import MoodPieChart from '@/components/MoodPieChart';
import MoodBarChart from '@/components/MoodBarChart';

import { BentoDashboard } from '@/components/BentoDashboard';
import { useMoodStore } from '@/lib/useMoodStore';
import { ThemeToggle } from '@/components/ThemeToggle';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AnalyticsPage() {
  const moodHistory = useMoodStore(state => state.moodHistory);
  const clearHistory = useMoodStore(state => state.clearHistory);
  const deleteMood = useMoodStore(state => state.deleteMood);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleClearHistoryClick = () => {
    setClearDialogOpen(true);
  };

  const handleConfirmClearHistory = () => {
    clearHistory();
    setClearDialogOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (id) deleteMood(id);
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
    const moodCounts: Record<string, number> = {};

    moodHistory.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [moodHistory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-screen bg-[#0f0720] transition-colors duration-500"
    >
      {/* Header */}
      <header className="p-4 md:p-6 sticky top-0 z-50 bg-[#0f0720]/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center space-x-2 px-4 py-2 
              rounded-xl bg-white/10 
              border border-white/10 shadow-sm 
              hover:shadow-md 
              transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
              <span className="hidden md:inline text-white font-medium">
                Back
              </span>
            </motion.button>
          </Link>

          <div className="flex items-center space-x-3">
            <Activity className="w-7 h-7 text-white" />
            <h1 className="text-xl md:text-3xl font-semibold text-white">
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
              <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">
                No reflections yet
              </h2>
              <p className="text-white/70 mb-8">
                Start your journey! Track your emotions to unlock insights.
              </p>
              <Link href="/#mood-selection">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="px-8 py-3 bg-white 
                  text-[#0f0720] font-medium rounded-full shadow-sm 
                  hover:shadow-md 
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
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <BentoDashboard />
              </motion.div>

              {/* Charts */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <MoodPieChart data={moodData} />
                <MoodBarChart data={moodData} />
              </motion.div>

              {/* History */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="bg-white/10 backdrop-blur-lg 
                rounded-3xl p-6 md:p-10 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] 
                border border-white/10"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-semibold text-white">
                      History
                    </h3>
                  </div>

                  <button
                    onClick={handleClearHistoryClick}
                    className="text-sm font-semibold 
                    px-4 py-1.5 rounded-full 
                    bg-red-500/20 
                    text-red-300 
                    hover:bg-red-500/30 
                    hover:shadow-sm 
                    transition-all duration-300"
                  >
                    Clear History
                  </button>
                </div>

                <div className="space-y-4">
                  {moodHistory.slice().reverse().slice(0, 15).map((entry, index) => (
                    <motion.div
                      key={entry.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 * index,
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      whileHover={{ y: -2 }}
                      className="group relative flex items-center justify-between 
                      p-5 rounded-2xl 
                      bg-white/5 
                      border border-white/10 shadow-sm 
                      hover:shadow-md
                      transition-all duration-300"
                    >

                      <div className="flex items-center space-x-4 relative z-10">

                        {/* Status Dot */}
                        <div
                          className="w-3 h-3 rounded-full 
                          ring-2 ring-[#0f0720] 
                          transition-all duration-300"
                          style={{
                            backgroundColor: entry.color || '#A3B18A',
                          }}
                        />

                        <div>
                          <div className="font-medium text-white capitalize">
                            {entry.emotion || entry.mood}
                          </div>
                          <div className="text-xs text-white/60 font-normal">
                            {getTimeAgo(entry.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="text-sm text-white/60 hidden sm:block">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 
                          p-2 rounded-full 
                          bg-red-500/20 
                          text-red-300 
                          hover:bg-red-500/30 
                          hover:shadow-sm
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

      {/* Clear History confirmation modal */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl border-white/20 dark:border-white/10 bg-white/95 dark:bg-[#1a1a35]/95 backdrop-blur-xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Clear mood history?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              Are you sure you want to clear your entire mood history? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:gap-3 mt-6">
            <AlertDialogCancel className="mt-0 rounded-xl border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClearHistory}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50"
            >
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}