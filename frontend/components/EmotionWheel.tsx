'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Check, X } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
}

interface EmotionWheelProps {
  moods: Mood[];
  selectedMoods: string[];
  onSelect: (moodId: string) => void;
  maxSelections?: number;
}

// 6 Core categories mapping to traditional mood IDs
const CATEGORY_MAP: Record<string, string[]> = {
  happy: [
    'happy', 'excited', 'grateful', 'hopeful', 'energized', 'content',
    'inspired', 'motivated', 'empowered', 'proud', 'playful', 'silly',
    'adventurous', 'romantic', 'creative'
  ],
  sad: [
    'sad', 'lonely', 'melancholy', 'vulnerable', 'nostalgic'
  ],
  calm: [
    'calm', 'peaceful', 'dreamy'
  ],
  angry: [
    'angry', 'frustrated', 'jealous', 'rebellious'
  ],
  anxious: [
    'anxious', 'stressed', 'overwhelmed', 'embarrassed', 'determined'
  ],
  confused: [
    'confused', 'curious', 'bored', 'surprised', 'disgusted', 'philosophical'
  ]
};

// Core category configurations (using values matching the core moods)
const CORE_CATEGORIES = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D', glow: '#FFF176' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5', glow: '#64B5F6' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A', glow: '#81C784' },
  { id: 'angry', name: 'Angry', emoji: '😡', color: '#EF5350', glow: '#E57373' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043', glow: '#FF8A65' },
  { id: 'confused', name: 'Confused', emoji: '😕', color: '#FFA726', glow: '#FFB74D' }
];

const outerVariants = {
  hidden: { opacity: 0, scale: 0.5, x: 0, y: 0 },
  visible: (custom: { idx: number; count: number; outerRadius: number }) => {
    const angle = (custom.idx * 360) / custom.count - 90;
    const radian = (angle * Math.PI) / 180;
    const x = Math.round(custom.outerRadius * Math.cos(radian));
    const y = Math.round(custom.outerRadius * Math.sin(radian));
    return {
      opacity: 1,
      scale: 1,
      x,
      y,
      transition: {
        delay: custom.idx * 0.025,
        type: 'spring',
        stiffness: 240,
        damping: 18
      }
    };
  }
};

