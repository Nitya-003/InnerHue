'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoodCard } from '@/components/MoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { Heart, BarChart3, Music, ArrowLeft } from 'lucide-react';

const moods = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D', glow: '#FFF176' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5', glow: '#64B5F6' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043', glow: '#FF8A65' },
  { id: 'excited', name: 'Excited', emoji: '🤩', color: '#AB47BC', glow: '#BA68C8' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A', glow: '#81C784' },
  { id: 'angry', name: 'Angry', emoji: '😡', color: '#EF5350', glow: '#E57373' },
  { id: 'confused', name: 'Confused', emoji: '😕', color: '#FFA726', glow: '#FFB74D' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: '#26A69A', glow: '#4DB6AC' },
  { id: 'lonely', name: 'Lonely', emoji: '😔', color: '#7E57C2', glow: '#9575CD' },
  { id: 'hopeful', name: 'Hopeful', emoji: '🌟', color: '#FFCA28', glow: '#FFD54F' },
  { id: 'stressed', name: 'Stressed', emoji: '😤', color: '#FF5722', glow: '#FF6F00' },
  { id: 'peaceful', name: 'Peaceful', emoji: '🕊️', color: '#4FC3F7', glow: '#81D4FA' },
  { id: 'energized', name: 'Energized', emoji: '⚡', color: '#FFEB3B', glow: '#FFF176' },
  { id: 'overwhelmed', name: 'Overwhelmed', emoji: '🤯', color: '#F06292', glow: '#F48FB1' },
  { id: 'content', name: 'Content', emoji: '😊', color: '#AED581', glow: '#C5E1A5' },
  { id: 'frustrated', name: 'Frustrated', emoji: '😠', color: '#FF8A65', glow: '#FFAB91' },
  { id: 'inspired', name: 'Inspired', emoji: '💡', color: '#FFD740', glow: '#FFE082' },
  { id: 'melancholy', name: 'Melancholy', emoji: '🌧️', color: '#90A4AE', glow: '#B0BEC5' },
  { id: 'motivated', name: 'Motivated', emoji: '🔥', color: '#FF6D00', glow: '#FF8F00' },
  { id: 'vulnerable', name: 'Vulnerable', emoji: '🥺', color: '#F8BBD9', glow: '#FCE4EC' },
  { id: 'empowered', name: 'Empowered', emoji: '💪', color: '#6A1B9A', glow: '#8E24AA' },
  { id: 'nostalgic', name: 'Nostalgic', emoji: '📸', color: '#D4A574', glow: '#DDBF94' },
  { id: 'jealous', name: 'Jealous', emoji: '😒', color: '#8BC34A', glow: '#9CCC65' },
  { id: 'proud', name: 'Proud', emoji: '😤', color: '#FF9800', glow: '#FFB74D' },
  { id: 'curious', name: 'Curious', emoji: '🤔', color: '#9C27B0', glow: '#BA68C8' },
  { id: 'bored', name: 'Bored', emoji: '😑', color: '#607D8B', glow: '#78909C' },
  { id: 'surprised', name: 'Surprised', emoji: '😲', color: '#FF5722', glow: '#FF7043' },
  { id: 'disgusted', name: 'Disgusted', emoji: '🤢', color: '#4CAF50', glow: '#66BB6A' },
  { id: 'embarrassed', name: 'Embarrassed', emoji: '😳', color: '#E91E63', glow: '#F06292' },
  { id: 'determined', name: 'Determined', emoji: '😤', color: '#3F51B5', glow: '#5C6BC0' },
  { id: 'playful', name: 'Playful', emoji: '😜', color: '#FF4081', glow: '#FF80AB' },
  { id: 'dreamy', name: 'Dreamy', emoji: '😴', color: '#9FA8DA', glow: '#C5CAE9' },
  { id: 'adventurous', name: 'Adventurous', emoji: '🗺️', color: '#FF6F00', glow: '#FF8F00' },
  { id: 'romantic', name: 'Romantic', emoji: '💕', color: '#E1BEE7', glow: '#F3E5F5' },
  { id: 'creative', name: 'Creative', emoji: '🎨', color: '#FF7043', glow: '#FFAB91' },
  { id: 'philosophical', name: 'Philosophical', emoji: '🤯', color: '#5E35B1', glow: '#7E57C2' },
  { id: 'rebellious', name: 'Rebellious', emoji: '😈', color: '#D32F2F', glow: '#F44336' },
  { id: 'silly', name: 'Silly', emoji: '🤪', color: '#FFC107', glow: '#FFD54F' }
];

export default function ExplorePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

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
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden"
    >
      {/* Animated Background Orbs - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              background: `radial-gradient(circle, ${['rgba(255,107,107,0.15)', 'rgba(78,205,196,0.12)', 'rgba(69,183,209,0.15)', 'rgba(150,206,180,0.12)', 'rgba(255,234,167,0.10)'][i]} 0%, transparent 70%)`,
              width: 200 + i * 60,
              height: 200 + i * 60,
              left: `${[15, 75, 25, 85, 50][i]}%`,
              top: `${[20, 60, 75, 15, 45][i]}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 18 + i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
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
      <main className="relative z-10 px-6 pb-20">
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
          </motion.div>

          {/* Mood Cards Grid with wave entrance effect */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.6,
                  staggerChildren: 0.03
                }
              }
            }}
          >
            {moods.map((mood, index) => (
              <MoodCard
                key={mood.id}
                mood={mood}
                index={index}
                isSelected={selectedMood === mood.id}
                onSelect={() => setSelectedMood(mood.id)}
              />
            ))}
          </motion.div>

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
