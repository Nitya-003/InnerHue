'use client';
export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { SuggestionPanel } from '@/components/SuggestionPanel';
import { MoodReflectionCard } from '@/components/MoodReflectionCard';

const OrbVisualizer = dynamic(
  () => import('@/components/OrbVisualizer').then(m => m.OrbVisualizer),
  { ssr: false }
);

import { MoodData } from '@/lib/moodData';
import { Mood, MoodSuggestion } from '@/types/mood';
import { useMoodStore } from '@/lib/useMoodStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import reflectiveMoods from '@/lib/reflectiveMoods';
import { getTraditionalMoodId } from '@/lib/moodMapping';

interface MoodWithMeta extends Mood {
  traditionalId?: string;
  spotifyPlaylistId?: string;
}

export default function MoodPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { moods?: string };
}) {
  const [moodData, setMoodData] = useState<MoodWithMeta[]>([]);
  const [suggestions, setSuggestions] = useState<MoodSuggestion | null>(null);
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showReflectionCard, setShowReflectionCard] = useState(true);

  const addMood = useMoodStore(state => state.addMood);

  useEffect(() => {
    setCurrentMoodIndex(0);

    (async () => {
      const resolvedParams = await params;

      const moodIds = searchParams?.moods
        ? searchParams.moods.split(',')
        : [resolvedParams.id];

      const moodsData = moodIds
        .map(id => {
          const reflectiveMood = reflectiveMoods.find(m => m.id === id);

          if (reflectiveMood) {
            const traditionalId = getTraditionalMoodId(id);
            const traditionalMood = MoodData.getMoodById(traditionalId);

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

          return MoodData.getMoodById(id);
        })
        .filter((m): m is MoodWithMeta => Boolean(m));

      setMoodData(moodsData);

      moodIds.forEach(moodId => {
        const moodInfo = moodsData.find(m => m.id === moodId);
        if (moodInfo) {
          addMood({
            mood: moodId,
            emotion: moodInfo.name,
            date: new Date().toDateString(),
            color: moodInfo.color,
          });
        }
      });
    })();
  }, [params, searchParams?.moods, addMood]);

  useEffect(() => {
    if (!moodData.length) return;

    const mood = moodData[currentMoodIndex];
    if (mood) {
      const suggestionId = mood.traditionalId || mood.id;
      const newSuggestions = MoodData.getSuggestions(suggestionId);
      setSuggestions(newSuggestions);
      setShowReflectionCard(true);
    }
  }, [currentMoodIndex, moodData]);

  if (!moodData.length || !suggestions) {
    return (
      <div className="min-h-screen bg-[#0f0720] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const currentMood = moodData[currentMoodIndex];

  return (
    <div className="min-h-screen bg-[#0f0720]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6 relative z-10"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.button className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur">
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </motion.button>
          </Link>
          <ThemeToggle />
        </div>
      </motion.header>

      <main className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <OrbVisualizer key={currentMood.id} mood={currentMood} />

          <SuggestionPanel
            suggestions={suggestions}
            mood={currentMood}
            onRefresh={async () => {
              setIsRefreshing(true);
              await new Promise(r => setTimeout(r, 300));
              const suggestionId =
                currentMood.traditionalId || currentMood.id;
              setSuggestions(MoodData.getSuggestions(suggestionId));
              setIsRefreshing(false);
            }}
          />
        </div>
      </main>
    </div>
  );
}