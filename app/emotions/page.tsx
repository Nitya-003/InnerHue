'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoodCard } from '@/components/MoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { AddMoodModal } from '@/components/AddMoodModal';
import { Heart, BarChart3, Music, ArrowLeft, Plus } from 'lucide-react';
import { MoodData } from '@/lib/moodData';
import { CustomMood, CustomMoodStorage } from '@/lib/customMoods';
import { ThemeToggle } from '@/components/ThemeToggle';

// Enhanced mood data with categories for better color coding - now loaded dynamically
const defaultMoods = [
  // Positive/Happy Category
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D', glow: '#FFF176', category: 'positive' },
  { id: 'excited', name: 'Excited', emoji: '🤩', color: '#AB47BC', glow: '#BA68C8', category: 'energetic' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: '#26A69A', glow: '#4DB6AC', category: 'positive' },
  { id: 'hopeful', name: 'Hopeful', emoji: '🌟', color: '#FFCA28', glow: '#FFD54F', category: 'positive' },
  { id: 'content', name: 'Content', emoji: '😊', color: '#AED581', glow: '#C5E1A5', category: 'calm' },
  { id: 'inspired', name: 'Inspired', emoji: '💡', color: '#FFD740', glow: '#FFE082', category: 'energetic' },
  { id: 'motivated', name: 'Motivated', emoji: '🔥', color: '#FF6D00', glow: '#FF8F00', category: 'energetic' },
  { id: 'empowered', name: 'Empowered', emoji: '💪', color: '#6A1B9A', glow: '#8E24AA', category: 'positive' },
  { id: 'proud', name: 'Proud', emoji: '😤', color: '#FF9800', glow: '#FFB74D', category: 'positive' },
  { id: 'determined', name: 'Determined', emoji: '😤', color: '#3F51B5', glow: '#5C6BC0', category: 'energetic' },
  { id: 'energized', name: 'Energized', emoji: '⚡', color: '#FFEB3B', glow: '#FFF176', category: 'energetic' },
  { id: 'adventurous', name: 'Adventurous', emoji: '🗺️', color: '#FF6F00', glow: '#FF8F00', category: 'energetic' },

  // Calm/Peaceful Category
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A', glow: '#81C784', category: 'calm' },
  { id: 'peaceful', name: 'Peaceful', emoji: '🕊️', color: '#4FC3F7', glow: '#81D4FA', category: 'calm' },
  { id: 'dreamy', name: 'Dreamy', emoji: '😴', color: '#9FA8DA', glow: '#C5CAE9', category: 'calm' },

  // Negative/Sad Category
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5', glow: '#64B5F6', category: 'negative' },
  { id: 'lonely', name: 'Lonely', emoji: '😔', color: '#7E57C2', glow: '#9575CD', category: 'negative' },
  { id: 'melancholy', name: 'Melancholy', emoji: '🌧️', color: '#90A4AE', glow: '#B0BEC5', category: 'negative' },
  { id: 'vulnerable', name: 'Vulnerable', emoji: '🥺', color: '#F8BBD9', glow: '#FCE4EC', category: 'negative' },
  { id: 'embarrassed', name: 'Embarrassed', emoji: '😳', color: '#E91E63', glow: '#F06292', category: 'negative' },

  // Anxious/Stress Category  
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043', glow: '#FF8A65', category: 'stress' },
  { id: 'stressed', name: 'Stressed', emoji: '😤', color: '#FF5722', glow: '#FF6F00', category: 'stress' },
  { id: 'overwhelmed', name: 'Overwhelmed', emoji: '🤯', color: '#F06292', glow: '#F48FB1', category: 'stress' },
  { id: 'frustrated', name: 'Frustrated', emoji: '😠', color: '#FF8A65', glow: '#FFAB91', category: 'stress' },
  { id: 'confused', name: 'Confused', emoji: '😕', color: '#FFA726', glow: '#FFB74D', category: 'neutral' },

  // Intense Emotions Category
  { id: 'angry', name: 'Angry', emoji: '😡', color: '#EF5350', glow: '#E57373', category: 'intense' },
  { id: 'surprised', name: 'Surprised', emoji: '😲', color: '#FF5722', glow: '#FF7043', category: 'intense' },
  { id: 'disgusted', name: 'Disgusted', emoji: '🤢', color: '#4CAF50', glow: '#66BB6A', category: 'intense' },
  { id: 'jealous', name: 'Jealous', emoji: '😒', color: '#8BC34A', glow: '#9CCC65', category: 'intense' },
  { id: 'rebellious', name: 'Rebellious', emoji: '😈', color: '#D32F2F', glow: '#F44336', category: 'intense' },

  // Creative/Playful Category
  { id: 'playful', name: 'Playful', emoji: '😜', color: '#FF4081', glow: '#FF80AB', category: 'playful' },
  { id: 'creative', name: 'Creative', emoji: '🎨', color: '#FF7043', glow: '#FFAB91', category: 'playful' },
  { id: 'silly', name: 'Silly', emoji: '🤪', color: '#FFC107', glow: '#FFD54F', category: 'playful' },
  { id: 'romantic', name: 'Romantic', emoji: '💕', color: '#E1BEE7', glow: '#F3E5F5', category: 'playful' },

  // Neutral/Contemplative Category
  { id: 'curious', name: 'Curious', emoji: '🤔', color: '#9C27B0', glow: '#BA68C8', category: 'neutral' },
  { id: 'bored', name: 'Bored', emoji: '😑', color: '#607D8B', glow: '#78909C', category: 'neutral' },
  { id: 'philosophical', name: 'Philosophical', emoji: '🤯', color: '#5E35B1', glow: '#7E57C2', category: 'neutral' },
  { id: 'nostalgic', name: 'Nostalgic', emoji: '📸', color: '#D4A574', glow: '#DDBF94', category: 'neutral' }
];

