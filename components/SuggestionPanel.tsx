'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { RefreshCw, MessageCircle, Quote, Hash, Music, Copy, Sparkles } from 'lucide-react';
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
  /** Optional quote data from API (mood detail page) */
  quoteData?: { content: string; author: string } | null;
  isQuoteLoading?: boolean;
  onQuoteRefresh?: () => void | Promise<void>;
}

export function SuggestionPanel({ suggestions, mood, onRefresh, isRefreshing = false }: SuggestionPanelProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${suggestions.quote}" - ${suggestions.author}`);
    toast.success('Quote copied to clipboard');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    },
    hover: {
      scale: 1.03,
      y: -8,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    }
  };

  return (
    <TooltipProvider delayDuration={500}>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with animated gradient */}
        <motion.div
          className="flex items-center justify-between p-5 rounded-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `linear-gradient(135deg, ${mood.color}20, ${mood.glow}15, transparent)`,
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-40"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              background: `linear-gradient(90deg, transparent, ${mood.glow}30, transparent)`,
              width: '50%',
            }}
          />

          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                transition={{ type: 'keyframes', duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              >
                <Sparkles className="w-3 h-3" style={{ color: mood.glow }} />
              </motion.div>
            ))}
          </div>

          <motion.h3
            className="text-2xl font-bold relative z-10 flex items-center gap-2 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <motion.span 
              animate={{ rotate: [0, 15, -15, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            Personalized Insights
          </motion.h3>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-3 rounded-xl backdrop-blur shadow-lg hover:shadow-xl transition-all disabled:opacity-50 relative z-10"
                style={{
                  background: `linear-gradient(135deg, ${mood.color}30, ${mood.glow}20)`,
                  border: `1px solid ${mood.color}30`,
                }}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: mood.color }} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="bg-white/90 backdrop-blur-md border-white/50 text-gray-800 shadow-xl">
              <p>{isRefreshing ? 'Refreshing insights...' : 'Refresh all insights'}</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Journal Prompt */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onHoverStart={() => setHoveredCard('prompt')}
          onHoverEnd={() => setHoveredCard(null)}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-md rounded-2xl p-6 shadow-lg border cursor-pointer transition-all duration-300 relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
            borderColor: hoveredCard === 'prompt' ? mood.color : 'rgba(255,255,255,0.1)',
            boxShadow: hoveredCard === 'prompt' ? `0 25px 50px ${mood.color}30, 0 0 0 1px ${mood.glow}40` : '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${mood.color}10, ${mood.glow}08)` }} />
          <motion.div className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${mood.glow}, transparent)`, filter: 'blur(20px)' }} />
          <div className="flex items-start space-x-4 relative z-10">
            <motion.div className="p-3 rounded-xl shadow-md" style={{ background: `linear-gradient(135deg, ${mood.color}30, ${mood.glow}20)` }} whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }} transition={{ duration: 0.5 }}>
              <MessageCircle className="w-6 h-6" style={{ color: mood.color }} />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-2 text-lg group-hover:text-white/90 transition-colors flex items-center gap-2">
                Journal Prompt
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${mood.color}20`, color: mood.color }}>Today</motion.span>
              </h4>
              <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">{suggestions.prompt}</p>
            </div>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onHoverStart={() => setHoveredCard('quote')}
          onHoverEnd={() => setHoveredCard(null)}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md rounded-2xl p-6 shadow-lg border cursor-pointer transition-all duration-300 relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
            borderColor: hoveredCard === 'quote' ? mood.glow : 'rgba(255,255,255,0.1)',
            boxShadow: hoveredCard === 'quote' ? `0 25px 50px ${mood.glow}30, 0 0 0 1px ${mood.color}40` : '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          <motion.div className="absolute right-6 top-4 text-8xl font-serif opacity-5 group-hover:opacity-15 transition-opacity duration-500" style={{ color: mood.color }} animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>&quot;</motion.div>
          <div className="flex items-start space-x-4 relative z-10">
            <motion.div className="p-3 rounded-xl shadow-md" style={{ background: `linear-gradient(135deg, ${mood.glow}30, ${mood.color}20)` }} whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }} transition={{ duration: 0.5 }}>
              <Quote className="w-6 h-6" style={{ color: mood.glow }} />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-white text-lg group-hover:text-white/90 transition-colors">Inspirational Quote</h4>
                <motion.button whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={handleCopy} className="p-2 rounded-full transition-all opacity-60 hover:opacity-100" style={{ background: `${mood.glow}20` }}>
                  <Copy className="w-4 h-4" style={{ color: mood.glow }} />
                </motion.button>
              </div>
              <blockquote className="text-white/70 italic leading-relaxed mb-3 text-lg group-hover:text-white/80 transition-colors">&quot;{suggestions.quote}&quot;</blockquote>
              <motion.cite className="text-sm font-medium flex items-center gap-2" style={{ color: mood.color }}>
                <span className="w-8 h-0.5 rounded-full" style={{ background: mood.color }} />
                {suggestions.author}
              </motion.cite>
            </div>
          </div>
        </motion.div>

        {/* Keywords Cloud */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onHoverStart={() => setHoveredCard('keywords')}
          onHoverEnd={() => setHoveredCard(null)}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-md rounded-2xl p-6 shadow-lg border cursor-pointer transition-all duration-300 relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
            borderColor: hoveredCard === 'keywords' ? mood.color : 'rgba(255,255,255,0.1)',
            boxShadow: hoveredCard === 'keywords' ? `0 25px 50px ${mood.color}25, 0 0 0 1px ${mood.glow}35` : '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-20 group-hover:opacity-50 transition-opacity duration-500">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} className="absolute w-3 h-3 rounded-full" style={{ background: i % 2 === 0 ? mood.color : mood.glow, left: `${10 + i * 12}%`, top: `${20 + (i % 4) * 20}%` }} animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }} transition={{ type: 'keyframes', duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
          <div className="flex items-start space-x-4 relative z-10">
            <motion.div className="p-3 rounded-xl shadow-md" style={{ background: `linear-gradient(135deg, ${mood.color}30, ${mood.glow}20)` }} whileHover={{ rotate: 360, scale: 1.15 }} transition={{ duration: 0.6 }}>
              <Hash className="w-6 h-6" style={{ color: mood.color }} />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-4 text-lg group-hover:text-white/90">Emotion Keywords</h4>
              <div className="flex flex-wrap gap-3">
                {suggestions.keywords.map((keyword, index) => (
                  <motion.span key={keyword} initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 }} whileHover={{ scale: 1.2, y: -5, boxShadow: `0 10px 25px ${mood.color}50` }} className="px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200" style={{ background: `linear-gradient(135deg, ${mood.color}35, ${mood.glow}30)`, color: mood.color, border: `2px solid ${mood.color}40` }}>
                    #{keyword}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Music Suggestion */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onHoverStart={() => setHoveredCard('music')}
          onHoverEnd={() => setHoveredCard(null)}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-md rounded-2xl p-6 shadow-lg border cursor-pointer transition-all duration-300 relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
            borderColor: hoveredCard === 'music' ? mood.color : 'rgba(255,255,255,0.1)',
            boxShadow: hoveredCard === 'music' ? `0 25px 50px ${mood.color}25, 0 0 0 1px ${mood.glow}35` : '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-20 opacity-15 group-hover:opacity-30 transition-opacity duration-500 flex items-end justify-center gap-1 overflow-hidden">
            {[...Array(25)].map((_, i) => (
              <motion.div key={i} className="w-1.5 rounded-full" style={{ background: `linear-gradient(to top, ${mood.color}, ${mood.glow})` }} animate={{ height: [8, 30 + Math.random() * 35, 8] }} transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }} />
            ))}
          </div>
          <div className="flex items-start space-x-4 relative z-10">
            <motion.div className="p-3 rounded-xl shadow-md" style={{ background: `linear-gradient(135deg, ${mood.color}30, ${mood.glow}20)` }} animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Music className="w-6 h-6" style={{ color: mood.color }} />
            </motion.div>
            <div className="flex-1 space-y-4">
              <h4 className="font-bold text-white text-lg group-hover:text-white/90">Soundscape</h4>
              <a href="/music" className="block">
                <div className="relative w-full h-[152px] rounded-xl overflow-hidden shadow-inner hover:shadow-lg transition-all" style={{ background: `linear-gradient(135deg, ${mood.color}15, ${mood.glow}10)`, border: `1px solid ${mood.color}30` }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-4"
                    >
                      <Music className="w-12 h-12" style={{ color: mood.color }} />
                    </motion.div>
                    <span className="text-lg font-semibold text-white mb-1">Calming Ambient Music</span>
                    <span className="text-sm" style={{ color: mood.color }}>Tap to explore soundscapes →</span>
                    
                    {/* Animated visualizer bars */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 px-4">
                      {[...Array(20)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="w-1 rounded-t-full" 
                          style={{ background: `linear-gradient(to top, ${mood.color}, ${mood.glow})` }}
                          animate={{ height: [8, 20 + Math.random() * 30, 8] }}
                          transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.03 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </a>
              <motion.p className="text-sm italic flex items-center gap-2" style={{ color: mood.color }}>
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Suggested:</span>
                <span className="text-white/60">{suggestions.music}</span>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
