'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';
import './moodcard.css';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  isCustom?: boolean;
  category?: string;
  reflection?: {
    question: string;
    actions: {
      label: string;
      description: string;
      icon: string;
    }[];
  };
}

interface MoodCardProps {
  mood: Mood;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (moodId: string) => void;
  onKeyDown?: (event: any) => void;
}

export function MoodCard({ mood, index, isSelected, onSelect, onDelete, onKeyDown }: MoodCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 280,
        damping: 22,
      }}
      onKeyDown={onKeyDown}
      whileHover={{ scale: isSelected ? 1.05 : 1.08 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className="relative aspect-square w-full rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer overflow-hidden group backdrop-blur-md border-2"
      style={{
        background: isSelected
          ? 'hsl(var(--card) / 0.96)'
          : 'hsl(var(--card) / 0.58)',
        borderColor: isSelected ? mood.color : 'hsl(var(--border) / 0.8)',
        boxShadow: isSelected
          ? `0 20px 45px ${mood.color}50`
          : '0 10px 30px rgba(0,0,0,0.12)',
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Mood: ${mood.name}`}
    >
      {/* Delete Button */}
      {onDelete && mood.isCustom && (
        <motion.div
          className="absolute top-2 right-2 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          style={{
            background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(mood.id);
          }}
          tabIndex={-1}
          aria-label="Delete custom mood"
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </motion.div>
      )}

      {/* Emoji */}
      <motion.div
        className="text-4xl sm:text-5xl mb-3 relative z-10 select-none"
        animate={{
          y: isHovered ? -5 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{
          textShadow: `0 0 18px ${mood.glow}`,
        }}
      >
        {mood.emoji}
      </motion.div>

      {/* Mood Name */}
      <motion.div
        className="text-sm sm:text-base font-semibold relative z-10"
        animate={{
          color: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.92)',
          scale: isSelected ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {mood.name}
      </motion.div>

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${mood.color}, ${mood.glow}, transparent)`,
        }}
        animate={{
          width: isSelected ? '80%' : isHovered ? '60%' : '0%',
          opacity: isSelected || isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
