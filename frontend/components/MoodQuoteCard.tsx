'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import quotesData from '../data/moodQuotes.json';

interface Quote {
  content: string;
  author: string;
}

interface QuotesDatabase {
  [key: string]: Quote[];
}

interface MoodQuoteCardProps {
  moodId: string;
  moodColor: string;
  moodGlow: string;
  fallbackQuote?: string;
  fallbackAuthor?: string;
}

// Maps reflective/custom mood IDs to traditional categories
const reflectiveToTraditional: Record<string, string> = {
  'quiet-contentment': 'calm',
  'gentle-ease': 'calm',
  'soft-presence': 'calm',
  'grounded-stability': 'calm',
  'muted-optimism': 'hopeful',
  'anticipatory-excitement': 'excited',
  'tender-gratitude': 'grateful',
  'emerging-clarity': 'hopeful',
  'renewed-determination': 'hopeful',
  'purposeful-energy': 'energized',
  'focused-drive': 'energized',
  'lingering-restlessness': 'anxious',
  'social-fatigue': 'stressed',
  'quiet-overwhelm': 'stressed',
  'building-tension': 'anxious',
  'scattered-thoughts': 'confused',
  'emotional-fog': 'confused',
  'thoughtful-distance': 'peaceful',
  'observant-stillness': 'calm',
  'curious-awareness': 'curious',
  'reflective-pause': 'peaceful',
  'tender-vulnerability': 'vulnerable',
  'gentle-melancholy': 'sad',
  'aching-loneliness': 'lonely',
  'raw-emotion': 'overwhelmed',
  'creative-spark': 'inspired',
  'lighthearted-joy': 'happy',
  'inspired-momentum': 'inspired',
  'bittersweet-nostalgia': 'nostalgic',
  'cautious-hope': 'hopeful',
  'restrained-frustration': 'frustrated',
  'peaceful-resignation': 'peaceful',
};

// Maps traditional IDs to quotes categories in moodQuotes.json
function getQuoteCategory(moodId: string): string {
  // Resolve reflective IDs first
  const resolvedId = reflectiveToTraditional[moodId] || moodId;
  const normalized = resolvedId.toLowerCase();
  
  if (['happy', 'excited', 'playful', 'silly', 'content'].includes(normalized)) {
    return 'happy';
  }
  if (['sad', 'melancholy', 'lonely', 'vulnerable'].includes(normalized)) {
    return 'sad';
  }
  if (['anxious', 'stressed', 'overwhelmed', 'confused', 'embarrassed', 'surprised', 'jealous'].includes(normalized)) {
    return 'anxious';
  }
  if (['calm', 'peaceful', 'dreamy', 'romantic', 'philosophical'].includes(normalized)) {
    return 'calm';
  }
  if (['motivated', 'inspired', 'determined', 'empowered', 'proud', 'grateful', 'adventurous'].includes(normalized)) {
    return 'motivated';
  }
  if (['angry', 'frustrated', 'rebellious', 'disgusted'].includes(normalized)) {
    return 'angry';
  }
  
  return 'general';
}

export function MoodQuoteCard({
  moodId,
  moodColor,
  moodGlow,
  fallbackQuote,
  fallbackAuthor,
}: MoodQuoteCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set up quotes when moodId or fallbacks change
  useEffect(() => {
    const category = getQuoteCategory(moodId);
    const db = quotesData as QuotesDatabase;
    const categoryQuotes = db[category] || db['general'] || [];
    
    // Add custom fallback if provided
    if (fallbackQuote) {
      const customQuote: Quote = {
        content: fallbackQuote,
        author: fallbackAuthor || 'Unknown',
      };
      // Check if it already exists to avoid duplicates
      const exists = categoryQuotes.some(q => q.content === fallbackQuote);
      if (!exists) {
        setQuotes([customQuote, ...categoryQuotes]);
        setCurrentQuoteIndex(0);
        return;
      }
    }

    setQuotes(categoryQuotes);
    setCurrentQuoteIndex(0);
  }, [moodId, fallbackQuote, fallbackAuthor]);

  const handleRefresh = () => {
    if (quotes.length <= 1 || isRefreshing) return;
    
    setIsRefreshing(true);
    
    // Simulate brief network/fade delay for a premium feel
    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      setIsRefreshing(false);
    }, 450);
  };

  const isDark = mounted && resolvedTheme === 'dark';

  if (!mounted || quotes.length === 0) {
    return (
      <div className="bg-white/40 dark:bg-slate-900/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-slate-800/50 shadow-md h-[180px] animate-pulse" />
    );
  }

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden backdrop-blur-md rounded-2xl p-6 sm:p-7 border transition-all duration-500 hover:shadow-2xl cursor-default group"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.25) 0%, rgba(15, 23, 42, 0.4) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.35) 100%)',
        borderColor: isHovered 
          ? `${moodColor}50` 
          : isDark 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(255, 255, 255, 0.3)',
        boxShadow: isHovered
          ? `0 20px 45px ${moodColor}15, inset 0 0 16px ${moodGlow}08`
          : isDark
            ? '0 10px 30px rgba(0, 0, 0, 0.15)'
            : '0 10px 30px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Decorative subtle background ambient light */}
      <div
        className="absolute -top-12 -left-12 w-28 h-28 rounded-full blur-3xl opacity-15 transition-all duration-500 group-hover:scale-125"
        style={{ backgroundColor: moodColor }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full blur-3xl opacity-10 transition-all duration-500 group-hover:scale-125"
        style={{ backgroundColor: moodGlow }}
      />

      <div className="relative pl-6 border-l-3" style={{ borderLeftColor: `${moodColor}60` }}>
        {/* Quote Icon decoration */}
        <QuoteIcon 
          className="absolute -top-3 -left-2 w-8 h-8 opacity-10 transform -scale-x-100 transition-colors duration-300" 
          style={{ color: moodColor }}
        />
        
        {/* Animated Quote Content */}
        <div className="min-h-[72px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <blockquote className="font-serif text-lg sm:text-xl italic text-gray-800 dark:text-gray-100 leading-relaxed mb-3">
                &ldquo;{currentQuote.content}&rdquo;
              </blockquote>
              <cite className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider not-italic">
                — {currentQuote.author}
              </cite>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action button & indicator */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100/10 dark:border-white/5">
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wider">
            QUOTE {currentQuoteIndex + 1} OF {quotes.length}
          </span>
          
          {quotes.length > 1 && (
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full hover:bg-gray-100/10 dark:hover:bg-white/10 transition-all duration-200 shadow-sm border border-transparent hover:border-gray-200/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
              style={{ color: isHovered ? moodColor : undefined }}
              aria-label="New quote"
            >
              <RefreshCw 
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                style={{ animationDuration: '0.6s' }}
              />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
