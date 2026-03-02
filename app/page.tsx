'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, BarChart3, Music, Brain, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { MoodCard } from '@/components/MoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { Heart, BarChart3, Music } from 'lucide-react';
import SimpleLangFlowChatbot from '@/components/SimpleLangFlowChatbot';
import { QuoteCard } from '@/components/QuoteCard';

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

interface Orb {
  id: number;
  color: string;
  width: number;
  height: number;
  left: number;
  top: number;
  x: number;
  y: number;
  duration: number;
}

export default function Home() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const maxSelections = 3;

  // Derive active emotion color for aurora
  const activeMood = moods.find(m => selectedMoods[0] === m.id);
  const auroraColor = activeMood?.color;
  const auroraGlow = activeMood?.glow;

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.8 }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.4 }
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    setError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen relative overflow-hidden bg-[#0f0720]"
    >
      {/* Dynamic Aurora Background */}
      <AuroraBackground emotionColor={auroraColor} emotionGlow={auroraGlow} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Heart className="text-pink-400 w-10 h-10" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              InnerHue
            </h1>
          </div>

          <nav className="flex items-center space-x-2 md:space-x-3">
            <Link href="/emotions">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-1.5 md:p-2 rounded-lg bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2 text-white"
                title="Custom Moods"
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm font-medium hidden sm:block">Custom Moods</span>
              </motion.div>
            </Link>
            <Link href="/analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            </Link>
            <Link href="/music" aria-label="Relaxing Music">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                title="Music"
              >
                <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main id="main" className="relative z-10 px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8 scroll-mt-24"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              How are you feeling today?
            </h3>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow mb-6 leading-relaxed">
              Choose your emotional state and discover personalized insights, prompts, and music to guide your reflection journey.
            </p>

            {/* Custom Mood Creation CTA */}
            <Link href="/emotions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="px-4 py-2 md:px-6 md:py-3 bg-journal-surface dark:bg-surface text-journal-textPrimary dark:text-foreground text-sm md:text-base font-medium rounded-full border border-black/10 dark:border-white/10 hover:bg-journal-card dark:hover:bg-card transition-all duration-300 shadow-[0px_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.06)] flex items-center gap-2 mx-auto mb-8"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Create Your Own Mood
              </motion.button>
            </Link>
          </motion.div>

          {/* Grid Area: Error, Loading, or Success */}
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

          {/* Features Section */}
          <section className="py-20 sm:py-24 px-4">
            <div className="text-center mb-16 sm:mb-20">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 sm:mb-4">
                How InnerHue Works
              </h3>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                A comprehensive approach to emotional wellness and self-discovery
              </p>
            </div>

            <div className="space-y-20 sm:space-y-24 max-w-6xl mx-auto">
              <FeatureRow
                icon={Brain}
                title="Emotion Reflection"
                description="Select from 38 distinct emotional states and dive deep into your feelings with guided introspection. Each emotion opens a pathway to understanding your inner landscape."
                align="left"
                index={0}
              />

              <FeatureRow
                icon={Sparkles}
                title="Personalized Insights"
                description="Get tailored prompts, affirmations, and thoughtful questions based on your current emotional state. Our reflection system adapts to your unique journey."
                align="right"
                index={1}
              />

              <FeatureRow
                icon={Music}
                title="Therapeutic Music"
                description="Discover curated playlists and ambient sounds designed to complement and enhance your emotional journey. Let sound guide your reflection."
                align="left"
                index={2}
              />

              <FeatureRow
                icon={BarChart3}
                title="Mood Analytics"
                description="Track emotional patterns over time with beautiful visualizations and gain insights into your well-being. Witness your growth unfold."
                align="right"
                index={3}
              />
            </div>
          </section>

          {/* Call to Action */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center py-12 sm:py-16 px-4"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to explore your inner world?
              </h3>

              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
                Join thousands who have discovered deeper self-awareness through InnerHue&apos;s
                guided emotional reflection experience.
              </p>

              <Link href="/emotions">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(147, 51, 234, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg sm:text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 mx-auto group"
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      {/* AI Therapist Chatbot */}
      <AITherapist
        activeEmotion={activeMood?.id}
        onEmotionDetected={(emotions) => {
          const found = moods.find(m => emotions.includes(m.id));
          if (found && !selectedMoods.includes(found.id) && selectedMoods.length < maxSelections) {
            setSelectedMoods(prev => [...prev, found.id]);
          }
        }}
      />
    </motion.div>
  );
}
