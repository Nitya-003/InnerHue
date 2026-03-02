'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RefreshCw, MessageCircle, Quote, Hash, Music, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SuggestionPanelProps {
  suggestions: {
    prompt: string;
    quote: string;
    author: string;
    keywords: string[];
    music: string;
  };
  mood: any;
  onRefresh: () => void | Promise<void>;
  isRefreshing?: boolean;
}

export function SuggestionPanel({ suggestions, mood, onRefresh, isRefreshing = false }: SuggestionPanelProps) {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  useEffect(() => {
    setIsPlayerLoaded(false);
  }, [mood.id]);

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
        </motion.div>

        {/* Quote */}
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

            <div className="absolute right-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-[6px] rounded-full text-pink-400 hover:bg-pink-50 hover:text-pink-600 transition-colors opacity-70 hover:opacity-100"
                aria-label="Copy quote"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

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
