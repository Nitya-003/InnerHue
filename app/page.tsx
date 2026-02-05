'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoodCard } from '@/components/MoodCard';
import { SkeletonMoodCard } from '@/components/SkeletonMoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { QuoteCard } from '@/components/QuoteCard'; // <--- NEW IMPORT
import { ErrorState } from '@/components/ErrorState';
import { Heart, BarChart3, Music } from 'lucide-react';

// Mood Data Configuration
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

export default function Home() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const maxSelections = 3;

  // Simulate API Fetch
  const fetchData = () => {
    setIsLoading(true);
    setError(false);
    setTimeout(() => {
      setIsLoading(false); // Assume success for production
    }, 2000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-x-hidden">
      
      {/* Background with Aria Hidden */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle, ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'][i]} 0%, transparent 70%)`,
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
        <FloatingBackground />
      </div>
      
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
          
          <nav className="flex space-x-3 md:space-x-4">
            <Link href="/analytics" aria-label="View Analytics">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/20 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30"
              >
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            </Link>
            <Link href="/music" aria-label="Relaxing Music">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/20 backdrop-blur shadow-sm hover:shadow-md transition-all border border-white/30"
              >
                <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          
          {/* NEW QUOTE CARD COMPONENT */}
          <QuoteCard />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg px-2">
              How are you feeling today?
            </h2>
            <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow px-2">
              Choose your emotional state and discover personalized insights, prompts, and music to guide your reflection journey.
            </p>
          </motion.div>

          {/* Grid Area */}
          <div className="min-h-[300px] flex items-center justify-center w-full">
            {error ? (
              <ErrorState 
                message="We couldn't load your mood data. Please check your connection." 
                onRetry={fetchData} 
              />
            ) : (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 max-w-7xl mx-auto w-full"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
              >
                {isLoading ? (
                  Array.from({ length: 16 }).map((_, i) => (
                    <SkeletonMoodCard key={i} />
                  ))
                ) : (
                  moods.map((mood, index) => (
                    <MoodCard
                      key={mood.id}
                      mood={mood}
                      index={index}
                      isSelected={selectedMoods.includes(mood.id)}
                      onSelect={() => {
                        setSelectedMoods(prev => {
                          if (prev.includes(mood.id)) {
                            return prev.filter(id => id !== mood.id);
                          } else if (prev.length < maxSelections) {
                            return [...prev, mood.id];
                          }
                          return prev;
                        });
                      }}
                    />
                  ))
                )}
              </motion.div>
            )}
          </div>

          {!isLoading && !error && selectedMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center fixed bottom-8 left-0 right-0 z-20 pointer-events-none"
            >
              <div className="inline-block bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto mx-4">
                <p className="text-white mb-3 text-sm md:text-base">
                  Selected {selectedMoods.length} of {maxSelections} moods
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {selectedMoods.map(moodId => {
                    const mood = moods.find(m => m.id === moodId);
                    return mood ? (
                      <span
                        key={moodId}
                        className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs md:text-sm flex items-center gap-1 border border-white/20"
                      >
                        {mood.emoji} {mood.name}
                      </span>
                    ) : null;
                  })}
                </div>

                <Link href={`/mood/${selectedMoods[0]}?moods=${selectedMoods.join(',')}`} aria-label="Continue to your personal mood journey">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-sm md:text-base w-full"
                  >
                    Continue Journey →
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}