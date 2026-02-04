"use client";


import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
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

      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "tween",
              duration: 0.4,
              ease: "easeOut",
              delay: index * 0.03
            }
          }
        }}
        whileHover={{
          scale: 1.08,
          y: -8,
          transition: {
            type: "tween",
            duration: 0.2,
            ease: "easeOut"
          }
        }}
        whileTap={{
          scale: 0.96,
          transition: { duration: 0.1 }
        }}
        className={`
        relative cursor-pointer p-4 rounded-2xl backdrop-blur-md border
        transform-gpu will-change-transform
        ${isSelected
            ? 'bg-white/90 shadow-2xl border-purple-300'
            : 'bg-white/30 shadow-lg border-white/40 hover:bg-white/50'
          }
      `}
        onClick={onSelect}
        style={{
          boxShadow: isSelected
            ? `0 20px 40px rgba(139, 92, 246, 0.35), 0 0 0 2px ${mood.color}50, 0 0 15px ${mood.glow}30`
            : '0 8px 24px rgba(0, 0, 0, 0.15)',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
        }}
      >
        {/* Emoji container - simplified animation */}
        <div className="text-center">
          {/* Selection indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center z-10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-3 h-3 bg-white rounded-full"
              />
            </motion.div>
          )}
          {/* Floating animation for emoji */}
          <motion.div
            animate={{
              y: [0, -4, 0],
              rotate: [0, 3, -3, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
            className="text-center mb-2"
          >
            <motion.div
              className="text-3xl mb-1 select-none"
              whileHover={{
                scale: 1.15,
                transition: { type: "tween", duration: 0.15 }
              }}
            >
              {mood.emoji}
            </motion.div>
            <div className="text-sm font-medium text-gray-800">{mood.name}</div>
          </motion.div>
        </div>
        <div className="text-sm font-medium text-gray-800 drop-shadow-sm">
          {mood.name}
        </div>
      </motion.div >

      {/* Glow effect - only when selected */}

      {
        isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}

            className="absolute inset-0 pointer-events-none"
          >
            <Sparkles className="absolute top-2 left-2 w-4 h-4 text-yellow-200 opacity-50 animate-pulse" />
            <Sparkles className="absolute bottom-3 right-3 w-3 h-3 text-white opacity-50 animate-bounce" />
          </motion.div>
        )
      }
    </motion.button >
  );
});
