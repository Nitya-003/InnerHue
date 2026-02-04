'use client';

import { useLottie } from "lottie-react";
import { motion } from "framer-motion";
import animationData from "@/public/background-lottie.json";

export const LottieBackground = () => {
  const options = {
    animationData: animationData,
    loop: true,
    autoplay: true,
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
      {/* Base gradient as fallback and underlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

      {/* Lottie Animation Layer */}
      {animationData && (
        <div className="absolute inset-0 opacity-60 scale-110">
          {View}
        </div>
      )}

      {/* Glassmorphism Overlay - Creates the "Apple-like" diffused look */}
      <div className="absolute inset-0 backdrop-blur-[80px] bg-black/10" />
      
      {/* Noise texture for texture (optional, adds premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />
    </motion.div>
  );
};
