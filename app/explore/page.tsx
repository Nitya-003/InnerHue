'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoodCard } from '@/components/MoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { Heart, BarChart3, Music, ArrowLeft, Search, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const moods = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D', glow: '#FFF176', category: 'positive' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5', glow: '#64B5F6', category: 'negative' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043', glow: '#FF8A65', category: 'stress' },
  { id: 'excited', name: 'Excited', emoji: '🤩', color: '#AB47BC', glow: '#BA68C8', category: 'energetic' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A', glow: '#81C784', category: 'calm' },
  { id: 'angry', name: 'Angry', emoji: '😡', color: '#EF5350', glow: '#E57373', category: 'intense' },
  { id: 'confused', name: 'Confused', emoji: '😕', color: '#FFA726', glow: '#FFB74D', category: 'stress' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: '#26A69A', glow: '#4DB6AC', category: 'positive' },
  { id: 'lonely', name: 'Lonely', emoji: '😔', color: '#7E57C2', glow: '#9575CD', category: 'negative' },
  { id: 'hopeful', name: 'Hopeful', emoji: '🌟', color: '#FFCA28', glow: '#FFD54F', category: 'positive' },
  { id: 'stressed', name: 'Stressed', emoji: '😤', color: '#FF5722', glow: '#FF6F00', category: 'stress' },
  { id: 'peaceful', name: 'Peaceful', emoji: '🕊️', color: '#4FC3F7', glow: '#81D4FA', category: 'calm' },
  { id: 'energized', name: 'Energized', emoji: '⚡', color: '#FFEB3B', glow: '#FFF176', category: 'energetic' },
  { id: 'overwhelmed', name: 'Overwhelmed', emoji: '🤯', color: '#F06292', glow: '#F48FB1', category: 'stress' },
  { id: 'content', name: 'Content', emoji: '😊', color: '#AED581', glow: '#C5E1A5', category: 'positive' },
  { id: 'frustrated', name: 'Frustrated', emoji: '😠', color: '#FF8A65', glow: '#FFAB91', category: 'intense' },
  { id: 'inspired', name: 'Inspired', emoji: '💡', color: '#FFD740', glow: '#FFE082', category: 'positive' },
  { id: 'melancholy', name: 'Melancholy', emoji: '🌧️', color: '#90A4AE', glow: '#B0BEC5', category: 'negative' },
  { id: 'motivated', name: 'Motivated', emoji: '🔥', color: '#FF6D00', glow: '#FF8F00', category: 'energetic' },
  { id: 'vulnerable', name: 'Vulnerable', emoji: '🥺', color: '#F8BBD9', glow: '#FCE4EC', category: 'negative' },
  { id: 'empowered', name: 'Empowered', emoji: '💪', color: '#6A1B9A', glow: '#8E24AA', category: 'energetic' },
  { id: 'nostalgic', name: 'Nostalgic', emoji: '📸', color: '#D4A574', glow: '#DDBF94', category: 'calm' },
  { id: 'jealous', name: 'Jealous', emoji: '😒', color: '#8BC34A', glow: '#9CCC65', category: 'negative' },
  { id: 'proud', name: 'Proud', emoji: '😤', color: '#FF9800', glow: '#FFB74D', category: 'energetic' },
  { id: 'curious', name: 'Curious', emoji: '🤔', color: '#9C27B0', glow: '#BA68C8', category: 'positive' },
  { id: 'bored', name: 'Bored', emoji: '😑', color: '#607D8B', glow: '#78909C', category: 'neutral' },
  { id: 'surprised', name: 'Surprised', emoji: '😲', color: '#FF5722', glow: '#FF7043', category: 'energetic' },
  { id: 'disgusted', name: 'Disgusted', emoji: '🤢', color: '#4CAF50', glow: '#66BB6A', category: 'negative' },
  { id: 'embarrassed', name: 'Embarrassed', emoji: '😳', color: '#E91E63', glow: '#F06292', category: 'negative' },
  { id: 'determined', name: 'Determined', emoji: '😤', color: '#3F51B5', glow: '#5C6BC0', category: 'energetic' },
  { id: 'playful', name: 'Playful', emoji: '😜', color: '#FF4081', glow: '#FF80AB', category: 'playful' },
  { id: 'dreamy', name: 'Dreamy', emoji: '😴', color: '#9FA8DA', glow: '#C5CAE9', category: 'calm' },
  { id: 'adventurous', name: 'Adventurous', emoji: '🗺️', color: '#FF6F00', glow: '#FF8F00', category: 'energetic' },
  { id: 'romantic', name: 'Romantic', emoji: '💕', color: '#E1BEE7', glow: '#F3E5F5', category: 'positive' },
  { id: 'creative', name: 'Creative', emoji: '🎨', color: '#FF7043', glow: '#FFAB91', category: 'positive' },
  { id: 'philosophical', name: 'Philosophical', emoji: '🤯', color: '#5E35B1', glow: '#7E57C2', category: 'calm' },
  { id: 'rebellious', name: 'Rebellious', emoji: '😈', color: '#D32F2F', glow: '#F44336', category: 'intense' },
  { id: 'silly', name: 'Silly', emoji: '🤪', color: '#FFC107', glow: '#FFD54F', category: 'playful' }
];

export default function ExplorePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['all', 'positive', 'stress', 'calm', 'energetic', 'intense', 'negative', 'playful'];

  const filteredMoods = useMemo(() => {
    return moods.filter(mood => {
      const matchesSearch = mood.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || mood.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // Enhanced page entrance animation
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#0f0720] relative overflow-hidden"
    >
      <FloatingBackground />

      {/* Header with enhanced entrance */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: "easeOut"
        }}
        className="relative z-10 p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-xl shadow-sm hover:shadow-md transition-all border border-white/20"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.div>
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="text-pink-400 w-8 h-8" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                InnerHue
              </h1>
            </div>
          </div>

          <nav className="flex space-x-4">
            <Link href="/analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-xl shadow-sm hover:shadow-md transition-all border border-white/20"
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
            </Link>
            <Link href="/music">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-xl shadow-sm hover:shadow-md transition-all border border-white/20"
              >
                <Music className="w-6 h-6 text-white" />
              </motion.div>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main id="main" className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with staggered entrance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="text-center mb-12"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            >
              How are you feeling today?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow"
            >
              Choose your emotional state and discover personalized insights, prompts, and music to guide your reflection journey.
            </motion.p>

            {/* Search and Filters */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mt-10 flex flex-col items-center space-y-6"
              >
                {/* Search Bar */}
                <div className="relative w-full max-w-md group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-pink-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search moods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all font-medium"
                    suppressHydrationWarning
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                      suppressHydrationWarning
                    >
                      <X className="w-4 h-4 text-white/50" />
                    </button>
                  )}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 px-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      suppressHydrationWarning
                      className={`
                        px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300
                        ${activeCategory === category
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg ring-2 ring-pink-500/30"
                          : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/10 hover:border-white/20"
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Mood Cards Grid with wave entrance effect */}
          {mounted && (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-w-7xl mx-auto min-h-[400px]"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.03
                  }
                }
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredMoods.length > 0 ? (
                  filteredMoods.map((mood, index) => (
                    <MoodCard
                      key={mood.id}
                      mood={mood}
                      index={index}
                      isSelected={selectedMood === mood.id}
                      onSelect={() => setSelectedMood(mood.id)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="col-span-full py-20 flex flex-col items-center text-center space-y-4"
                  >
                    <div className="p-6 rounded-full bg-white/5 border border-white/10">
                      <Search className="w-12 h-12 text-white/20" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">No moods found</h3>
                      <p className="text-gray-400">Try adjusting your search or category filters.</p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setActiveCategory('all');
                      }}
                      className="text-pink-400 font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Continue Button */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <Link href={`/mood/${selectedMood}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Your Mood
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
