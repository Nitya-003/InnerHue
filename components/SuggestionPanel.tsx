'use client';

import { motion } from 'framer-motion';
import { RefreshCw, MessageCircle, Quote as QuoteIcon, Hash, Music } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { QuoteCard } from '@/components/QuoteCard';
import { QuoteSkeleton } from '@/components/QuoteSkeleton';
import { Quote } from '@/data/fallbackQuotes';

interface SuggestionPanelProps {
  suggestions: {
    prompt: string;
    quote: string;
    author: string;
    keywords: string[];
    music: string;
  };
  mood: any;
  onRefresh: () => void;
  // New props for dynamic quotes
  quoteData?: Quote | null;
  isQuoteLoading?: boolean;
  onQuoteRefresh?: () => void;
}

export function SuggestionPanel({
  suggestions,
  mood,
  onRefresh,
  quoteData,
  isQuoteLoading,
  onQuoteRefresh
}: SuggestionPanelProps) {
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
