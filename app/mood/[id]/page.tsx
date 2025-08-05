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
  
  useEffect(() => {
    const mood = MoodData.getMoodById(params.id);
    const moodSuggestions = MoodData.getSuggestions(params.id);
    
    setMoodData(mood);
    setSuggestions(moodSuggestions);
    
    // Save to local storage for analytics
    const savedMoods = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    savedMoods.push({
      mood: params.id,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    });
    localStorage.setItem('moodHistory', JSON.stringify(savedMoods));
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
