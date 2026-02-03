'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FloatingBackground } from '@/components/FloatingBackground';
import { Hero } from '@/components/landing/Hero';
import { usePageTransition } from '@/components/TransitionProvider';
import { Heart, BarChart3, Music } from 'lucide-react';

export default function LandingPage() {
  const { startTransition } = usePageTransition();
  // Page transition variants
  const pageVariants = {
    initial: { 
      opacity: 0,
    },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
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
      {/* Soft Animated Background - Slower and more subtle for landing */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${[
                'rgba(139, 92, 246, 0.15)',
                'rgba(236, 72, 153, 0.12)',
                'rgba(59, 130, 246, 0.15)',
                'rgba(167, 139, 250, 0.12)',
                'rgba(244, 114, 182, 0.10)',
                'rgba(96, 165, 250, 0.12)'
              ][i]} 0%, transparent 70%)`,
              width: 300 + i * 50,
              height: 300 + i * 50,
              left: `${[10, 70, 20, 80, 50, 30][i]}%`,
              top: `${[20, 60, 70, 10, 40, 80][i]}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      <FloatingBackground />

      {/* Minimal Header for Landing */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="text-pink-400 w-7 h-7" />
            <span className="text-2xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              InnerHue
            </span>
          </div>

          <nav className="flex space-x-3">
            <motion.button
              onClick={() => startTransition('/explore')}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl text-white/70 text-sm font-medium 
                         hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/10"
            >
              Explore
            </motion.button>
            <Link href="/analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <BarChart3 className="w-5 h-5 text-white/70 hover:text-white" />
              </motion.div>
            </Link>
            <Link href="/music">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <Music className="w-5 h-5 text-white/70 hover:text-white" />
              </motion.div>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <Hero />
    </motion.div>
  );
}
