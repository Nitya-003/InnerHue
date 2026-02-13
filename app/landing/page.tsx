'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Brain, Music, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i]} 0%, transparent 70%)`,
              width: Math.random() * 200 + 150,
              height: Math.random() * 200 + 150,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
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
          <div className="flex items-center space-x-3">
            <Heart className="text-pink-400 w-10 h-10" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              InnerHue
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/emotions"
                className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 font-medium"
              >
                Skip to App
              </Link>
            </motion.div>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 md:py-24"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                Understand your emotions,{' '}
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  one feeling at a time
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow leading-relaxed">
                Discover the depth of your emotional landscape with personalized insights,
                therapeutic music, and guided reflection journeys tailored to your feelings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/emotions">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 group"
                >
                  Start Reflecting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-6 py-4 bg-white/10 backdrop-blur text-white rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer"
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
            className="py-20 md:py-24"
          >
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How InnerHue Works
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                A comprehensive approach to emotional wellness and self-discovery
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  className="p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h4>

                  <p className="text-gray-300 leading-relaxed">
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
            className="text-center py-16"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to explore your inner world?
              </h3>

              <p className="text-xl text-gray-300 mb-8">
                Join thousands who have discovered deeper self-awareness through InnerHue's
                guided emotional reflection experience.
              </p>

              <Link href="/emotions">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 25px 50px rgba(147, 51, 234, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-3 mx-auto group"
                >
                  <Heart className="w-6 h-6" />
                  Begin Your Journey
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
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