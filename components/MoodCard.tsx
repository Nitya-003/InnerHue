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
        relative cursor-pointer p-4 rounded-2xl backdrop-blur-md border outline-none
        transform-gpu will-change-transform flex flex-col items-center justify-center gap-3 aspect-square w-full
        ${isSelected
          ? 'bg-white/90 shadow-2xl border-purple-300'
          : 'bg-white/30 shadow-lg border-white/40 hover:bg-white/50'
        }
      `}
      onClick={onSelect}
      aria-label={`Select ${mood.name} mood`}
      aria-pressed={isSelected}
      style={{
        boxShadow: isSelected
          ? `0 20px 40px rgba(139, 92, 246, 0.35), 0 0 0 2px ${mood.color}50, 0 0 15px ${mood.glow}30`
          : '0 8px 24px rgba(0, 0, 0, 0.15)',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center z-10 shadow-md"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-3 h-3 bg-white rounded-full"
          />
          {/* Alternative Check Icon if preferred */}
          {/* <Check className="w-3 h-3 text-white strok-[3]" /> */}
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
        className="text-center mb-1 flex flex-col items-center"
      >
        <motion.div
          className="text-4xl mb-2 select-none filter drop-shadow-md"
          whileHover={{
            scale: 1.15,
            transition: { type: "tween", duration: 0.15 }
          }}
        >
          {mood.emoji}
        </motion.div>

        <div className={`text-sm font-medium transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
          {mood.name}
        </div>
      </motion.div>

      {/* Glow effect - only when selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
        >
          <Sparkles className="absolute top-2 left-2 w-4 h-4 text-yellow-200 opacity-50 animate-pulse" />
          <Sparkles className="absolute bottom-3 right-3 w-3 h-3 text-purple-400 opacity-50 animate-bounce" />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at center, ${mood.glow}20 0%, transparent 70%)`
            }}
          />
        </motion.div>
      )}

      {/* Subtle hover glow for unselected state */}
      {!isSelected && (
        <div
          className="absolute inset-0 rounded-2xl -z-10 opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle, ${mood.color}10 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.button>
  );
});
