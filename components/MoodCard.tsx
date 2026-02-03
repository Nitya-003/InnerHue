"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

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

export function MoodCard({ mood, index, isSelected, onSelect }: MoodCardProps) {
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
      {/* Background Glow Effect (Hidden from screen readers) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
        style={{ background: `radial-gradient(circle at center, ${mood.glow}40, transparent 70%)` }}
      />

      {/* Emoji Section */}
      <div className="relative z-10 text-4xl drop-shadow-lg filter group-hover:brightness-110 transition-all">
        {mood.emoji}
        
        {/* Selection Indicator Icon */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-white text-purple-900 rounded-full p-1 shadow-lg"
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </motion.div>
        )}
      </div>

      {/* Text with High Contrast Shadow */}
      <span className="relative z-10 font-medium text-sm md:text-base text-white drop-shadow-md">
        {mood.name}
      </span>

      {/* Sparkle Decoration (Visual only) */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <Sparkles className="absolute top-2 left-2 w-4 h-4 text-yellow-200 opacity-50 animate-pulse" />
          <Sparkles className="absolute bottom-3 right-3 w-3 h-3 text-white opacity-50 animate-bounce" />
        </motion.div>
      )}
    </motion.button>
  );
}