'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { OrbVisualizerProps } from '@/components/OrbVisualizer';
import type { FC } from 'react';
import { SuggestionPanel } from '@/components/SuggestionPanel';
import { MoodData, Mood, Suggestion } from '@/lib/moodData';
import { getQuoteByMood } from '@/lib/getQuote';
import { moodTags } from '@/lib/quoteTags';
import { Quote } from '@/data/fallbackQuotes';
import type { Mood, Suggestion, MoodHistoryEntry } from '@/types/mood';

interface MoodPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    moods?: string;
  };
}

export default function MoodPage({ params, searchParams }: MoodPageProps) {
  const [moodData, setMoodData] = useState<Mood[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
  const [entryIds, setEntryIds] = useState<Record<string, string>>({});
  const addMood = useMoodStore(state => state.addMood);

  useEffect(() => {
    const moodIds = moods ? moods.split(',') : [id];

    const moodsData = moodIds
      .map(mid => {
        const reflectiveMood = reflectiveMoods.find(m => m.id === mid);

        if (reflectiveMood) {
          const traditionalId = getTraditionalMoodId(mid);
          const traditionalMood = MoodData.getMoodById(traditionalId);

          // Create adapter object that combines both systems
          return {
            id: reflectiveMood.id,
            name: reflectiveMood.label,
            emoji: reflectiveMood.label?.charAt(0).toUpperCase() || '✨',
            color: reflectiveMood.color,
            glow: reflectiveMood.glow,
            traditionalId,
            spotifyPlaylistId: traditionalMood?.spotifyPlaylistId,
          } as MoodWithMeta;
        }

        // Fall back to traditional mood system
        return MoodData.getMoodById(mid);
      })
      .filter(Boolean) as MoodWithMeta[];

    setMoodData(moodsData);
    
    if (moodsData.length > 0) {
      // Get suggestions for the first mood initially
      const moodSuggestions = MoodData.getSuggestions(moodsData[0].id);
      setSuggestions(moodSuggestions);
    }
    
    // Save to local storage for analytics
    if (typeof window !== 'undefined') {
      const savedMoods: MoodHistoryEntry[] = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      moodIds.forEach(moodId => {
        const mood = MoodData.getMoodById(moodId);
        savedMoods.push({
          id: crypto.randomUUID(),
          mood: moodId,
          timestamp: new Date().toISOString(),
          date: new Date().toDateString(),
          color: mood?.color
        });
      });
      localStorage.setItem('moodHistory', JSON.stringify(savedMoods));
    }
  }, [params.id, searchParams?.moods]);

  if (!moodData.length || !suggestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const currentMood = moodData[currentMoodIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
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
              className="flex items-center space-x-2 p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">Back</span>
            </motion.button>
          </Link>

          <div className="flex items-center space-x-2">
            {moodData.length > 1 ? (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {moodData.map((mood, index) => (
                    <motion.button
                      key={mood.id}
                      onClick={() => setCurrentMoodIndex(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-2xl p-1 rounded-full transition-all ${index === currentMoodIndex
                        ? 'bg-white/30 ring-2 ring-purple-400'
                        : 'hover:bg-white/20'
                        }`}
                    >
                      {mood.emoji}
                    </motion.button>
                  ))}
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Feeling {currentMood.name}
                  {moodData.length > 1 && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({currentMoodIndex + 1} of {moodData.length})
                    </span>
                  )}
                </h1>
              </div>
            ) : (
              <>
                <span className="text-2xl">{currentMood.emoji}</span>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Feeling {currentMood.name}
                </h1>
              </>
            )}
          </div>

          <div className="flex space-x-2 items-center">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <Bookmark className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main id="main" className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <OrbVisualizer key={currentMood.id} mood={currentMood} />
          <SuggestionPanel
            suggestions={suggestions}
            mood={currentMood}
            entryId={entryIds[currentMood.id]}
            onRefresh={async () => {
              const suggestionId = currentMood.traditionalId || currentMood.id;
              setSuggestions(MoodData.getSuggestions(suggestionId));
            }}
          />
        </div>
      </main>

    </div>
  );
}