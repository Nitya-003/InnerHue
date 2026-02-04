'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setSize();
    window.addEventListener('resize', setSize);

    // Star properties
    // Moving away from "Warp Speed" to "Slow Drift & Twinkle"
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number; phase: number }[] = [];
    const numStars = 150; // Sparse, high-quality stars
    
    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5, // 0.5 to 2.0px (unchanged size)
        opacity: Math.random(),
        speed: Math.random() * 0.2 + 0.1, // Faster drift (was 0.05 + 0.01)
        phase: Math.random() * Math.PI * 2 
      });
    }

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.05; // Faster time progression for glitter effect
      
      ctx.fillStyle = '#FFFFFF';

      for (const star of stars) {
        // 1. Movement: Faster upward drift
        star.y -= star.speed;
        
        // Wrap around screen
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // 2. Glitter Effect: Faster, sharper oscillation
        // Math.sin(time) creates the wave. 
        // Multiplying time by 2 makes it oscillate faster.
        // Using Math.pow(..., 2) makes the peaks sharper (more "glittery" than "pulsing")
        const twinkle = Math.abs(Math.sin(time * 1.5 + star.phase)); 
        const glitter = twinkle * 0.6 + 0.4; // oscillates between 0.4 and 1.0

        const currentOpacity = star.opacity * glitter;

        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* 
        Vibrant Purple-Blue Gradient 
        Matches the "Old Version" screenshot:
        Top-Left: Bright Purple/Fuchsia
        Bottom-Right: Deep Blue/Navy
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#1e3a8a] to-[#0f172a]" />
      
      {/* Canvas Layer for Stars */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0"
      />

      {/* Subtle vignette to focus center */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </motion.div>
  );
};
