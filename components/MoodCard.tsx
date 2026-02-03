'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

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
      </div>

      {/* Glow effect - only when selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            background: `radial-gradient(circle, ${mood.glow}25 0%, ${mood.color}15 50%, transparent 70%)`,
            filter: 'blur(10px)'
          }}
        />
      )}

      {/* Subtle hover glow - using CSS instead of motion */}
      <div 
        className="absolute inset-0 rounded-2xl -z-10 opacity-0 hover:opacity-100 transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle, ${mood.color}15 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
});
