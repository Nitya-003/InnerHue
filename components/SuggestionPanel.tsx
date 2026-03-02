'use client';

import { motion } from 'framer-motion';
import { RefreshCw, MessageCircle, Quote as QuoteIcon, Hash, Music, Save, PenLine } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMoodStore } from '@/lib/useMoodStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { QuoteCard } from '@/components/QuoteCard';
import { QuoteSkeleton } from '@/components/QuoteSkeleton';
import { Quote } from '@/data/fallbackQuotes';
import { Mood, MoodSuggestion } from '@/types/mood';

interface SuggestionPanelProps {
  suggestions: MoodSuggestion;
  mood: Mood;
  onRefresh: () => void | Promise<void>;
  isRefreshing?: boolean;
  // Props for dynamic quotes
  quoteData?: Quote | null;
  isQuoteLoading?: boolean;
  onQuoteRefresh?: () => void;
  entryId?: string;
}

export function SuggestionPanel({
  suggestions,
  mood,
  onRefresh,
  isRefreshing = false,
  quoteData,
  isQuoteLoading,
  onQuoteRefresh,
  entryId
}: SuggestionPanelProps) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const updateMoodNotes = useMoodStore(state => state.updateMoodNotes);
  const moodHistory = useMoodStore(state => state.moodHistory);

  // Sync with existing notes if available (though entries are usually new here)
  useEffect(() => {
    if (entryId) {
      const entry = moodHistory.find(e => e.id === entryId);
      if (entry?.notes) {
        setNotes(entry.notes);
      }
    }
  }, [entryId, moodHistory]);

  const handleSaveNotes = () => {
    if (!entryId) return;
    setIsSaving(true);
    updateMoodNotes(entryId, notes);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">
          Personalized Insights
        </h3>
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-2 pt-2 pb-[1px] rounded-lg bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-all">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 text-purple-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </TooltipTrigger>

            <TooltipContent
              className="bg-white/80 backdrop-blur-md border-white/50 text-gray-800 shadow-xl"
            >
              <p>{isRefreshing ? 'Refreshing insights...' : 'Refresh Insights'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${suggestions.quote}" — ${suggestions.author}`);
    toast.success('Quote copied!');
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">

        {/* Journal Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Journal Prompt</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{suggestions.prompt}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quote Section - Dynamic or Static */}
      {onQuoteRefresh ? (
        // Dynamic Quote Mode
        isQuoteLoading ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
            <QuoteSkeleton />
          </div>
        ) : quoteData ? (
          <QuoteCard
            quote={quoteData}
            loading={!!isQuoteLoading}
            onRefresh={onQuoteRefresh}
          />
        ) : null
      ) : (
        // Legacy Static Fallback (if props not provided)
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50"
        >
          <div className="flex items-start space-x-3 relative">
            <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/50">
              <Quote className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Inspirational Quote</h4>
              <blockquote className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-2">
                &ldquo;{suggestions.quote}&rdquo;
              </blockquote>
              <cite className="text-sm text-gray-500 dark:text-gray-400">— {suggestions.author}</cite>
            </div>
          </div>
        </motion.div>
      )}

        {/* Keywords Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Emotion Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.keywords.map((keyword, index) => (
                  <motion.span
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="px-3 py-1 rounded-full text-sm font-medium hover:shadow-sm transition-all cursor-default text-gray-800 dark:text-gray-100 border border-gray-200/60 dark:border-gray-600/60"
                    style={{
                      background: `linear-gradient(135deg, ${mood.color}30, ${mood.glow}30)`
                    }}
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Music Soundscape (Spotify) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
              <Music className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">Soundscape</h4>

              <div className="relative w-full h-[152px] rounded-xl overflow-hidden bg-white/50 backdrop-blur-md shadow-inner border border-white/20">
                {!isPlayerLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur animate-pulse">
                    <div className="flex flex-col items-center space-y-2">
                      <Music className="w-8 h-8 text-green-400/50 animate-bounce" />
                      <span className="text-gray-500 text-sm font-medium">Loading Soundscape...</span>
                    </div>
                  </div>
                )}
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${mood.spotifyPlaylistId || '37i9dQZF1DX3Ogo9pFno96'}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className={`w-full h-full transition-opacity duration-500 ${isPlayerLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsPlayerLoaded(true)}
                />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                <span className="font-medium text-green-600">Suggested:</span> {suggestions.music}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <div className="flex justify-center pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-700 dark:text-gray-300 font-medium rounded-full shadow-md border border-white/50 dark:border-gray-700/50 hover:border-purple-300 hover:text-purple-700 dark:hover:border-purple-500 dark:hover:text-purple-400 transition-all disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Suggestions
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get new suggestions for your mood</p>
            </TooltipContent>
          </Tooltip>
        </div>

      </div>
    </TooltipProvider>
  );
}
