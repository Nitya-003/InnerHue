'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Bookmark, Share2, Check } from 'lucide-react';
import { OrbVisualizer } from '@/components/OrbVisualizer';
import { SuggestionPanel } from '@/components/SuggestionPanel';
import { MoodReflectionCard } from '@/components/MoodReflectionCard';
import { MoodData } from '@/lib/moodData';
import { getQuoteByMood } from '@/lib/getQuote';
import { moodTags } from '@/lib/quoteTags';
import { Quote } from '@/data/fallbackQuotes';
import { useMoodStore } from '@/lib/useMoodStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import reflectiveMoods from '@/lib/reflectiveMoods';
import { getTraditionalMoodId } from '@/lib/moodMapping';

// Type for mood objects that can have traditionalId (for reflective moods)
interface MoodWithTraditionalId {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  traditionalId?: string; // Optional: only present for reflective moods
  spotifyPlaylistId?: string;
}

interface MoodPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    moods?: string;
  };
}

export default function MoodPage({ params, searchParams }: MoodPageProps) {
  const [moodData, setMoodData] = useState<MoodWithTraditionalId[]>([]);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showReflectionCard, setShowReflectionCard] = useState(true);

  // Computed values must be safe even if data is empty
  const currentMood = moodData[currentMoodIndex] || moodData[0];

  const loadQuote = useCallback(async () => {
    if (!currentMood) return;
    setQuoteLoading(true);
    try {
      const tag = moodTags[currentMood.id] || 'inspirational';
      const data = await getQuoteByMood(tag);
      setQuote(data);
    } catch (error) {
      console.error("Failed to load quote", error);
    } finally {
      setQuoteLoading(false);
    }
  }, [currentMood]);

  useEffect(() => {
    if (currentMood?.id) {
      loadQuote();
    }
  }, [currentMood?.id, loadQuote]);

  // Get addMood action from Zustand store
  const addMood = useMoodStore(state => state.addMood);
  // Fix 1: Main Data Fetching & Index Reset
  useEffect(() => {
    // 🔥 Reset index when route/params change
    setCurrentMoodIndex(0);

    // Get all selected moods from query param, fallback to single mood from URL
    const moodIds = searchParams?.moods ? searchParams.moods.split(',') : [params.id];

    // Get mood data for all selected moods
    const moodsData = moodIds
      .map(id => {
        // Try reflective moods first, then fall back to traditional moods
        const reflectiveMood = reflectiveMoods.find(m => m.id === id);
        if (reflectiveMood) {
          // Map reflective mood to traditional mood for getting suggestions
          const traditionalId = getTraditionalMoodId(id);
          const traditionalMood = MoodData.getMoodById(traditionalId);
          // Create adapter object that combines both systems
          return {
            id: reflectiveMood.id,
            name: reflectiveMood.label,
            emoji: reflectiveMood.label?.charAt(0).toUpperCase() || '✨', // Use first letter for uniqueness
            color: reflectiveMood.color,
            glow: reflectiveMood.glow,
            traditionalId: traditionalId, // Store for getting suggestions
            spotifyPlaylistId: traditionalMood?.spotifyPlaylistId,
          };
        }
        // Fall back to traditional mood system
        return MoodData.getMoodById(id);
      })
      .filter(Boolean);

    setMoodData(moodsData);

    // Save to Zustand store instead of localStorage
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
  }, [params.id, searchParams?.moods, addMood]);

  // Fix 2: Sync suggestions automatically when Index or Data changes
  useEffect(() => {
    if (!moodData.length) return;
    const mood = moodData[currentMoodIndex];
    if (mood) {
      // Use traditionalId if available (for reflective moods), otherwise use the mood id
      const suggestionId = mood.traditionalId || mood.id;
      const newSuggestions = MoodData.getSuggestions(suggestionId);
      setSuggestions(newSuggestions);
      setShowReflectionCard(true); // Show reflection card when mood changes
    }
  }, [currentMoodIndex, moodData]);

  // Load quote for the current mood
  const loadQuote = useCallback(async () => {
    if (!currentMood) return;
    setQuoteLoading(true);
    try {
      // Use traditionalId for quote tags if available
      const moodIdForTag = (currentMood as any).traditionalId || currentMood.id;
      const tag = moodTags[moodIdForTag] ?? 'inspirational';
      const q = await getQuoteByMood(tag);
      setQuote(q);
    } catch {
      setQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  }, [currentMood]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  if (!moodData.length || !suggestions) {
    return (
      <div className="min-h-screen bg-[#0f0720] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // At this point currentMood is guaranteed to be defined because moodData.length > 0

  return (
    <div className="min-h-screen bg-[#0f0720]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6 relative z-10"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
              <span className="hidden md:inline text-white font-medium">Back</span>
            </motion.button>
          </Link>

          <div className="flex items-center  space-x-2">
            {moodData.length > 1 ? (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {moodData.map((mood, index) => (
                    <motion.button
                      key={mood.id}
                      onClick={() => {
                        // Logic simplified: The useEffect handles the suggestion sync
                        setCurrentMoodIndex(index);
                      }}
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
                  {moodData.length > 1 && (
                    <span className="text-sm text-white/60 ml-2">
                      ({currentMoodIndex + 1} of {moodData.length})
                    </span>
                  )}
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

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <Bookmark className="w-5 h-5 text-white/70" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <Share2 className="w-5 h-5 text-white/70" />
            </motion.button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      {/* Main Content */}
      <main className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Mood Reflection Card */}
          {showReflectionCard && suggestions && (
            <MoodReflectionCard
              mood={currentMood}
              suggestion={suggestions}
              onClose={() => setShowReflectionCard(false)}
            />
          )}

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Orb Visualizer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Fix 3: Added key prop to force re-render on mood change */}
              <OrbVisualizer key={currentMood.id} mood={currentMood} />
            </motion.div>

            {/* Right Side - Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SuggestionPanel
                suggestions={suggestions}
                mood={currentMood}
                isRefreshing={isRefreshing}
                onRefresh={async () => {
                  setIsRefreshing(true);
                  await new Promise(resolve => setTimeout(resolve, 300));
                  const suggestionId = (currentMood as any).traditionalId || currentMood.id;
                  const newSuggestions = MoodData.getSuggestions(suggestionId);
                  setSuggestions({ ...newSuggestions });
                  setIsRefreshing(false);
                }}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}