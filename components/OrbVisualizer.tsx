'use client';

import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';

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

interface Particle {
  id: number;
  angle: number;
  distance: number;
  duration: number; // Added
}

export function OrbVisualizer({ mood }: OrbVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

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

  const particleVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) * (Math.PI / 180),
      distance: 150 + Math.random() * 50,
      duration: 3 + Math.random() * 2 // Moved here
    })));
  }, []);

  return (
    <div className="relative">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Your Emotional State
          </h3>
          <p className="text-gray-600">
            Visualizing the energy of feeling {mood.name.toLowerCase()}
          </p>
        </div>

        <div className="relative h-80 flex items-center justify-center">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: mood.glow,
                left: `calc(50% + ${Math.cos(particle.angle) * particle.distance}px)`,
                top: `calc(50% + ${Math.sin(particle.angle) * particle.distance}px)`,
              }}
              variants={particleVariants}
              initial="animate"
              animate="animate"
              transition={{
                delay: particle.id * 0.2,
                duration: particle.duration, // Use state value
              }}
            />
          ))}

          <motion.div
            className="relative"
            variants={orbVariants}
            initial="idle"
            animate={isPlaying ? "active" : "idle"}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${mood.glow}40 0%, ${mood.glow}20 40%, transparent 70%)`,
                width: 200,
                height: 200,
                filter: 'blur(20px)',
                transform: 'translate(-50%, -50%)',
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

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-4xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
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
              key={`orbital-ring-${i}`}
              className="absolute rounded-full border-2 opacity-30"
              style={{
                borderColor: mood.color,
                width: 160 + i * 40,
                height: 160 + i * 40,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
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
