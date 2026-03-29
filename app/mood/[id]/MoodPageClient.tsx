'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { SuggestionPanel } from '@/components/SuggestionPanel';
import { OrbVisualizer } from '@/components/OrbVisualizer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MoodData, Mood, Suggestion } from '@/lib/moodData';
import { reflectiveMoods } from '@/lib/reflectiveMoods';
import { getTraditionalMoodId } from '@/lib/moodMapping';
import type { MoodHistoryEntry } from '@/types/mood';

interface MoodWithMeta extends Mood {
  traditionalId?: string;
  spotifyPlaylistId?: string;
}

interface MoodPageClientProps {
  id: string;
}

export default function MoodPageClient({ id }: MoodPageClientProps) {
  const searchParams = useSearchParams();
  const moods = searchParams.get('moods') ?? undefined;

  const [moodData, setMoodData] = useState<MoodWithMeta[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);

  useEffect(() => {
    const moodIds = moods ? moods.split(',') : [id];

    const moodsData = moodIds
      .map(mid => {
        const reflectiveMood = reflectiveMoods.find(m => m.id === mid);

        if (reflectiveMood) {
          const traditionalId = getTraditionalMoodId(mid);
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

        return MoodData.getMoodById(mid);
      })
      .filter(Boolean) as MoodWithMeta[];

    setMoodData(moodsData);

    if (moodsData.length > 0) {
      const moodSuggestions = MoodData.getSuggestions(moodsData[0].id);
      setSuggestions(moodSuggestions);
    }

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
  }, [id, moods]);

  if (!moodData.length || !suggestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const currentMood = moodData[currentMoodIndex];

  return (
    <div className="min-h-screen bg-background text-foreground">
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
              className="flex items-center space-x-2 p-2 rounded-lg border border-border bg-card/80 backdrop-blur shadow-sm hover:bg-muted hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
              <span className="text-foreground font-medium">Back</span>
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
                        ? 'bg-primary/10 ring-2 ring-primary/40'
                        : 'hover:bg-muted'
                        }`}
                    >
                      {mood.emoji}
                    </motion.button>
                  ))}
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Feeling {currentMood.name}
                  {moodData.length > 1 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({currentMoodIndex + 1} of {moodData.length})
                    </span>
                  )}
                </h1>
              </div>
            ) : (
              <>
                <span className="text-2xl">{currentMood.emoji}</span>
                <h1 className="text-2xl font-bold text-foreground">
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
              className="p-2 rounded-lg border border-border bg-card/80 backdrop-blur shadow-sm hover:bg-muted hover:shadow-md transition-all"
            >
              <Bookmark className="w-5 h-5 text-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-border bg-card/80 backdrop-blur shadow-sm hover:bg-muted hover:shadow-md transition-all"
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>
      </motion.header>

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
