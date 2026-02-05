'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Brain, Music, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';
import { usePageTransition } from '@/components/TransitionProvider';

export default function LandingPage() {
  const { startTransition, isTransitioning } = usePageTransition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-x-hidden">

      {/* Lottie Background Integration */}
      {/* <LottieBackground /> - assuming this might be needed later or removed, keeping concise */}

      <FloatingBackground />

      {/* Minimal Header for Landing */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Heart className="text-pink-400 w-10 h-10" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              InnerHue
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startTransition('/emotions')}
            disabled={isTransitioning}
            className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip to App
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12 md:py-16 lg:py-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg leading-tight">
                Understand your emotions,{' '}
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  one feeling at a time
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow leading-relaxed px-4">
                Discover the depth of your emotional landscape with personalized insights,
                therapeutic music, and guided reflection journeys tailored to your feelings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            >
              <motion.button
                onClick={() => startTransition('/emotions')}
                disabled={isTransitioning}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Reflecting
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur text-white rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer text-center text-sm sm:text-base"
              >
                Learn More
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="py-12 sm:py-16 px-4"
          >
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                How InnerHue Works
              </h3>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                A comprehensive approach to emotional wellness and self-discovery
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Emotion Reflection',
                  description: 'Select from 38 distinct emotional states and dive deep into your feelings with guided introspection.',
                  color: 'from-purple-500 to-indigo-500'
                },
                {
                  icon: Sparkles,
                  title: 'Personalized Insights',
                  description: 'Get tailored prompts, affirmations, and thoughtful questions based on your current emotional state.',
                  color: 'from-pink-500 to-rose-500'
                },
                {
                  icon: Music,
                  title: 'Therapeutic Music',
                  description: 'Discover curated playlists and ambient sounds designed to complement and enhance your emotional journey.',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: BarChart3,
                  title: 'Mood Analytics',
                  description: 'Track emotional patterns over time with beautiful visualizations and gain insights into your well-being.',
                  color: 'from-green-500 to-emerald-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 sm:p-6 bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 text-center sm:text-left"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0`}>
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h4>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

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

              <motion.button
                onClick={() => startTransition('/emotions')}
                disabled={isTransitioning}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 25px 50px rgba(147, 51, 234, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg sm:text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 mx-auto group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                Begin Your Journey
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 p-6 border-t border-white/20"
      >
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 InnerHue. Crafted with care for emotional well-being.</p>
        </div>
      </motion.footer>
    </div>
  );
}
