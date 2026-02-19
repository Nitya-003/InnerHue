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

interface MoodPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    moods?: string;
  };
}

export default function MoodPage({ params, searchParams }: MoodPageProps) {
  const [moodData, setMoodData] = useState<any[]>([]);
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
      .map(id => MoodData.getMoodById(id))
      .filter(Boolean);

    setMoodData(moodsData);

    // Save to Zustand store instead of localStorage
    moodIds.forEach(moodId => {
      const moodInfo = MoodData.getMoodById(moodId);
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
      const newSuggestions = MoodData.getSuggestions(mood.id);
      setSuggestions(newSuggestions);
      setShowReflectionCard(true); // Show reflection card when mood changes
    }
  }, [currentMoodIndex, moodData]);

  if (!moodData.length || !suggestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-[hsl(var(--page-light-from))] dark:via-[hsl(var(--page-light-via))] dark:to-[hsl(var(--page-light-to))] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // At this point currentMood is guaranteed to be defined because moodData.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-[hsl(var(--page-light-from))] dark:via-[hsl(var(--page-light-via))] dark:to-[hsl(var(--page-light-to))]">
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
              className="flex items-center space-x-2 p-2 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="hidden md:inline text-purple-600 dark:text-purple-400 font-medium">Back</span>
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
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
                <span className="text-xl md:text-2xl">{currentMood.emoji}</span>
                <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Feeling {currentMood.name}
                </h1>
              </>
            )}
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <Bookmark className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                const url = window.location.href;
                const title = `Feeling ${currentMood.name} on InnerHue`;
                const text = `I'm exploring my emotions with InnerHue. Check it out!`;

                if (navigator.share) {
                  try {
                    await navigator.share({ title, text, url });
                  } catch (err) {
                    console.error('Error sharing:', err);
                  }
                } else {
                  try {
                    await navigator.clipboard.writeText(url);
                    setIsShared(true);
                    setTimeout(() => setIsShared(false), 2000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }
              }}
              className="p-2 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              {isShared ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
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
                  // Small delay to show visual feedback
                  await new Promise(resolve => setTimeout(resolve, 300));
                  const newSuggestions = MoodData.getSuggestions(currentMood.id);
                  setSuggestions({ ...newSuggestions });
                  setIsRefreshing(false);
                }}
                quoteData={quote}
                isQuoteLoading={quoteLoading}
                onQuoteRefresh={loadQuote}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}