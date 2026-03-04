"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';
import './moodcard.css';
import { useState } from "react";
import { Check } from "lucide-react";

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
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
}

export function MoodCard({
  mood,
  index,
  isSelected,
  onSelect,
}: MoodCardProps) {
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
      whileHover={{ scale: isSelected ? 1.05 : 1.08 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className="relative aspect-square w-full rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer overflow-hidden group backdrop-blur-md border-2"
      style={{
        background: isSelected
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(255,255,255,0.25)',
        borderColor: isSelected ? mood.color : 'rgba(255,255,255,0.3)',
        boxShadow: isSelected
          ? `0 20px 45px ${mood.color}50`
          : '0 10px 30px rgba(0,0,0,0.12)',
      }}
    >
      {/* Animated Glow Background */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={
          isHovered
            ? { opacity: [0.2, 0.5, 0.2] }
            : { opacity: 0 }
        }
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: `radial-gradient(circle, ${mood.glow}40 0%, transparent 70%)`,
        }}
      />

      {/* Selection Badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg z-20"
            style={{
              background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`,
            }}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </motion.div>
        )}
      </AnimatePresence>

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
          color: isSelected ? '#1f2937' : '#ffffff',
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
