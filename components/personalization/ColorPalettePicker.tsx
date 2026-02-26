'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';
import { colorPaletteOptions, CustomColorPalette } from '@/lib/personalizationTypes';

interface ColorPalettePickerProps {
  moodId: string;
  moodName: string;
  currentPalette?: CustomColorPalette;
  originalColor: string;
  originalGlow: string;
  onSelectPalette: (palette: CustomColorPalette) => void;
  onReset: () => void;
}

export function ColorPalettePicker({
  moodId,
  moodName,
  currentPalette,
  originalColor,
  originalGlow,
  onSelectPalette,
  onReset,
}: ColorPalettePickerProps) {
  const effectiveColor = currentPalette?.primaryColor || originalColor;
  const effectiveGlow = currentPalette?.glowColor || originalGlow;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Color Palette for {moodName}
        </h3>
        {currentPalette && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        )}
      </div>

      {/* Current Preview */}
      <div className="mb-6">
        <p className="text-sm text-white/70 mb-3">Current Preview</p>
        <div
          className="w-full h-16 rounded-xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${effectiveColor}, ${effectiveGlow})`,
            boxShadow: `0 10px 40px ${effectiveColor}50`,
          }}
        >
          <span className="text-white font-medium text-lg drop-shadow-lg">{moodName}</span>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${effectiveGlow}80, transparent 60%)`,
            }}
          />
        </div>
      </div>

      {/* Color Options Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {/* Original Option */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onReset}
          className={`relative aspect-square rounded-xl p-1 transition-all ${
            !currentPalette
              ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
              : 'hover:ring-1 hover:ring-white/50'
          }`}
          style={{
            background: `linear-gradient(135deg, ${originalColor}, ${originalGlow})`,
          }}
          title="Original"
        >
          {!currentPalette && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          )}
          <span className="sr-only">Original color</span>
        </motion.button>

        {/* Predefined Palette Options */}
        {colorPaletteOptions.map((option) => {
          const isSelected =
            currentPalette?.primaryColor === option.primary &&
            currentPalette?.glowColor === option.glow;

          return (
            <motion.button
              key={option.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                onSelectPalette({
                  moodId,
                  primaryColor: option.primary,
                  glowColor: option.glow,
                })
              }
              className={`relative aspect-square rounded-xl p-1 transition-all ${
                isSelected
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
                  : 'hover:ring-1 hover:ring-white/50'
              }`}
              style={{
                background: `linear-gradient(135deg, ${option.primary}, ${option.glow})`,
              }}
              title={option.name}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}
              <span className="sr-only">{option.name} color palette</span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Color Input */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-sm text-white/70 mb-3">Or choose custom colors</p>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-white/60 mb-1">Primary</label>
            <div className="relative">
              <input
                type="color"
                value={effectiveColor}
                onChange={(e) =>
                  onSelectPalette({
                    moodId,
                    primaryColor: e.target.value,
                    glowColor: effectiveGlow,
                  })
                }
                className="w-full h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-white/60 mb-1">Glow</label>
            <div className="relative">
              <input
                type="color"
                value={effectiveGlow}
                onChange={(e) =>
                  onSelectPalette({
                    moodId,
                    primaryColor: effectiveColor,
                    glowColor: e.target.value,
                  })
                }
                className="w-full h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
