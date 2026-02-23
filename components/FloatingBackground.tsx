'use client';

import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

export const FloatingBackground = memo(function FloatingBackground() {
  // Reduced number of shapes for better performance
  const shapes = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 80 + (i * 20),
    x: (i * 8) % 100,
    y: (i * 12) % 100,
    color: [
      'rgba(139, 92, 246, 0.12)',
      'rgba(236, 72, 153, 0.10)',
      'rgba(59, 130, 246, 0.12)',
      'rgba(167, 139, 250, 0.10)',
      'rgba(244, 114, 182, 0.08)',
      'rgba(96, 165, 250, 0.10)',
    ][i % 6],
  })), []);

  // Fewer particles
  const particles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: (i * 7) % 100,
    y: (i * 11) % 100,
    duration: 6 + (i % 4) * 2,
    delay: i * 0.3,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background shapes - using CSS animations where possible */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: shape.size,
            height: shape.size,
            background: `radial-gradient(circle, ${shape.color} 0%, transparent 70%)`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -25, 25, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 20 + shape.id * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Floating particles - reduced and optimized */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-1 h-1 bg-white/60 rounded-full will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
});