export default function EmotionsPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [moods, setMoods] = useState(defaultMoods);
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



  // Generate background orbs on client side only to avoid hydration issues
  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const orbs = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      color: colors[i],
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50
    }));
    setBackgroundOrbs(orbs);
  }, []);

  // Load all moods (default + custom) on component mount
  useEffect(() => {
    const loadAllMoods = () => {
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        console.log('Loading all moods...');
      }
      // Use MoodData to get combined moods
      const allMoods = MoodData.getAllMoods();
      if (isDev) {
        console.log('All moods loaded:', allMoods.length, allMoods);
      }
      setMoods(allMoods);
    };

    loadAllMoods();

    // Listen for custom mood updates
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

  // Handle new mood creation
  const handleMoodAdded = (newMood: CustomMood) => {
    // Reload all moods to include the new custom mood
    const allMoods = MoodData.getAllMoods();
    setMoods(allMoods);
    setIsAddModalOpen(false);
  };

  // Handle custom mood deletion
  const handleMoodDeleted = (moodId: string) => {
    const success = CustomMoodStorage.deleteCustomMood(moodId);
    if (success) {
      // Reload all moods to reflect the deletion
      const allMoods = MoodData.getAllMoods();
      setMoods(allMoods);
      // Remove from selected moods if it was selected
      setSelectedMoods(prev => prev.filter(id => id !== moodId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full opacity-20 dark:opacity-10"
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
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + (orb.id * 0.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.id * 0.5
            }}
          />
        ))}
      </div>

      <FloatingBackground />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/20 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30"
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

          <nav className="flex items-center space-x-4">
            <motion.button
              onClick={() => {
                setIsAddModalOpen(true);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30 flex items-center gap-2 text-white font-medium"
              title="Create Custom Mood"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Create Mood</span>
            </motion.button>
            <Link href="/analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/20 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30"
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
            </Link>
            <Link href="/music">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/20 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30"
              >
                <Music className="w-6 h-6 text-white" />
              </motion.div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12 sm:mb-16 px-2"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
              How are you feeling today?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow leading-relaxed px-4">
              Choose your emotional state and discover personalized insights, prompts, and music to guide your reflection journey.
            </p>
            <div className="mt-3 sm:mt-4 text-gray-300 text-xs sm:text-sm">
              Select up to {maxSelections} emotions • {moods.length} emotions available
            </div>
          </motion.div>

          {/* Mood Categories Legend - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 sm:mb-12 text-center px-2"
          >
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl border border-white/20 max-w-full overflow-hidden">
              {[
                { name: 'Positive', color: '#66BB6A' },
                { name: 'Energetic', color: '#FF6D00' },
                { name: 'Calm', color: '#4FC3F7' },
                { name: 'Stressed', color: '#FF7043' },
                { name: 'Negative', color: '#7E57C2' },
                { name: 'Intense', color: '#EF5350' },
                { name: 'Playful', color: '#FF4081' },
                { name: 'Neutral', color: '#9C27B0' }
              ].map(category => (
                <div key={category.name} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Mood Cards Grid - Improved Mobile Responsiveness */}
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
                  ease: [0.4, 0, 0.2, 1]
                }
              }
            }}
          >
            {moods.map((mood, index) => (
              <MoodCard
                key={mood.id}
                mood={mood}
                index={index}
                isSelected={selectedMoods.includes(mood.id)}
                onSelect={() => {
                  setSelectedMoods(prev => {
                    if (prev.includes(mood.id)) {
                      // Remove if already selected
                      return prev.filter(id => id !== mood.id);
                    } else if (prev.length < maxSelections) {
                      // Add if under limit
                      return [...prev, mood.id];
                    }
                    // Do nothing if at limit and not removing
                    return prev;
                  });
                }}
                onDelete={handleMoodDeleted}
              />
            ))}
          </motion.div>

          {/* Enhanced Selected Moods Display - Mobile Optimized */}
          {selectedMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 sm:mt-12 text-center px-2"
            >
              <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl border border-white/20">
                <p className="text-white mb-3 sm:mb-4 text-base sm:text-lg font-medium">
                  Selected {selectedMoods.length} of {maxSelections} emotions
                  {selectedMoods.length >= maxSelections && (
                    <span className="block sm:inline text-sm sm:text-base mt-1 sm:mt-0 sm:ml-1">
                      (maximum reached)
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {selectedMoods.map(moodId => {
                    const mood = moods.find(m => m.id === moodId);
                    return mood ? (
                      <motion.span
                        key={moodId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm sm:text-base font-medium flex items-center gap-1 sm:gap-2 border border-white/30"
                      >
                        <span className="text-base sm:text-lg">{mood.emoji}</span>
                        <span className="hidden sm:inline">{mood.name}</span>
                        <span className="sm:hidden text-xs">{mood.name.length > 8 ? mood.name.slice(0, 8) + '...' : mood.name}</span>
                      </motion.span>
                    ) : null;
                  })}
                </div>

                {/* Enhanced Continue Button - Mobile Optimized */}
                <Link href={`/mood/${selectedMoods[0]}?moods=${selectedMoods.join(',')}`}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
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

      {/* Add Mood Modal */}
      <AddMoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMoodAdded={handleMoodAdded}
      />
    </div>
  );
}