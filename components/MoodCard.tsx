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
    <div
      className={`
        relative cursor-pointer p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 transform-gpu
        ${isSelected 
          ? 'bg-white/90 shadow-2xl border-purple-300 transform scale-105'
          : 'bg-white/30 shadow-lg border-white/40 hover:bg-white/50'
        }
      `}
      onClick={onSelect}
      style={{
        boxShadow: isSelected
          ? `0 25px 50px rgba(139, 92, 246, 0.4), 0 0 0 3px ${mood.color}60, 0 0 20px ${mood.glow}40`
          : '0 10px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center z-10">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
      )}

      {/* Emoji section */}
      <div className="text-center mb-2">
        <div className="text-3xl mb-1 filter drop-shadow-sm">
          {mood.emoji}
        </div>
        <div className="text-sm font-medium text-gray-800 drop-shadow-sm">
          {mood.name}
        </div>
      </div>

      {/* Glow effect */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            background: `radial-gradient(circle, ${mood.glow}30 0%, ${mood.color}20 40%, transparent 70%)`,
            filter: 'blur(12px)'
          }}
        />
      )}

      {/* 3D depth indicator */}
      <div
        className="absolute inset-0 rounded-2xl -z-20 transform translate-x-1 translate-y-1"
        style={{
          background: `linear-gradient(135deg, ${mood.color}20, ${mood.glow}10)`,
          filter: 'blur(2px)'
        }}
      />
    </div>
  );
}
