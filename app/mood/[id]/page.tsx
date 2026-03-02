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
import { ThemeToggle } from '@/components/ThemeToggle';
import { MoodData } from '@/lib/moodData';
import { Mood, MoodSuggestion } from '@/types/mood';
import { useMoodStore } from '@/lib/useMoodStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import reflectiveMoods from '@/lib/reflectiveMoods';
import { getTraditionalMoodId } from '@/lib/moodMapping';

const OrbVisualizer = dynamic(
  () => import('@/components/OrbVisualizer').then((m) => ({ default: m.OrbVisualizer })),
  { ssr: false }
) as unknown as FC<OrbVisualizerProps>;

interface MoodWithMeta extends Mood {
  traditionalId?: string;
  spotifyPlaylistId?: string;
}

export default function MoodClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const moods = searchParams.get('moods') || undefined;
  const [moodData, setMoodData] = useState<MoodWithMeta[]>([]);
  const [suggestions, setSuggestions] = useState<MoodSuggestion | null>(null);
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

    const newEntryIds: Record<string, string> = {};
    moodIds.forEach(mid => {
      const moodInfo = moodsData.find(m => m.id === mid);
      if (moodInfo) {
        const eid = addMood({
          mood: mid,
          emotion: moodInfo.name,
          date: new Date().toDateString(),
          color: moodInfo.color,
        });
        newEntryIds[mid] = eid;
      }
    });
    setEntryIds(newEntryIds);
  }, [id, moods, addMood]);

  useEffect(() => {
    if (!moodData.length) return;

    const mood = moodData[currentMoodIndex];
    if (mood) {
      const suggestionId = mood.traditionalId || mood.id;
      setSuggestions(MoodData.getSuggestions(suggestionId));
    }
  }, [currentMoodIndex, moodData]);

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