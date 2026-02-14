'use client';

import { motion } from 'framer-motion';
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

export function MoodCard({ mood, index, isSelected, onSelect }: MoodCardProps) {
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
            delay: index * 0.05
          }
        }
      }}
      whileHover={{ 
        scale: 1.1,
        rotateY: 8,
        rotateX: 5,
        z: 20,
        y: -10,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      whileTap={{ 
        scale: 0.95,
        rotateX: -5,
        transition: { duration: 0.1 }
      }}
      className={`
        relative cursor-pointer p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 transform-gpu
        ${isSelected 
          ? 'bg-white/90 shadow-2xl border-purple-300 transform scale-105' 
          : 'bg-white/30 shadow-lg border-white/40 hover:bg-white/50'
        }
      `}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        boxShadow: isSelected 
          ? `0 25px 50px rgba(139, 92, 246, 0.4), 0 0 0 3px ${mood.color}60, 0 0 20px ${mood.glow}40` 
          : '0 10px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(255, 255, 255, 0.1)'
      }}
    >
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
          className="text-3xl mb-1 filter drop-shadow-sm"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {mood.emoji}
        </motion.div>
        <div className="text-sm font-medium text-gray-800 drop-shadow-sm">
          {mood.name}
        </div>
      </motion.div>

      {/* Glow effect */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            background: `radial-gradient(circle, ${mood.glow}30 0%, ${mood.color}20 40%, transparent 70%)`,
            filter: 'blur(12px)'
          }}
        />
      )}

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
        animate={{
          opacity: [0, 0.4, 0],
          background: [
            'linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)',
            'linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%)',
            'linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3
        }}
      />
      
      {/* 3D depth indicator */}
      <div 
        className="absolute inset-0 rounded-2xl -z-20 transform translate-x-1 translate-y-1"
        style={{
          background: `linear-gradient(135deg, ${mood.color}20, ${mood.glow}10)`,
          filter: 'blur(2px)'
        }}
      />
    </motion.div>
  );
}
