'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
  onKeyDown?: (event: React.KeyboardEvent) => void;
  selectionRole?: string;
  ariaLabel?: string;
}

export function MoodCard({ mood, index, isSelected, onSelect, onDelete, onKeyDown }: MoodCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';

  const cardBg = isSelected
    ? isDark
      ? 'rgba(35,35,52,0.92)'
      : 'rgba(255,255,255,0.95)'
    : isDark
      ? 'rgba(18,18,32,0.65)'
      : 'rgba(255,255,255,0.25)';

  const labelColor = isSelected ? (isDark ? '#f3f4f6' : '#1f2937') : '#ffffff';

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
        background: cardBg,
        borderColor: isSelected ? mood.color : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.3)',
        boxShadow: isSelected
          ? `0 20px 45px ${mood.color}50`
          : isDark
            ? '0 10px 28px rgba(0,0,0,0.45)'
            : '0 10px 30px rgba(0,0,0,0.12)',
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Mood: ${mood.name}`}
    >
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

      <motion.div
        className="text-sm sm:text-base font-semibold relative z-10"
        animate={{
          color: labelColor,
          scale: isSelected ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {mood.name}
      </motion.div>

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
