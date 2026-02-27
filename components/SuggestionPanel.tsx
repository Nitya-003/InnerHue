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
  onRefresh: () => void;
  // New props for dynamic quotes
  quoteData?: Quote | null;
  isQuoteLoading?: boolean;
  onQuoteRefresh?: () => void;
  entryId?: string;
}

export function SuggestionPanel({
  suggestions,
  mood,
  onRefresh,
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
                  className="transition-all"
                >
                  <RefreshCw className="w-5 text-purple-600" />
                </motion.button>
              </div>
            </TooltipTrigger>

            <TooltipContent
              className="bg-white/80 backdrop-blur-md border-white/50 text-gray-800 shadow-xl"
            >
              <p>Refresh Insights</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Journal Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <MessageCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Journal Prompt</h4>
            <p className="text-gray-700 leading-relaxed">{suggestions.prompt}</p>
          </div>
        </div>
      </motion.div>

      {/* Reflection Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-indigo-100">
            <PenLine className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-2">Reflection Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? What's on your mind?..."
              className="w-full h-32 p-3 rounded-xl bg-white/50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none text-gray-700 placeholder:text-gray-400"
            />
            <div className="flex justify-end mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveNotes}
                disabled={!entryId || isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSaving
                    ? 'bg-green-500 text-white shadow-inner'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Reflection
                  </>
                )}
              </motion.button>
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
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-pink-100">
              <QuoteIcon className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Inspirational Quote</h4>
              <blockquote className="text-gray-700 italic leading-relaxed mb-2">
                &quot;{suggestions.quote}&quot;
              </blockquote>
              <cite className="text-sm text-gray-500">— {suggestions.author}</cite>
            </div>
          </div>
        </motion.div>
      )}

      {/* Keywords Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Hash className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-3">Emotion Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.keywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium hover:shadow-sm transition-all cursor-default"
                  style={{
                    background: `linear-gradient(135deg, ${mood.color}20, ${mood.glow}20)`
                  }}
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Music Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-green-100">
            <Music className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-2">Music Recommendation</h4>
            <p className="text-gray-700 mb-3">{suggestions.music}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
            >
              Listen on Spotify
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
