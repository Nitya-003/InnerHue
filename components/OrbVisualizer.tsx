'use client';

import { motion, Variants } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
}

interface OrbVisualizerProps {
  mood: Mood;
}

export function OrbVisualizer({ mood }: OrbVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; angle: number; drift: number }[]>([]);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

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
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (i * 18) * (Math.PI / 180),
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



  return (
    <div className="relative">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 dark:border-white/10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Your Emotional State
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Visualizing the energy of feeling {mood.name.toLowerCase()}
          </p>
        </div>

        <div className="relative h-80 flex items-center justify-center">


          <motion.div
            className="relative flex items-center justify-center w-48 h-48 cursor-grab active:cursor-grabbing z-10"
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
                width: 200,
                height: 200,
                filter: 'blur(20px)',
                x: '-50%',
                y: '-50%',
                left: '50%',
                top: '50%',
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

            <motion.div
              className="w-32 h-32 rounded-full relative overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${mood.color} 0%, ${mood.glow} 100%)`,
                boxShadow: `0 0 40px ${mood.glow}60, inset 0 0 20px rgba(255,255,255,0.3)`,
              }}
            >
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                onClick={handleEmojiClick}
              >
                <motion.span
                  className="text-4xl select-none"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  whileTap={{ scale: 0.8 }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {mood.emoji}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>

          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 opacity-30 pointer-events-none"
              style={{
                borderColor: mood.color,
                width: 160 + i * 40,
                height: 160 + i * 40,
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
              }}
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
                borderColor: mood.glow,
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
              }}
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

