'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LandingOrb } from './LandingOrb';
import { usePageTransition } from '@/components/TransitionProvider';

export function Hero() {
  const { startTransition, isTransitioning } = usePageTransition();

  // Animation variants for staggered fade-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const orbVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Subtle badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-sm text-white/70">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Your journey to self-awareness begins here
          </span>
        </motion.div>

        {/* Main Tagline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Understand your emotions,{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            one feeling at a time.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          A peaceful space to visualize and explore your inner landscape.
        </motion.p>

        {/* Interactive Orb Visualization */}
        <motion.div
          variants={orbVariants}
          className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-8"
        >
          <LandingOrb className="w-full h-full" />
        </motion.div>

        {/* Primary CTA Button - Glassmorphic Style with Custom Transition */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={() => startTransition('/explore')}
            disabled={isTransitioning}
            whileHover={{ 
              scale: 1.08,
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.6)',
            }}
            whileTap={{ scale: 0.92 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 
                       bg-white/10 backdrop-blur-2xl 
                       border border-white/20 
                       rounded-full
                       text-white text-lg sm:text-xl font-medium
                       shadow-[0_8px_32px_rgba(139,92,246,0.2)]
                       transition-all duration-500 ease-out
                       hover:bg-white/15 hover:border-white/30
                       cursor-pointer overflow-hidden
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated gradient background on hover */}
            <motion.span 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 50%, rgba(59,130,246,0.3) 100%)',
                backgroundSize: '200% 100%',
              }}
              initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
              whileHover={{ 
                opacity: 1, 
                backgroundPosition: '100% 50%',
                transition: { duration: 0.8 }
              }}
            />
            
            {/* Shimmer effect */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['200% 50%', '-200% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            <span className="relative z-10">Start Reflecting</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Secondary text */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-sm text-white/40"
        >
          No account needed • Free forever • Your data stays private
        </motion.p>
      </motion.div>
    </section>
  );
}
