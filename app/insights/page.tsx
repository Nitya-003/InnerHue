'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, BarChart3, Shield, Rocket } from 'lucide-react';

export default function Insights() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f2a] px-6 py-24">

      {/* ✨ Floating Particles */}
      <Particles />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold text-center mb-16
          bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400
          bg-clip-text text-transparent"
        >
          Insights
        </motion.h1>

        {/* Description */}
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-20 leading-relaxed">
          Insight is a sudden, clear, and deep understanding of a complex situation —
          a <span className="text-yellow-300 font-semibold">lightbulb moment</span> 
          where clarity replaces confusion and deeper truth reveals itself.
        </p>

        {/* Sections */}
        <div className="grid md:grid-cols-2 gap-12">

          <PremiumSection
            icon={<Sparkles />}
            title="Project Insights"
            accent="from-pink-500 via-purple-500 to-indigo-500"
            items={[
              "InnerHue is a next-generation emotional well-being platform.",
              "Custom mood creation for personalized emotional tracking.",
              "Advanced analytics to uncover emotional patterns.",
              "Music & daily quotes enhance emotional growth.",
              "Privacy-first architecture ensures secure data.",
              "AI-powered personalization coming soon."
            ]}
          />

          <PremiumSection
            icon={<BarChart3 />}
            title="Key Features"
            accent="from-cyan-400 via-blue-500 to-purple-500"
            items={[
              "Custom Mood Creation with flexible definitions.",
              "Interactive mood analytics and visual reports.",
              "Personalized UI themes and intensity sliders.",
              "Curated playlists based on emotional state.",
              "Community-based emotional support.",
              "Private & encrypted emotional journaling."
            ]}
          />

          <PremiumSection
            icon={<Rocket />}
            title="Technology Stack"
            accent="from-orange-400 via-pink-500 to-purple-600"
            items={[
              "Next.js for modern performance.",
              "React for dynamic UI.",
              "Tailwind CSS for styling.",
              "Framer Motion for smooth animations.",
              "Lucide Icons for minimal elegance.",
              "Modular scalable architecture."
            ]}
          />

          <PremiumSection
            icon={<Shield />}
            title="Vision & Mission"
            accent="from-emerald-400 via-teal-500 to-cyan-500"
            items={[
              "Empower emotional intelligence.",
              "Make emotional health accessible.",
              "Create mindful digital experiences.",
              "Blend technology with human empathy."
            ]}
          />

        </div>
      </div>
    </div>
  );
}

/* 💎 Premium Section Component */
function PremiumSection({ icon, title, items, accent }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-3xl p-[1px] transition-all duration-500"
    >
      {/* 🌌 Animated Neon Border */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${accent}
        opacity-60 blur-xl group-hover:opacity-100 transition duration-500`} />

      <div className="relative bg-[#0f172a]/90 backdrop-blur-2xl 
        rounded-3xl p-8 border border-white/10
        shadow-[0_0_40px_rgba(139,92,246,0.3)]
        group-hover:shadow-[0_0_80px_rgba(236,72,153,0.4)]
        transition-all duration-500"
      >

        <div className="flex items-center gap-4 mb-8">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${accent} text-white shadow-lg`}>
            {icon}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-wide">
            {title}
          </h2>
        </div>

        <ul className="space-y-4">
          {items.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ x: 6 }}
              className="relative pl-6 text-gray-300
              before:absolute before:left-0 before:top-2
              before:w-2.5 before:h-2.5 before:rounded-full
              before:bg-gradient-to-r before:from-white before:to-purple-400
              hover:text-white transition-all duration-300"
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ✨ Floating Particle Component */
function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
}
