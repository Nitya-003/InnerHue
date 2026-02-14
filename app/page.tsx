'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoodCard } from '@/components/MoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { QuoteCard } from '@/components/QuoteCard';
import { Heart, BarChart3, Music, CirclePlus } from 'lucide-react';
import SimpleLangFlowChatbot from '@/components/SimpleLangFlowChatbot';
import { ThemeToggle } from '@/components/ThemeToggle';

const moods = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D', glow: '#FFF176', category: 'positive' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5', glow: '#64B5F6', category: 'negative' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043', glow: '#FF8A65', category: 'stress' },
  { id: 'excited', name: 'Excited', emoji: '🤩', color: '#AB47BC', glow: '#BA68C8', category: 'energetic' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A', glow: '#81C784', category: 'calm' },
  { id: 'angry', name: 'Angry', emoji: '😡', color: '#EF5350', glow: '#E57373', category: 'intense' },
  { id: 'confused', name: 'Confused', emoji: '😕', color: '#FFA726', glow: '#FFB74D', category: 'neutral' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: '#26A69A', glow: '#4DB6AC', category: 'positive' },
  { id: 'lonely', name: 'Lonely', emoji: '😔', color: '#7E57C2', glow: '#9575CD', category: 'negative' },
  { id: 'hopeful', name: 'Hopeful', emoji: '🌟', color: '#FFCA28', glow: '#FFD54F', category: 'positive' },
  { id: 'stressed', name: 'Stressed', emoji: '😤', color: '#FF5722', glow: '#FF6F00', category: 'stress' },
  { id: 'peaceful', name: 'Peaceful', emoji: '🕊️', color: '#4FC3F7', glow: '#81D4FA', category: 'calm' },
  { id: 'energized', name: 'Energized', emoji: '⚡', color: '#FFEB3B', glow: '#FFF176', category: 'energetic' },
  { id: 'overwhelmed', name: 'Overwhelmed', emoji: '🤯', color: '#F06292', glow: '#F48FB1', category: 'stress' },
  { id: 'content', name: 'Content', emoji: '😊', color: '#AED581', glow: '#C5E1A5', category: 'calm' },
  { id: 'frustrated', name: 'Frustrated', emoji: '😠', color: '#FF8A65', glow: '#FFAB91', category: 'stress' },
  { id: 'inspired', name: 'Inspired', emoji: '💡', color: '#FFD740', glow: '#FFE082', category: 'energetic' },
  { id: 'melancholy', name: 'Melancholy', emoji: '🌧️', color: '#90A4AE', glow: '#B0BEC5', category: 'negative' },
  { id: 'motivated', name: 'Motivated', emoji: '🔥', color: '#FF6D00', glow: '#FF8F00', category: 'energetic' },
  { id: 'vulnerable', name: 'Vulnerable', emoji: '🥺', color: '#F8BBD9', glow: '#FCE4EC', category: 'negative' },
  { id: 'empowered', name: 'Empowered', emoji: '💪', color: '#6A1B9A', glow: '#8E24AA', category: 'positive' },
  { id: 'nostalgic', name: 'Nostalgic', emoji: '📸', color: '#D4A574', glow: '#DDBF94', category: 'neutral' },
  { id: 'jealous', name: 'Jealous', emoji: '😒', color: '#8BC34A', glow: '#9CCC65', category: 'intense' },
  { id: 'proud', name: 'Proud', emoji: '😤', color: '#FF9800', glow: '#FFB74D', category: 'positive' },
  { id: 'curious', name: 'Curious', emoji: '🤔', color: '#9C27B0', glow: '#BA68C8', category: 'neutral' },
  { id: 'bored', name: 'Bored', emoji: '😑', color: '#607D8B', glow: '#78909C', category: 'neutral' },
  { id: 'surprised', name: 'Surprised', emoji: '😲', color: '#FF5722', glow: '#FF7043', category: 'intense' },
  { id: 'disgusted', name: 'Disgusted', emoji: '🤢', color: '#4CAF50', glow: '#66BB6A', category: 'intense' },
  { id: 'embarrassed', name: 'Embarrassed', emoji: '😳', color: '#E91E63', glow: '#F06292', category: 'negative' },
  { id: 'determined', name: 'Determined', emoji: '😤', color: '#3F51B5', glow: '#5C6BC0', category: 'energetic' },
  { id: 'playful', name: 'Playful', emoji: '😜', color: '#FF4081', glow: '#FF80AB', category: 'playful' },
  { id: 'dreamy', name: 'Dreamy', emoji: '😴', color: '#9FA8DA', glow: '#C5CAE9', category: 'calm' },
  { id: 'adventurous', name: 'Adventurous', emoji: '🗺️', color: '#FF6F00', glow: '#FF8F00', category: 'energetic' },
  { id: 'romantic', name: 'Romantic', emoji: '💕', color: '#E1BEE7', glow: '#F3E5F5', category: 'playful' },
  { id: 'creative', name: 'Creative', emoji: '🎨', color: '#FF7043', glow: '#FFAB91', category: 'playful' },
  { id: 'philosophical', name: 'Philosophical', emoji: '🤯', color: '#5E35B1', glow: '#7E57C2', category: 'neutral' },
  { id: 'rebellious', name: 'Rebellious', emoji: '😈', color: '#D32F2F', glow: '#F44336', category: 'intense' },
  { id: 'silly', name: 'Silly', emoji: '🤪', color: '#FFC107', glow: '#FFD54F', category: 'playful' }
];

