'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, BarChart3, Music } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import MoodCapsule from '@/components/emotion/MoodCapsule';
import SoftCard from '@/components/ui/SoftCard';
import reflectiveMoods, { ReflectiveMood } from '@/lib/reflectiveMoods';

export default function EmotionsPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const maxSelections = 3;

  const handleMoodToggle = (moodId: string) => {
    setSelectedMoods(prev => {
      if (prev.includes(moodId)) {
        return prev.filter(id => id !== moodId);
      } else if (prev.length < maxSelections) {
        return [...prev, moodId];
      }
      return prev;
    });
  };

  // Group moods by category for better organization
  const groupedMoods = reflectiveMoods.reduce((acc, mood) => {
    if (!acc[mood.category]) {
      acc[mood.category] = [];
    }
    acc[mood.category].push(mood);
    return acc;
  }, {} as Record<string, ReflectiveMood[]>);

  const categoryLabels: Record<string, string> = {
    peaceful: 'Calm & Content',
    positive: 'Hopeful & Grounded',
    energetic: 'Energized & Purposeful',
    anxiety: 'Restless & Uncertain',
    exhaustion: 'Fatigued',
    confusion: 'Unclear',
    contemplative: 'Reflective & Observant',
    sensitivity: 'Vulnerable',
    sadness: 'Heavy & Tender',
    intensity: 'Raw & Intense',
    inspiration: 'Creative',
    playful: 'Light & Joyful',
    complex: 'Layered Feelings'
  };

  return (
    <div className="min-h-screen bg-[#0f0720] text-white transition-colors duration-500">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 z-50 bg-[#0f0720]/80 backdrop-blur-sm border-b border-white/10 p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white/70" />
                </motion.div>
              </Link>

              <h1 className="text-xl md:text-2xl font-semibold">
                InnerHue
              </h1>
            </div>
            
            <nav className="flex items-center space-x-3">
              <Link href="/personalization">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Personalization"
                >
                  <Settings className="w-5 h-5 text-white/70" />
                </motion.div>
              </Link>
              <Link href="/analytics">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-white/70" />
                </motion.div>
              </Link>
              <Link href="/music">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Music className="w-5 h-5 text-white/70" />
                </motion.div>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 md:px-6 pb-20 pt-8">
        <div className="max-w-5xl mx-auto">
          {/* Prompt Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">
              What's here right now?
            </h2>
            <p className="text-lg leading-relaxed text-white/70 max-w-2xl mx-auto">
              Take a moment to notice what you're feeling. Choose up to {maxSelections} emotional states that resonate with your present experience.
            </p>
            <div className="mt-4 text-sm text-white/60">
              {selectedMoods.length} of {maxSelections} selected
            </div>
          </motion.div>

          {/* Mood Categories */}
          <div className="space-y-8">
            {Object.entries(groupedMoods).map(([category, moods], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.2 + (categoryIndex * 0.08),
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <h3 className="text-xs font-medium uppercase tracking-wider text-white/50 mb-3">
                  {categoryLabels[category] || category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {moods.map((mood) => (
                    <MoodCapsule
                      key={mood.id}
                      label={mood.label}
                      tone={mood.tone}
                      isSelected={selectedMoods.includes(mood.id)}
                      onClick={() => handleMoodToggle(mood.id)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Moods Summary */}
          {selectedMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mt-12"
            >
              <SoftCard>
                <div className="text-center">
                  <p className="text-lg mb-4 font-medium">
                    You're experiencing:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {selectedMoods.map(moodId => {
                      const mood = reflectiveMoods.find(m => m.id === moodId);
                      return mood ? (
                        <motion.span
                          key={moodId}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="text-sm font-medium px-4 py-2 rounded-full bg-white/10 text-white"
                        >
                          {mood.label}
                        </motion.span>
                      ) : null;
                    })}
                  </div>

                  <Link href={`/mood/${selectedMoods[0]}?moods=${selectedMoods.join(',')}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="px-8 py-3 bg-white text-[#0f0720] rounded-full font-medium shadow-sm hover:shadow-md transition-all"
                    >
                      Continue to Reflection
                    </motion.button>
                  </Link>
                </div>
              </SoftCard>
            </motion.div>
          )}

          {/* Gentle Guidance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
              There's no right or wrong here. Whatever you're feeling is welcome. 
              These labels are suggestions — you know your experience best.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
