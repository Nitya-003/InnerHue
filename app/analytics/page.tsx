'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Heart, Activity } from 'lucide-react';
import { MoodChart } from '@/components/MoodChart';
import { MoodStats } from '@/components/MoodStats';

export default function AnalyticsPage() {
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(history);

    // Calculate stats
    const moodCounts: { [key: string]: number } = {};
    const today = new Date().toDateString();
    const thisWeek: any[] = [];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    history.forEach((entry: any) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      
      const entryDate = new Date(entry.timestamp);
      if (entryDate >= weekStart) {
        thisWeek.push(entry);
      }
    });

    const mostCommon = Object.entries(moodCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    setStats({
      totalEntries: history.length,
      todayEntries: history.filter((entry: any) => entry.date === today).length,
      weekEntries: thisWeek.length,
      mostCommonMood: mostCommon ? mostCommon[0] : null,
      moodCounts,
      weeklyData: thisWeek
    });
  }, []);

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

      {/* Main Content */}
      <main className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {moodHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No mood data yet</h2>
              <p className="text-gray-500 mb-8">Start tracking your emotions to see beautiful insights here.</p>
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
                <MoodStats stats={stats} />
              </motion.div>

              {/* Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MoodChart moodHistory={moodHistory} stats={stats} />
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Recent Activity</h3>
                </div>
                
                <div className="space-y-3">
                  {moodHistory.slice(-10).reverse().map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {entry.mood === 'happy' && '😊'}
                          {entry.mood === 'sad' && '😢'}
                          {entry.mood === 'anxious' && '😰'}
                          {entry.mood === 'excited' && '🤩'}
                          {entry.mood === 'calm' && '😌'}
                          {entry.mood === 'angry' && '😡'}
                          {entry.mood === 'confused' && '😕'}
                          {entry.mood === 'grateful' && '🙏'}
                          {entry.mood === 'lonely' && '😔'}
                          {entry.mood === 'hopeful' && '🌟'}
                          {!['happy', 'sad', 'anxious', 'excited', 'calm', 'angry', 'confused', 'grateful', 'lonely', 'hopeful'].includes(entry.mood) && '💭'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 capitalize">{entry.mood}</div>
                          <div className="text-sm text-gray-500">{entry.date}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
