'use client';

import { useLottie } from "lottie-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const LottieBackground = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Fetching a high-quality gradient abstract background
    // This adds a fluid, organic feel without heavy GPU usage of complex CSS shapes
    // TODO: For production, download this JSON and import it locally to avoid network requests
    // import animationData from '@/public/background-lottie.json';
    fetch('https://lottie.host/02096756-3213-4522-901d-551139459529/03X2XkC28C.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load animation');
        return res.json();
      })
      .then(data => setAnimationData(data))
      .catch(err => {
        console.error("Failed to load lottie background", err);
        // Fallback or retry logic could go here
      });
  }, []);

  const options = {
    animationData: animationData,
    loop: true,
    autoplay: true,
    renderer: 'canvas', // Canvas is more performant for large backgrounds
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const { View } = useLottie(options);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Base gradient as fallback and underlay - Matches original site aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />

      {/* Lottie Animation Layer */}
      {animationData && (
        <div className="absolute inset-0 opacity-80 scale-125 mix-blend-screen">
          {View}
        </div>
      )}

      {/* Glassmorphism Overlay - Creates the "Apple-like" diffused look */}
      <div className="absolute inset-0 backdrop-blur-[50px] bg-black/5" />
      
      {/* Noise texture for texture (optional, adds premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />
    </motion.div>
  );
};
