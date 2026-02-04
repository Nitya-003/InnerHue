'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { memo } from 'react';
import './moodcard.css';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
}

interface MoodCardProps {
  mood: Mood;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const MoodCard = memo(function MoodCard({ mood, index, isSelected, onSelect }: MoodCardProps) {
  return (
    <motion.button
      // 1. Semantic HTML: Use 'button' instead of 'div' for keyboard focus
      onClick={onSelect}
      
      // 2. ARIA Labels: Tells screen readers what this is and its state
      aria-label={`Select ${mood.name} mood`}
      aria-pressed={isSelected}
      
      // Animation props
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      
      // 3. Focus Ring: Essential for keyboard users (Tab key)
      className={`
        relative group p-4 rounded-2xl border transition-all duration-300 w-full aspect-square flex flex-col items-center justify-center gap-3
        focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        ${isSelected 
          ? "bg-white/20 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
        }
      `}
    >
      {/* Selection Indicator (Checkmark) */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 bg-white text-purple-600 rounded-full p-1 shadow-lg"
        >
          <Check size={14} strokeWidth={3} />
        </motion.div>
      )}

      {/* Hover Effect (Sparkles) - Visual delight only, hidden from screen readers */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
        <Sparkles className="absolute top-2 left-2 w-4 h-4 text-white/40 animate-pulse" />
        <Sparkles className="absolute bottom-4 right-4 w-3 h-3 text-white/30 animate-ping" />
      </div>

      {/* Mood Content */}
      <span className="text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
        {mood.emoji}
      </span>
      <span className="font-medium text-white/90 tracking-wide text-sm md:text-base group-hover:text-white transition-colors">
        {mood.name}
      </span>
      
      {/* Active Glow Effect */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-2xl -z-10 opacity-50 blur-xl transition-all duration-500"
          style={{ backgroundColor: mood.glow }}
        />
      )}
    </motion.button>
  );
});