export default function Home() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [backgroundOrbs, setBackgroundOrbs] = useState<Array<{
    id: number;
    color: string;
    width: number;
    height: number;
    left: string;
    top: string;
    x: number;
    y: number;
    duration: number;
  }>>([]);

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
      y: Math.random() * 100 - 50,
      duration: 8 + Math.random() * 4
    }));
    setBackgroundOrbs(orbs);
  }, []);

  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev => {
      if (prev.includes(moodId)) {
        return prev.filter(id => id !== moodId);
      } else {
        if (prev.length < 3) {
          return [...prev, moodId];
        }
        return prev;
      }
    });
  };

  const handleEmotionDetected = (emotions: string[]) => {
    setSelectedMoods(emotions.slice(0, 3));
  };

  const handleAutoNavigate = () => {
    const exploreButton = document.querySelector('a[href^="/mood/"]') as HTMLAnchorElement;
    if (exploreButton) {
      exploreButton.click();
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
              duration: orb.duration,
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
        className="relative z-10 p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="text-pink-400 w-6 h-6 md:w-8 md:h-8" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              InnerHue
            </h1>
          </div>

          <nav className="flex items-center space-x-2 md:space-x-4">
            <Link href="/emotions">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-1.5 md:p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30 flex items-center gap-2 text-white"
                title="Create Custom Moods"
              >
                <CirclePlus className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm font-medium hidden sm:block">Custom Moods</span>
              </motion.div>
            </Link>
            <Link href="/analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-1.5 md:p-2 rounded-lg bg-white/20 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30"
              >
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            </Link>
            <Link href="/music">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-1.5 md:p-2 rounded-lg bg-white/20 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30"
              >
                <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
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
            className="text-center mb-12 md:mb-12 mt-12 md:mt-0"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
              How are you feeling today?
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow mb-6 leading-relaxed">
              Choose your emotional state and discover personalized insights, prompts, and music to guide your reflection journey.
            </p>

            {/* Custom Mood Creation CTA */}
            <Link href="/emotions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm md:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto mb-8"
              >
                <CirclePlus className="w-4 h-4 md:w-5 md:h-5" />
                Create Your Own Custom Mood
              </motion.button>
            </Link>
          </motion.div>

          {/* Mood Cards Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
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
                onSelect={() => toggleMood(mood.id)}
              />
            ))}
          </motion.div>

          {/* Continue Button */}
          {selectedMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <Link href={`/mood/${selectedMoods[0]}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Your Mood{selectedMoods.length > 1 ? 's' : ''}
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* Chatbot */}
      <SimpleLangFlowChatbot
        onEmotionDetected={handleEmotionDetected}
        onAutoNavigate={handleAutoNavigate}
      />
    </div>
  );
}