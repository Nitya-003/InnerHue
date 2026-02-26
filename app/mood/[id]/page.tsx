'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { SuggestionPanel } from '@/components/SuggestionPanel';
import { MoodData } from '@/lib/moodData';
import { Mood, MoodSuggestion } from '@/types/mood';
import { useMoodStore } from '@/lib/useMoodStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import reflectiveMoods from '@/lib/reflectiveMoods';
import { getTraditionalMoodId } from '@/lib/moodMapping';

const OrbVisualizer = dynamic(
  () => import('@/components/OrbVisualizer').then(m => m.OrbVisualizer),
  { ssr: false }
);

interface MoodWithMeta extends Mood {
  traditionalId?: string;
  spotifyPlaylistId?: string;
}

export default function MoodClient({
  id,
  moods
}: {
  id: string;
  moods?: string;
}) {
  const [moodData, setMoodData] = useState<MoodWithMeta[]>([]);
  const [suggestions, setSuggestions] = useState<MoodSuggestion | null>(null);
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
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

    moodIds.forEach(mid => {
      const moodInfo = moodsData.find(m => m.id === mid);
      if (moodInfo) {
        addMood({
          mood: mid,
          emotion: moodInfo.name,
          date: new Date().toDateString(),
          color: moodInfo.color,
        });
      }
    });
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
    return <div className="min-h-screen bg-[#0f0720]" />;
  }

  const currentMood = moodData[currentMoodIndex];

  return (
    <div className="min-h-screen bg-[#0f0720]">
      <motion.header className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.button className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur">
              <ArrowLeft className="w-5 h-5 text-white/70" />
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
                <h1 className="text-2xl font-bold text-white">
                  Feeling {currentMood.name}
                  <span className="text-sm text-white/60 ml-2">
                    ({currentMoodIndex + 1} of {moodData.length})
                  </span>
                </h1>
              </div>
            ) : (
              <>
                <span className="text-xl md:text-2xl">{currentMood.emoji}</span>
                <h1 className="text-lg md:text-2xl font-bold text-white">
                  Feeling {currentMood.name}
                </h1>
              </>
            )}
          </div>

          <ThemeToggle />
        </div>
      </motion.header>

      {/* Main Content */}
      <main id="main" className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <OrbVisualizer key={currentMood.id} mood={currentMood} />
          <SuggestionPanel
            suggestions={suggestions}
            mood={currentMood}
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