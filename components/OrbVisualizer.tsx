'use client';

import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Play, Pause, Heart } from 'lucide-react';

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
  const [particles, setParticles] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setParticles(Array.from({ length: 16 }, (_, i) => ({
      id: i,
      angle: (i * 22.5) * (Math.PI / 180),
      distance: 130 + Math.random() * 60,
      duration: 3 + Math.random() * 2,
      size: 3 + Math.random() * 4,
    })));
  }, [mood.id]);

  const orbVariants: Variants = {
    idle: {
      scale: [1, 1.08, 1],
      rotate: [0, 8, -8, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    active: {
      scale: [1, 1.25, 1],
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
      y: [0, -25, 0],
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="backdrop-blur-md rounded-3xl p-8 shadow-xl border relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))`,
          borderColor: isHovered ? mood.color : 'rgba(255,255,255,0.5)',
          boxShadow: isHovered 
            ? `0 30px 60px ${mood.color}30, 0 0 0 1px ${mood.glow}40` 
            : '0 15px 40px rgba(0,0,0,0.1)',
        }}
        whileHover={{ scale: 1.01 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, ${mood.color}30, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, ${mood.glow}30, transparent 50%)`,
              `radial-gradient(circle at 20% 80%, ${mood.color}30, transparent 50%)`,
              `radial-gradient(circle at 80% 20%, ${mood.glow}30, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, ${mood.color}30, transparent 50%)`,
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: i % 2 === 0 ? mood.color : mood.glow }} />
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <motion.div 
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h3 
            className="text-2xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Heart className="w-6 h-6" style={{ color: mood.color }} />
            </motion.span>
            Your Emotional State
            <motion.span
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Heart className="w-6 h-6" style={{ color: mood.glow }} />
            </motion.span>
          </motion.h3>
          <motion.p 
            className="text-gray-600 flex items-center justify-center gap-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Visualizing the energy of feeling 
            <span 
              className="font-semibold px-2 py-0.5 rounded-full"
              style={{ 
                background: `${mood.color}20`,
                color: mood.color,
              }}
            >
              {mood.name.toLowerCase()}
            </span>
          </motion.p>
        </motion.div>

        {/* Orb Visualization Area */}
        <div className="relative h-80 flex items-center justify-center">
          {/* Outer particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`,
                width: particle.size,
                height: particle.size,
                left: `calc(50% + ${Math.cos(particle.angle) * particle.distance}px)`,
                top: `calc(50% + ${Math.sin(particle.angle) * particle.distance}px)`,
                boxShadow: `0 0 10px ${mood.glow}`,
              }}
              variants={particleVariants}
              initial="animate"
              animate="animate"
              transition={{
                delay: particle.id * 0.15,
                duration: particle.duration,
              }}
            />
          ))}

          {/* Ripple rings */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                border: `2px solid ${mood.color}`,
                width: 180 + i * 50,
                height: 180 + i * 50,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.1, 0.4],
                borderColor: [mood.color, mood.glow, mood.color],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}

          {/* Main Orb */}
          <motion.div
            className="relative cursor-pointer"
            variants={orbVariants}
            initial="idle"
            animate={isPlaying ? "active" : "idle"}
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Outer glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${mood.glow}60 0%, ${mood.color}30 40%, transparent 70%)`,
                width: 220,
                height: 220,
                filter: 'blur(25px)',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Secondary glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${mood.color}, ${mood.glow}, ${mood.color})`,
                width: 160,
                height: 160,
                filter: 'blur(15px)',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                opacity: 0.4,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Main orb sphere */}
            <motion.div
              className="w-36 h-36 rounded-full relative overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${mood.color} 0%, ${mood.glow} 50%, ${mood.color} 100%)`,
                boxShadow: `
                  0 0 60px ${mood.glow}80, 
                  0 0 100px ${mood.color}50,
                  inset 0 0 30px rgba(255,255,255,0.4),
                  inset -10px -10px 30px ${mood.color}50
                `,
              }}
            >
              {/* Glass reflection */}
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 30%, transparent 60%)`,
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Inner rotating gradient */}
              <motion.div
                className="absolute inset-4 rounded-full opacity-40"
                style={{
                  background: `conic-gradient(from 0deg, ${mood.glow}, transparent, ${mood.color}, transparent, ${mood.glow})`,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Emoji */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-5xl filter drop-shadow-lg"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0],
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
        </div>

        {/* Control Button */}
        <motion.div 
          className="text-center mt-8 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.08, 
              boxShadow: `0 20px 40px ${mood.color}50`,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-4 font-semibold rounded-full shadow-xl transition-all flex items-center gap-3 mx-auto"
            style={{
              background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`,
              color: 'white',
              boxShadow: `0 10px 30px ${mood.color}40`,
            }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                Pause Visualization
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Activate Visualization
              </>
            )}
          </motion.button>

          <motion.p
            className="mt-4 text-sm text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click the orb or button to toggle animation
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
