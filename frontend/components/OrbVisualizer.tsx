'use client';

import { motion, Variants } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ShaderOrb } from './ShaderOrb';
import type { Mood } from '@/types/mood';

export interface OrbVisualizerProps {
  mood: Mood;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  duration: number; // Added
}


export function OrbVisualizer({ mood }: OrbVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; angle: number; drift: number }[]>([]);
  // Detect low-end devices once on mount so we can scale particle count down
  // to keep main-thread work cheap on mobile / integrated-GPU laptops.
  const [particleCount, setParticleCount] = useState(12);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
        // @ts-expect-error - navigator.deviceMemory is non-standard but widely available in Chromium
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        // @ts-expect-error - navigator.hardwareConcurrency is widely supported
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
    if (reduce) setParticleCount(5);
  }, []);

  const handleEmojiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();

    if (now - lastClickTimeRef.current > 500) {
      clickCountRef.current = 0;
    }

    clickCountRef.current += 1;
    lastClickTimeRef.current = now;

    if (clickCountRef.current === 3) {
      triggerConfetti();
      clickCountRef.current = 0;
    }
  };

  const triggerConfetti = () => {
    // Reduce confetti count from 20 to 10 — still feels celebratory but
    // half the DOM nodes to mount + animate on a click burst.
    const newConfetti = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (i * 36) * (Math.PI / 180),
      drift: Math.random() * 50 - 25
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  };


  const orbVariants: Variants = {
    idle: {
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    active: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Static-only animation: scale + opacity. Drop the scale [0.8, 1.5] range
  // and pin to opacity for cheaper paint; the transform itself is GPU-
  // accelerated because of `will-change: transform`.
  const particleVariants: Variants = {
    animate: {
      opacity: [0.2, 0.8, 0.2],
      transition: {
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };


  const [particles, setParticles] = useState<{ id: number; angle: number; distance: number; duration: number }[]>([]);

  useEffect(() => {

    setParticles(Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (i * (360 / particleCount)) * (Math.PI / 180),
      distance: 150 + Math.random() * 50,
      duration: 3 + Math.random() * 2 // Moved here
    })));
  }, [particleCount]);

  return (
    <div className="relative">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Your Emotional State
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Visualizing the energy of feeling {mood.name.toLowerCase()}
          </p>
        </div>

        <div className="relative h-80 flex items-center justify-center">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `calc(50% + ${Math.cos(particle.angle) * particle.distance}px)`,
                top: `calc(50% + ${Math.sin(particle.angle) * particle.distance}px)`,
                backgroundColor: mood.glow,
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
                // CSS keyframes replace the per-element framer-motion driver
                // so the browser can batch them onto the compositor thread
                // instead of recomputing layout per particle per frame.
                animation: `orbParticlePulse ${particle.duration}s ease-in-out ${particle.id * 0.2}s infinite`,
              } as React.CSSProperties}
            />
          ))}

          <motion.div
            className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 cursor-grab active:cursor-grabbing z-10"
            variants={orbVariants}
            initial="idle"
            animate={isPlaying ? "active" : "idle"}
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.2}
            dragSnapToOrigin
            whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            onDragEnd={() => {
              setShowPulse(true);
              setTimeout(() => setShowPulse(false), 1000);
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${mood.glow}40 0%, ${mood.glow}20 40%, transparent 70%)`,
                width: '100%',
                height: '100%',
                filter: 'blur(20px)',
                x: '-50%',
                y: '-50%',
                left: '50%',
                top: '50%',
                willChange: 'transform, opacity',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* 3D Shader Orb */}
            <div
              className="w-40 h-40 md:w-48 md:h-48 relative cursor-pointer"
              onClick={handleEmojiClick}
            >
              <ShaderOrb mood={mood} />
              {/* Emoji overlay */}
              <motion.span
                className="absolute bottom-2 right-2 text-2xl select-none pointer-events-none z-20"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {mood.emoji}
              </motion.span>
            </div>
          </motion.div>

          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`orbital-ring-${i}`}
              className="absolute rounded-full border-2 opacity-30 pointer-events-none"
              style={{
                width: 160 + i * 40,
                height: 160 + i * 40,
                left: '50%',
                top: '50%',
                borderColor: mood.color,
                x: '-50%',
                y: '-50%',
                willChange: 'transform, opacity',
              } as React.CSSProperties}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Drag Pulse Effect */}
          {showPulse && (
            <motion.div
              className="absolute rounded-full border-4 pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                borderColor: mood.glow,
                x: '-50%',
                y: '-50%',
                willChange: 'transform, opacity',
              } as React.CSSProperties}
              initial={{ width: 200, height: 200, opacity: 0.8, borderWidth: 4 }}
              animate={{ width: 400, height: 400, opacity: 0, borderWidth: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}

          {/* Confetti Effect */}
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-xl pointer-events-none z-30"
              style={{
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                willChange: 'transform, opacity',
              }}
              initial={{ scale: 0, opacity: 1, x: '-50%', y: '-50%' }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
                x: `calc(-50% + ${Math.cos(particle.angle) * 200 + particle.drift}px)`,
                y: `calc(-50% + ${Math.sin(particle.angle) * 200 + particle.drift}px)`,
                rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {mood.emoji}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isPlaying ? 'Pause Visualization' : 'Activate Visualization'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
