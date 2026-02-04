"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { memo } from 'react';
'use client';

import { motion } from 'framer-motion';
import './moodcard.css';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  category: string;
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
export function MoodCard({ mood, index, isSelected, onSelect }: MoodCardProps) {
  const getCategoryStyle = (category: string) => {
    const styles = {
      positive: 'border-emerald-300/50 hover:border-emerald-300 hover:bg-emerald-50/20',
      energetic: 'border-orange-300/50 hover:border-orange-300 hover:bg-orange-50/20',
      calm: 'border-blue-300/50 hover:border-blue-300 hover:bg-blue-50/20',
      stress: 'border-red-300/50 hover:border-red-300 hover:bg-red-50/20',
      negative: 'border-purple-300/50 hover:border-purple-300 hover:bg-purple-50/20',
      intense: 'border-red-400/50 hover:border-red-400 hover:bg-red-50/20',
      playful: 'border-pink-300/50 hover:border-pink-300 hover:bg-pink-50/20',
      neutral: 'border-gray-300/50 hover:border-gray-300 hover:bg-gray-50/20'
    };
    return styles[category as keyof typeof styles] || styles.neutral;
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: 50,
          rotateX: -25,
          rotateY: -10,
          scale: 0.8
        },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 120,
            damping: 12,
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
      whileHover={{ 
        scale: 1.12,
        rotateY: 8,
        rotateX: 5,
        z: 30,
        y: -10,
        transition: { duration: 0.4, type: "spring", stiffness: 350 }
      }}
      whileTap={{ 
        scale: 0.92,
        rotateX: -8,
        transition: { duration: 0.15 }
      }}
      className={`
        relative cursor-pointer p-3 sm:p-5 rounded-2xl sm:rounded-3xl backdrop-blur-md border-2 transition-all duration-500 transform-gpu group
        ${isSelected 
          ? `bg-gradient-to-br from-white/95 to-white/85 shadow-2xl border-2 transform scale-105 sm:scale-110 z-20` 
          : `bg-white/25 shadow-xl border-white/30 hover:bg-white/40 ${getCategoryStyle(mood.category)}`
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
        boxShadow: isSelected 
          ? `0 30px 60px rgba(139, 92, 246, 0.5), 0 0 0 4px ${mood.color}70, 0 0 30px ${mood.glow}50, inset 0 1px 0 rgba(255,255,255,0.8)` 
          : '0 15px 35px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
      }}
    >
      {/* Enhanced selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center z-30 shadow-lg border-2 border-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-3 h-3 bg-white rounded-full"
          />
          {/* Alternative Check Icon if preferred */}
          {/* <Check className="w-3 h-3 text-white strok-[3]" /> */}
        </motion.div>
      )}

      {/* Floating animation for emoji */}
      {/* Enhanced floating animation for emoji */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{
          duration: 5 + Math.random() * 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15
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

        <div className={`text-sm font-medium transition-colors drop-shadow-sm ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
        className="text-center mb-2 sm:mb-3"
      >
        <motion.div 
          className="text-2xl sm:text-4xl mb-1 sm:mb-2 filter drop-shadow-lg"
          whileHover={{ scale: 1.2, rotate: 15, y: -3 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {mood.emoji}
        </motion.div>
        
        {/* Enhanced text with better hierarchy */}
        <div className={`text-xs sm:text-sm font-bold transition-all duration-300 ${
          isSelected 
            ? 'text-gray-800 text-sm sm:text-base' 
            : 'text-white group-hover:text-gray-100'
        } drop-shadow-lg leading-tight`}>
          {mood.name}
        </div>
        
        {/* Category indicator - hidden on small screens when not selected */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-gray-600 mt-1 font-medium capitalize hidden sm:block"
          >
            {mood.category}
          </motion.div>
        )}
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
      {/* Enhanced glow effect */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-3xl -z-10"
          style={{
            background: `radial-gradient(circle, ${mood.glow}40 0%, ${mood.color}25 30%, transparent 70%)`,
            filter: 'blur(20px)'
          }}
        />
      )}

      {/* Enhanced shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none overflow-hidden"
        animate={{
          opacity: [0, 0.5, 0],
          x: [-100, 100]
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2
        }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          width: '50%'
        }}
      />
      
      {/* Enhanced 3D depth indicator */}
      <motion.div 
        className="absolute inset-0 rounded-3xl -z-20"
        style={{
          background: `linear-gradient(145deg, ${mood.color}15, ${mood.glow}8)`,
          filter: 'blur(3px)',
          transform: 'translate(2px, 2px)'
        }}
        animate={{
          opacity: isSelected ? 0.8 : 0.3
        }}
      />
      
      {/* Category border accent */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />
    </motion.div>
  );
}


