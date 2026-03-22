'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Heart, BarChart3, Music, ArrowLeft, Settings } from 'lucide-react';
import { MoodCard } from '@/components/MoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AddMoodModal } from '@/components/AddMoodModal';
import { MoodData } from '@/lib/moodData';
import { CustomMoodStorage, CustomMood } from '@/lib/customMoods';

type MoodOption = ReturnType<typeof MoodData.getAllMoods>[number];

const defaultMoods: MoodOption[] = MoodData.getAllMoods();

export default function EmotionsPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [moods, setMoods] = useState<MoodOption[]>(defaultMoods);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [backgroundOrbs, setBackgroundOrbs] = useState<Array<{
    id: number;
    color: string;
    width: number;
    height: number;
    left: string;
    top: string;
    x: number;
    y: number;
  }>>([]);
  const maxSelections = 3;

  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const orbs = Array.from({ length: 8 }, (_, index) => ({
      id: index,
      color: colors[index],
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setBackgroundOrbs(orbs);
  }, []);

  useEffect(() => {
    const loadAllMoods = () => {
      setMoods(MoodData.getAllMoods());
    };

    loadAllMoods();

    const handleCustomMoodsUpdate = () => {
      loadAllMoods();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('customMoodsUpdated', handleCustomMoodsUpdate);
      return () => {
        window.removeEventListener('customMoodsUpdated', handleCustomMoodsUpdate);
      };
    }
  }, []);

  const handleMoodAdded = (_newMood: CustomMood) => {
    setMoods(MoodData.getAllMoods());
    setIsAddModalOpen(false);
  };

  const handleMoodDeleted = (moodId: string) => {
    if (CustomMoodStorage.deleteCustomMood(moodId)) {
      setMoods(MoodData.getAllMoods());
      setSelectedMoods((prev) => prev.filter((id) => id !== moodId));
    }
  };

  const handleMoodToggle = (moodId: string) => {
    setSelectedMoods((prev) => {
      if (prev.includes(moodId)) {
        return prev.filter((id) => id !== moodId);
      }
      if (prev.length < maxSelections) {
        return [...prev, moodId];
      }
      return prev;
    });
  };

  const categoryLegend = [
    { name: 'Positive', color: '#66BB6A' },
    { name: 'Energetic', color: '#FF6D00' },
    { name: 'Calm', color: '#4FC3F7' },
    { name: 'Stressed', color: '#FF7043' },
    { name: 'Negative', color: '#7E57C2' },
    { name: 'Intense', color: '#EF5350' },
    { name: 'Playful', color: '#FF4081' },
    { name: 'Neutral', color: '#9C27B0' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))] text-foreground transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden">
        {backgroundOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full opacity-15 dark:opacity-10"
            style={{
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              width: orb.width,
              height: orb.height,
              left: orb.left,
              top: orb.top,
            }}
            animate={{
              x: [0, orb.x],
              y: [0, orb.y],
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.22, 0.08],
            }}
            transition={{
              duration: 8 + orb.id * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.id * 0.5,
            }}
          />
        ))}
      </div>

      <FloatingBackground />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-1.5 md:p-2 rounded-lg bg-card/70 dark:bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all border border-border/80 dark:border-white/20"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>

            <div className="flex items-center space-x-2">
              <Heart className="text-pink-400 w-6 h-6 md:w-8 md:h-8" />
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                InnerHue
              </h1>
            </div>
          </div>

          <nav className="flex items-center space-x-2 md:space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsAddModalOpen(true)}
              className="p-1.5 md:p-2 rounded-lg bg-card/70 dark:bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all border border-border/80 dark:border-white/20 flex items-center gap-2 text-foreground dark:text-white"
              title="Custom Moods"
            >
              <Plus className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm font-medium hidden sm:block">Custom Moods</span>
            </motion.button>
            <Link href="/analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-card/55 dark:bg-white/5 backdrop-blur-xl hover:bg-card/80 dark:hover:bg-white/10 transition-all duration-300 border border-border/70 dark:border-white/10"
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>
            <Link href="/music">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-card/55 dark:bg-white/5 backdrop-blur-xl hover:bg-card/80 dark:hover:bg-white/10 transition-all duration-300 border border-border/70 dark:border-white/10"
                title="Music"
              >
                <Music className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>
            <Link href="/personalization">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-card/55 dark:bg-white/5 backdrop-blur-xl hover:bg-card/80 dark:hover:bg-white/10 transition-all duration-300 border border-border/70 dark:border-white/10"
                title="Personalization"
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>
            <div className="scale-[1.15] md:scale-[1.3]">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </motion.header>

      <main id="main" className="relative z-10 px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-12 px-2 mt-4 md:mt-0"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground dark:text-white mb-4 sm:mb-6 drop-shadow-lg tracking-tight">
              How are you feeling today?
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground dark:text-gray-200 max-w-3xl mx-auto drop-shadow leading-relaxed px-4">
              Choose your emotional state and discover personalized insights, prompts, and music to guide your reflection journey.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-card/85 dark:bg-surface/90 text-foreground dark:text-white text-sm md:text-base font-medium rounded-full border border-border/80 dark:border-white/10 hover:bg-card dark:hover:bg-card transition-all duration-300 shadow-[0px_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.08)] flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Create Your Own Mood
            </motion.button>

            <div className="mt-3 sm:mt-4 text-muted-foreground dark:text-gray-300 text-xs sm:text-sm">
              Select up to {maxSelections} emotions • {moods.length} emotions available
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 sm:mb-12 text-center px-2"
          >
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 bg-card/70 dark:bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl border border-border/80 dark:border-white/20 max-w-full overflow-hidden">
              {categoryLegend.map((category) => (
                <div key={category.name} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-foreground dark:text-white">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 max-w-7xl mx-auto px-2 sm:px-0"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.02,
                  delayChildren: 0.1,
                  ease: [0.4, 0, 0.2, 1],
                },
              },
            }}
          >
            {moods.map((mood, index) => (
              <MoodCard
                key={mood.id}
                mood={mood}
                index={index}
                isSelected={selectedMoods.includes(mood.id)}
                onSelect={() => handleMoodToggle(mood.id)}
                onDelete={handleMoodDeleted}
              />
            ))}
          </motion.div>

          {selectedMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 sm:mt-12 text-center px-2"
            >
              <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-card/75 dark:bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl border border-border/80 dark:border-white/20 shadow-lg">
                <p className="text-foreground dark:text-white mb-3 sm:mb-4 text-base sm:text-lg font-medium">
                  Selected {selectedMoods.length} of {maxSelections} emotions
                  {selectedMoods.length >= maxSelections && (
                    <span className="block sm:inline text-sm sm:text-base mt-1 sm:mt-0 sm:ml-1">
                      (maximum reached)
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {selectedMoods.map((moodId) => {
                    const mood = moods.find((item) => item.id === moodId);
                    return mood ? (
                      <motion.span
                        key={moodId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-background/80 dark:bg-white/15 backdrop-blur rounded-full text-foreground dark:text-white text-sm sm:text-base font-medium flex items-center gap-1 sm:gap-2 border border-border/70 dark:border-white/20"
                      >
                        <span className="text-base sm:text-lg">{mood.emoji}</span>
                        <span className="hidden sm:inline">{mood.name}</span>
                        <span className="sm:hidden text-xs">{mood.name.length > 8 ? `${mood.name.slice(0, 8)}...` : mood.name}</span>
                      </motion.span>
                    ) : null;
                  })}
                </div>

                <Link href={`/mood/${selectedMoods[0]}?moods=${selectedMoods.join(',')}`}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.35)' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Explore Your Emotions ({selectedMoods.length})</span>
                    <span className="sm:hidden">Continue ({selectedMoods.length})</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <AddMoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMoodAdded={handleMoodAdded}
      />
    </div>
  );
}
