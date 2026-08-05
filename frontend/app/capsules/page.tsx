"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, BarChart3, Music, Settings } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MemoryCapsule } from '@/components/MemoryCapsule';

export default function CapsulesPage() {
  return (
    <div className="min-h-screen relative overflow-x-clip bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))] text-foreground transition-colors duration-500">
      {/* Background Animated Aurora */}
      <FloatingBackground />

      {/* Header Navigation Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 p-4 md:p-6 backdrop-blur-md bg-slate-50/80 dark:bg-[hsl(var(--page-gradient-from))]/80 border-b border-black/5 dark:border-white/10 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          {/* Back & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" aria-label="Back to home">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-1.5 md:p-2 rounded-lg bg-card/70 dark:bg-white/10 backdrop-blur shadow-sm hover:shadow-md transition-all border border-border/80 dark:border-white/20"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>

            <div className="flex items-center space-x-2">
              <Heart className="text-pink-400 w-6 h-6 md:w-8 md:h-8" />
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                InnerHue
              </h1>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <nav className="flex items-center space-x-2 md:space-x-3">
            <Link href="/analytics" aria-label="Analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-card/55 dark:bg-white/5 backdrop-blur-xl hover:bg-card/80 dark:hover:bg-white/10 transition-all duration-300 border border-border/70 dark:border-white/10"
              >
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>
            <Link href="/music" aria-label="Music">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-card/55 dark:bg-white/5 backdrop-blur-xl hover:bg-card/80 dark:hover:bg-white/10 transition-all duration-300 border border-border/70 dark:border-white/10"
              >
                <Music className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>
            <Link href="/personalization" aria-label="Personalization">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-card/55 dark:bg-white/5 backdrop-blur-xl hover:bg-card/80 dark:hover:bg-white/10 transition-all duration-300 border border-border/70 dark:border-white/10"
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-foreground dark:text-white" />
              </motion.div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </motion.header>

      {/* Main Page Container */}
      <main id="main" className="relative z-10 px-4 md:px-6 pb-24 pt-4">
        <div className="max-w-6xl mx-auto">
          <MemoryCapsule />
        </div>
      </main>
    </div>
  );
}
