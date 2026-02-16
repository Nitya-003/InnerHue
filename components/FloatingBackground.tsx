'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  size: number;
  x: number;
  y: number;
  color: string;
  shape: string;
  duration: number;
  delay: number;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export function FloatingBackground() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShapes(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 150 + 30,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: [
        'rgba(139, 92, 246, 0.15)',
        'rgba(236, 72, 153, 0.15)',
        'rgba(59, 130, 246, 0.15)',
        'rgba(16, 185, 129, 0.15)',
        'rgba(245, 158, 11, 0.15)',
        'rgba(168, 85, 247, 0.15)',
        'rgba(244, 114, 182, 0.15)',
        'rgba(34, 197, 94, 0.15)',
        'rgba(251, 146, 60, 0.15)',
        'rgba(99, 102, 241, 0.15)'
      ][Math.floor(Math.random() * 10)],
      shape: Math.random() > 0.5 ? 'circle' : 'square',
      duration: 12 + Math.random() * 8,
      delay: Math.random() * 2
    })));

    setParticles(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 4
    })));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.shape === 'circle' ? 'rounded-full' : 'rounded-lg rotate-45'}`}
          style={{
            width: shape.size,
            height: shape.size,
            background: `radial-gradient(circle, ${shape.color} 0%, transparent 70%)`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            filter: 'blur(2px)'
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.2, 0.8, 0.2],
            rotate: shape.shape === 'square' ? [45, 135, 225, 315, 45] : [0, 360]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay
          }}
        />
      ))}
      
      {/* Additional floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
}
