'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MoodCapsuleProps {
  label: string;
  tone: 'calm' | 'stress' | 'hopeful' | 'neutral';
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const toneMap = {
  calm: 'bg-green-500/20 text-green-200',
  stress: 'bg-orange-500/20 text-orange-200',
  hopeful: 'bg-purple-500/20 text-purple-200',
  neutral: 'bg-white/10 text-white/80'
};

const selectedToneMap = {
  calm: 'bg-green-500/30 ring-2 ring-green-400/50 text-green-100',
  stress: 'bg-orange-500/30 ring-2 ring-orange-400/50 text-orange-100',
  hopeful: 'bg-purple-500/30 ring-2 ring-purple-400/50 text-purple-100',
  neutral: 'bg-white/20 ring-2 ring-white/40 text-white'
};

export default function MoodCapsule({ 
  label, 
  tone, 
  isSelected = false, 
  onClick,
  className 
}: MoodCapsuleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      className={cn(
        'px-5 py-3 rounded-full text-sm font-medium',
        'shadow-sm hover:shadow-md transition-all duration-300',
        'font-sans',
        isSelected ? selectedToneMap[tone] : toneMap[tone],
        className
      )}
    >
      {label}
    </motion.button>
  );
}
