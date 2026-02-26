'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Droplets, Sparkles } from 'lucide-react';

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  moodName?: string;
  moodColor?: string;
  showLabels?: boolean;
  compact?: boolean;
  disabled?: boolean;
}

const intensityLabels = [
  { level: 1, label: 'Barely noticeable', icon: Droplets },
  { level: 2, label: 'Very mild', icon: Droplets },
  { level: 3, label: 'Mild', icon: Droplets },
  { level: 4, label: 'Moderate-low', icon: Sparkles },
  { level: 5, label: 'Moderate', icon: Sparkles },
  { level: 6, label: 'Moderate-high', icon: Sparkles },
  { level: 7, label: 'Strong', icon: Flame },
  { level: 8, label: 'Very strong', icon: Flame },
  { level: 9, label: 'Intense', icon: Flame },
  { level: 10, label: 'Overwhelming', icon: Flame },
];

export function IntensitySlider({
  value,
  onChange,
  moodName = 'Emotion',
  moodColor = '#8B5CF6',
  showLabels = true,
  compact = false,
  disabled = false,
}: IntensitySliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const currentIntensity = intensityLabels[localValue - 1] || intensityLabels[4];
  const IconComponent = currentIntensity.icon;
  
  // Calculate color opacity based on intensity
  const intensityOpacity = 0.3 + (localValue / 10) * 0.7;
  
  // Calculate glow intensity
  const glowIntensity = Math.min(40, localValue * 4);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-white/70 text-sm min-w-[24px]">{localValue}</span>
        <input
          type="range"
          min={1}
          max={10}
          value={localValue}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          disabled={disabled}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${moodColor}${Math.round(intensityOpacity * 255).toString(16).padStart(2, '0')} ${localValue * 10}%, rgba(255,255,255,0.2) ${localValue * 10}%)`,
          }}
        />
        <IconComponent 
          className="w-4 h-4" 
          style={{ color: moodColor, opacity: intensityOpacity }}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {moodName} Intensity
        </h3>
        <motion.div
          key={localValue}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ 
            backgroundColor: `${moodColor}30`,
            boxShadow: `0 0 ${glowIntensity}px ${moodColor}40`
          }}
        >
          <IconComponent 
            className="w-5 h-5" 
            style={{ color: moodColor }}
          />
          <span className="text-white font-bold text-lg">{localValue}</span>
        </motion.div>
      </div>

      {/* Visual Intensity Bar */}
      <div className="mb-6">
        <div className="relative h-12 rounded-xl overflow-hidden bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-xl"
            style={{
              background: `linear-gradient(90deg, ${moodColor}40, ${moodColor})`,
              boxShadow: `0 0 ${glowIntensity}px ${moodColor}60`,
            }}
            animate={{
              width: `${localValue * 10}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          
          {/* Level markers */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <motion.button
                key={level}
                onClick={() => !disabled && handleChange(level)}
                disabled={disabled}
                whileHover={{ scale: disabled ? 1 : 1.2 }}
                whileTap={{ scale: disabled ? 1 : 0.9 }}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  level <= localValue
                    ? 'bg-white text-gray-900'
                    : 'bg-white/20 text-white/60 hover:bg-white/30'
                } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-4">
        <input
          type="range"
          min={1}
          max={10}
          value={localValue}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${moodColor} ${localValue * 10}%, rgba(255,255,255,0.2) ${localValue * 10}%)`,
          }}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <AnimatePresence mode="wait">
          <motion.div
            key={localValue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <p className="text-white font-medium">{currentIntensity.label}</p>
            <p className="text-white/60 text-sm mt-1">
              {localValue <= 3 && "This emotion is present but not strongly affecting you."}
              {localValue > 3 && localValue <= 6 && "You're noticeably experiencing this emotion."}
              {localValue > 6 && localValue <= 8 && "This emotion is significantly impacting your state."}
              {localValue > 8 && "This emotion is dominating your current experience."}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Intensity scale reference */}
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-white/50">
        <span>Subtle</span>
        <span>Moderate</span>
        <span>Intense</span>
      </div>
    </div>
  );
}
