'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Bookmark, Share2 } from 'lucide-react';
import { OrbVisualizer } from '@/components/OrbVisualizer';
import { SuggestionPanel } from '@/components/SuggestionPanel';
import { MoodData } from '@/lib/moodData';

interface MoodPageProps {
  params: {
    id: string;
  };
}

export default function MoodPage({ params }: MoodPageProps) {
  const [moodData, setMoodData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any>(null);

  // Use a ref to prevent strict mode double-execution
  const dataSavedRef = useState(false); // Using useState initializer logic is cleaner but for strict mode ref is better
  // Actually, for strict mode, a ref initialized to false, set to true.

  useEffect(() => {
    const mood = MoodData.getMoodById(params.id);
    const moodSuggestions = MoodData.getSuggestions(params.id);

    setMoodData(mood);
    setSuggestions(moodSuggestions);

    // Save to local storage for analytics
    // In a real app we might want to allow multiple visits, but for "Moment to moment" maybe just once per mount?
    // Let's rely on a session constraint or just a simple check.

    const saveMoodEntry = () => {
      try {
        let history = JSON.parse(localStorage.getItem('moodHistory') || '[]');

        // Prevent duplicate save if the last entry was made recently (5s debounce)
        const lastEntry = history[history.length - 1];
        const now = Date.now();

        if (lastEntry &&
          lastEntry.mood === params.id &&
          (now - new Date(lastEntry.timestamp).getTime() < 5000)) {
          return;
        }

        const newEntry = {
          id: crypto.randomUUID(),
          mood: params.id,
          emotion: mood ? mood.name : params.id,
          timestamp: new Date().toISOString(),
          color: mood ? mood.color : '#cbd5e1',
          note: ''
        };

        history.push(newEntry);

        // Keep only the last 13 entries
        if (history.length > 13) {
          history = history.slice(history.length - 13);
        }

        localStorage.setItem('moodHistory', JSON.stringify(history));

        // Notify other components
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error('Failed to save mood:', err);
      }
    };

    if (mood) {
      saveMoodEntry();
    }
  }, [params.id]);

  if (!moodData || !suggestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 relative z-10"
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
            <span className="text-2xl">{moodData.emoji}</span>
            <h1 className="text-2xl font-bold text-gray-800">
              Feeling {moodData.name}
            </h1>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <Bookmark className="w-5 h-5 text-purple-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <Share2 className="w-5 h-5 text-purple-600" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Orb Visualizer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <OrbVisualizer mood={moodData} />
            </motion.div>

            {/* Right Side - Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SuggestionPanel
                suggestions={suggestions}
                mood={moodData}
                onRefresh={() => {
                  const newSuggestions = MoodData.getSuggestions(params.id);
                  setSuggestions(newSuggestions);
                }}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