export function EmotionWheel({ moods, selectedMoods, onSelect, maxSelections = 3 }: EmotionWheelProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [activeCategory, setActiveCategory] = useState<string>('happy');
  const [hoveredEmotion, setHoveredEmotion] = useState<Mood | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  // Responsive radii configurations
  const radii = useMemo(() => {
    return isMobile
      ? { center: 45, inner: 80, outer: 135, container: 340 }
      : { center: 60, inner: 110, outer: 190, container: 480 };
  }, [isMobile]);

  // Sub-emotions matching active category
  const activeSubEmotions = useMemo(() => {
    const ids = CATEGORY_MAP[activeCategory] || [];
    return moods.filter((m) => ids.includes(m.id));
  }, [activeCategory, moods]);

  // Find parent category for a mood ID
  const getParentCategory = (moodId: string): string => {
    for (const [catId, subIds] of Object.entries(CATEGORY_MAP)) {
      if (subIds.includes(moodId)) return catId;
    }
    return 'happy';
  };

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return moods.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, moods]);

  // Handle search suggestion selection
  const handleSelectSuggestion = (mood: Mood) => {
    onSelect(mood.id);
    const parentCat = getParentCategory(mood.id);
    setActiveCategory(parentCat);
    setSearchQuery('');
    setShowSuggestions(false);
    
    // Focus the selected button visually if possible
    setTimeout(() => {
      const btn = containerRef.current?.querySelector(`[data-id="${mood.id}"]`) as HTMLButtonElement;
      btn?.focus();
    }, 100);
  };

  // Determine what is displayed in the center
  const centerDisplay = useMemo(() => {
    if (hoveredEmotion) {
      return {
        emoji: hoveredEmotion.emoji,
        name: hoveredEmotion.name,
        color: hoveredEmotion.color,
        glow: hoveredEmotion.glow,
        isSelected: selectedMoods.includes(hoveredEmotion.id)
      };
    }
    
    // Default to the first selected mood, or current active category
    if (selectedMoods.length > 0) {
      const firstSelected = moods.find((m) => m.id === selectedMoods[selectedMoods.length - 1]);
      if (firstSelected) {
        return {
          emoji: firstSelected.emoji,
          name: firstSelected.name,
          color: firstSelected.color,
          glow: firstSelected.glow,
          isSelected: true
        };
      }
    }

    const currentCat = CORE_CATEGORIES.find((c) => c.id === activeCategory);
    return {
      emoji: currentCat?.emoji || '😊',
      name: currentCat?.name || 'Explore',
      color: currentCat?.color || '#FFD93D',
      glow: currentCat?.glow || '#FFF176',
      isSelected: false
    };
  }, [hoveredEmotion, selectedMoods, activeCategory, moods]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, type: 'category' | 'emotion', index: number) => {
    const numCategories = CORE_CATEGORIES.length;
    const numEmotions = activeSubEmotions.length;

    let targetElement: HTMLButtonElement | null = null;

    if (type === 'category') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (index + 1) % numCategories;
        setActiveCategory(CORE_CATEGORIES[nextIdx].id);
        targetElement = containerRef.current?.querySelector(`[data-type="category"][data-index="${nextIdx}"]`) as HTMLButtonElement;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (index - 1 + numCategories) % numCategories;
        setActiveCategory(CORE_CATEGORIES[prevIdx].id);
        targetElement = containerRef.current?.querySelector(`[data-type="category"][data-index="${prevIdx}"]`) as HTMLButtonElement;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Go to first outer emotion
        targetElement = containerRef.current?.querySelector(`[data-type="emotion"][data-index="0"]`) as HTMLButtonElement;
      }
    } else if (type === 'emotion') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (index + 1) % numEmotions;
        targetElement = containerRef.current?.querySelector(`[data-type="emotion"][data-index="${nextIdx}"]`) as HTMLButtonElement;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (index - 1 + numEmotions) % numEmotions;
        targetElement = containerRef.current?.querySelector(`[data-type="emotion"][data-index="${prevIdx}"]`) as HTMLButtonElement;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Go back to the parent category
        const catIdx = CORE_CATEGORIES.findIndex((c) => c.id === activeCategory);
        targetElement = containerRef.current?.querySelector(`[data-type="category"][data-index="${catIdx}"]`) as HTMLButtonElement;
      }
    }

    if (targetElement) {
      targetElement.focus();
      // If we focused an emotion, trigger hover state simulation for screen updates
      if (type === 'emotion') {
        const id = targetElement.getAttribute('data-id');
        const m = moods.find((item) => item.id === id);
        if (m) setHoveredEmotion(m);
      }
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl bg-card/45 dark:bg-card/25 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-2xl p-6 md:p-8 flex flex-col items-center">
      {/* Search Header */}
      <div className="relative w-full max-w-md mb-8 z-30">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emotions (e.g. Grateful, Lonely...)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-11 pr-10 py-2.5 rounded-full border bg-background/50 border-border/80 focus:border-primary/50 outline-none text-foreground text-sm font-medium transition-all"
            aria-label="Search emotions by name"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
              aria-label="Clear search query"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dropdown Suggestions */}
        <AnimatePresence>
          {showSuggestions && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-popover/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
            >
              {searchResults.map((mood) => {
                const isSelected = selectedMoods.includes(mood.id);
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleSelectSuggestion(mood)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 text-left text-sm text-foreground transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none select-none">{mood.emoji}</span>
                      <span className="font-medium">{mood.name}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: mood.color }}
                      />
                    </div>
                    {isSelected && (
                      <Check
                        className="w-4 h-4 text-white stroke-[3] rounded-full p-0.5"
                        style={{ backgroundColor: mood.color }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Radial Wheel Canvas */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center select-none"
        style={{
          width: radii.container,
          height: radii.container
        }}
      >
        {/* Dynamic Glow Glow Background */}
        <div
          className="absolute inset-0 rounded-full blur-[80px] opacity-15 dark:opacity-20 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${centerDisplay.color} 0%, transparent 70%)`
          }}
        />

        {/* Center Display Circle */}
        <motion.div
          layout
          className="absolute z-20 flex flex-col items-center justify-center text-center rounded-full border shadow-xl backdrop-blur-2xl transition-all duration-300"
          style={{
            width: radii.center * 2,
            height: radii.center * 2,
            background: isDark ? 'rgba(15,15,25,0.7)' : 'rgba(255,255,255,0.8)',
            borderColor: centerDisplay.isSelected ? centerDisplay.color : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            boxShadow: centerDisplay.isSelected
              ? `0 0 25px ${centerDisplay.color}45, inset 0 0 12px ${centerDisplay.color}15`
              : `0 10px 30px rgba(0,0,0,${isDark ? 0.35 : 0.08})`
          }}
        >
          <motion.span
            key={centerDisplay.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl md:text-4xl mb-1 select-none filter drop-shadow-sm"
          >
            {centerDisplay.emoji}
          </motion.span>
          <motion.span
            key={`${centerDisplay.name}-label`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xs md:text-sm font-semibold tracking-tight px-2 break-words max-w-[90%]"
            style={{ color: isDark ? '#f3f4f6' : '#1f2937' }}
          >
            {centerDisplay.name}
          </motion.span>
        </motion.div>

        {/* Inner Ring (6 Core categories) */}
        {CORE_CATEGORIES.map((cat, idx) => {
          // Position Math: Start at -90 degrees (top)
          const angle = (idx * 360) / 6 - 90;
          const radian = (angle * Math.PI) / 180;
          const x = Math.round(radii.inner * Math.cos(radian));
          const y = Math.round(radii.inner * Math.sin(radian));

          const isActive = activeCategory === cat.id;
          const isSelected = selectedMoods.includes(cat.id);
          const size = isMobile ? 48 : 58;

          return (
            <motion.button
              key={cat.id}
              data-type="category"
              data-index={idx}
              data-id={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                // Also trigger selection if clicked again
                if (isActive) {
                  onSelect(cat.id);
                }
              }}
              onFocus={() => {
                setActiveCategory(cat.id);
                const m = moods.find((item) => item.id === cat.id);
                if (m) setHoveredEmotion(m);
              }}
              onBlur={() => setHoveredEmotion(null)}
              onMouseEnter={() => {
                const m = moods.find((item) => item.id === cat.id);
                if (m) setHoveredEmotion(m);
              }}
              onMouseLeave={() => setHoveredEmotion(null)}
              onKeyDown={(e) => handleKeyDown(e, 'category', idx)}
              className="absolute z-10 flex items-center justify-center rounded-full border backdrop-blur-md cursor-pointer transition-all focus:outline-none"
              style={{
                left: '50%',
                top: '50%',
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                x,
                y,
                borderColor: isActive || isSelected ? cat.color : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                backgroundColor: isActive
                  ? `${cat.color}25`
                  : isDark
                    ? 'rgba(30,30,45,0.6)'
                    : 'rgba(255,255,255,0.45)',
                boxShadow: isActive
                  ? `0 0 20px ${cat.color}35`
                  : isSelected
                    ? `0 0 15px ${cat.color}25`
                    : 'none'
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Category: ${cat.name}. ${isActive ? 'Currently active' : 'Click to see sub-emotions'}`}
              aria-pressed={isSelected}
            >
              <span className="text-xl md:text-2xl filter drop-shadow-sm select-none leading-none">
                {cat.emoji}
              </span>
              {isSelected && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-white dark:border-slate-800 shadow"
                  style={{ backgroundColor: cat.color }}
                >
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}

        {/* Outer Ring (Sub-emotions of active category) */}
        <AnimatePresence mode="popLayout">
          {activeSubEmotions.map((emotion, idx) => {
            const count = activeSubEmotions.length;
            const size = isMobile ? 38 : 46;

            const isSelected = selectedMoods.includes(emotion.id);

            return (
              <motion.button
                key={`${activeCategory}-${emotion.id}`}
                data-type="emotion"
                data-index={idx}
                data-id={emotion.id}
                custom={{ idx, count, outerRadius: radii.outer }}
                variants={outerVariants}
                initial="hidden"
                animate="visible"
                exit={{
                  opacity: 0,
                  scale: 0.4,
                  x: 0,
                  y: 0,
                  transition: { duration: 0.15 }
                }}
                onClick={() => onSelect(emotion.id)}
                onFocus={() => setHoveredEmotion(emotion)}
                onBlur={() => setHoveredEmotion(null)}
                onMouseEnter={() => setHoveredEmotion(emotion)}
                onMouseLeave={() => setHoveredEmotion(null)}
                onKeyDown={(e) => handleKeyDown(e, 'emotion', idx)}
                className="absolute z-0 flex items-center justify-center rounded-full border backdrop-blur-md cursor-pointer transition-all focus:outline-none"
                style={{
                  left: '50%',
                  top: '50%',
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  borderColor: isSelected ? emotion.color : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  backgroundColor: isSelected
                    ? `${emotion.color}25`
                    : isDark
                      ? 'rgba(18,18,32,0.45)'
                      : 'rgba(255,255,255,0.25)',
                  boxShadow: isSelected
                    ? `0 0 15px ${emotion.color}30`
                    : 'none'
                }}
                whileHover={{
                  scale: 1.15,
                  borderColor: emotion.color,
                  boxShadow: `0 0 15px ${emotion.color}30`
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Emotion: ${emotion.name}`}
                aria-pressed={isSelected}
              >
                <span className="text-lg md:text-xl filter drop-shadow-sm select-none leading-none">
                  {emotion.emoji}
                </span>
                {isSelected && (
                  <div
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white font-bold border border-white dark:border-slate-800 shadow"
                    style={{ backgroundColor: emotion.color }}
                  >
                    ✓
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selection Summary */}
      <div className="mt-6 text-center text-xs md:text-sm text-muted-foreground flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <Compass className="w-4 h-4 text-primary" />
          <span>Hover emojis to explore. Click to select up to {maxSelections} emotions.</span>
        </div>
        
        {/* Selected List */}
        {selectedMoods.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2 z-10">
            {selectedMoods.map((id) => {
              const item = moods.find((m) => m.id === id);
              if (!item) return null;
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer hover:opacity-85"
                  style={{
                    backgroundColor: `${item.color}15`,
                    borderColor: item.color,
                    color: isDark ? '#ffffff' : '#374151'
                  }}
                  aria-label={`Selected: ${item.name}. Click to remove`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                  <span className="ml-1 text-[10px] opacity-60">✕</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
