'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
      layout
      layoutId={`mood-card-${mood.id}`}
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
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: index * 0.02
          }
        }
      }}
      whileHover={{
        scale: isSelected ? 1.02 : 1.08,
        y: -8,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 20 
        }
      }}
      whileTap={{
        scale: 0.95,
        transition: { 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }
      }}
      animate={{
        scale: isSelected ? 1.05 : 1,
        y: isSelected ? -5 : 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      }}
      className={`
        relative cursor-pointer p-3 sm:p-5 rounded-2xl sm:rounded-3xl backdrop-blur-md border-2 transform-gpu group
        ${isSelected
          ? `bg-gradient-to-br from-white/95 to-white/85 shadow-2xl z-20`
          : `bg-white/25 shadow-xl border-white/30 hover:bg-white/40 ${getCategoryStyle(mood.category)}`
        }
      `}
      onClick={onSelect}
      aria-label={`Select ${mood.name} mood`}
      aria-pressed={isSelected}
      style={{
        boxShadow: isSelected
          ? `0 25px 50px rgba(139, 92, 246, 0.4), 0 0 0 3px ${mood.color}80, 0 0 40px ${mood.glow}40`
          : '0 10px 30px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(255, 255, 255, 0.08)',
        borderColor: isSelected ? mood.color : undefined,
        transition: 'box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease'
      }}
    >
      {/* Enhanced selection indicator with AnimatePresence */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 25 
            }}
            className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center z-30 shadow-lg border-2 border-white"
          >
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="w-3.5 h-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path d="M5 12l5 5L20 7" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smooth floating animation for emoji */}
      <div className="text-center mb-2 sm:mb-3">
        <motion.div
          className="text-2xl sm:text-4xl mb-1 sm:mb-2 filter drop-shadow-lg"
          animate={{
            y: isSelected ? -2 : [0, -4, 0],
            scale: isSelected ? 1.1 : 1,
          }}
          transition={{
            y: isSelected 
              ? { type: "spring", stiffness: 300, damping: 20 }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          {mood.emoji}
        </motion.div>

        {/* Enhanced text with smooth color transition */}
        <motion.div 
          className={`text-xs sm:text-sm font-bold drop-shadow-lg leading-tight`}
          animate={{
            color: isSelected ? '#1f2937' : '#ffffff',
            scale: isSelected ? 1.05 : 1
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {mood.name}
        </motion.div>

        {/* Category indicator with AnimatePresence */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-xs text-gray-600 mt-1 font-medium capitalize hidden sm:block overflow-hidden"
            >
              {mood.category}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Smooth glow effect with AnimatePresence */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="absolute inset-0 rounded-3xl -z-10"
            style={{
              background: `radial-gradient(circle, ${mood.glow}50 0%, ${mood.color}30 40%, transparent 70%)`,
              filter: 'blur(25px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Subtle pulse ring on selection */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.6, 0],
              scale: [1, 1.3]
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 1.5
            }}
            className="absolute inset-0 rounded-3xl -z-10 pointer-events-none"
            style={{
              border: `2px solid ${mood.color}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Soft inner glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl -z-10 pointer-events-none"
        animate={{
          opacity: isSelected ? 0.5 : 0.15
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: `linear-gradient(135deg, ${mood.color}20, ${mood.glow}10)`,
        }}
      />

      {/* Category border accent */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/20 pointer-events-none" />
    </motion.div>
  );
}
