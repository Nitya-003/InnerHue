'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoodCard } from '@/components/MoodCard';
import { SkeletonMoodCard } from '@/components/SkeletonMoodCard';
import { FloatingBackground } from '@/components/FloatingBackground';
import { ErrorState } from '@/components/ErrorState';
import { Heart } from 'lucide-react';
import { MoodData } from '@/lib/moodData';

export default function Home() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const maxSelections = 3;

  // Use data from MoodData
  const moods = Object.values(MoodData.moods);

  // Simulate API Fetch
  const fetchData = () => {
    setIsLoading(true);
    setError(false);
    setTimeout(() => {
      setIsLoading(false); // Assume success for production
    }, 2000);
  };

  const [backgroundElements, setBackgroundElements] = useState<any[]>([]);

  useEffect(() => {
    // Generate background elements on client side only to avoid hydration mismatch
    const elements = [...Array(8)].map((_, i) => ({
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'][i],
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animateX: Math.random() * 100 - 50,
      animateY: Math.random() * 100 - 50,
      duration: 8 + Math.random() * 4
    }));
    setBackgroundElements(elements);
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-x-hidden">
      
      {/* Background elements */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          {backgroundElements.map((element, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle, ${element.color} 0%, transparent 70%)`,
                width: element.width,
                height: element.height,
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                x: [0, element.animateX],
                y: [0, element.animateY],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
        <FloatingBackground />
      </div>
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="text-pink-400 w-6 h-6 md:w-8 md:h-8" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              InnerHue
            </h1>
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/analytics" className="text-white/70 hover:text-white transition-colors">
               Analytics
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg px-2">
              How are you feeling today?
            </h2>
            <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow px-2">
              Choose your emotional state and discover personalized insights, prompts, and music to guide your reflection journey.
            </p>
          </motion.div>

          {/* Grid Area: Error, Loading, or Success */}
          <div className="min-h-[300px] flex items-center justify-center w-full">
            {error ? (
              <ErrorState 
                message="We couldn't load your mood data. Please check your connection." 
                onRetry={fetchData} 
              />
            ) : (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 max-w-7xl mx-auto w-full"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
              >
                {isLoading ? (
                  Array.from({ length: 16 }).map((_, i) => (
                    <SkeletonMoodCard key={i} />
                  ))
                ) : (
                  moods.map((mood, index) => (
                    <MoodCard
                      key={mood.id}
                      mood={mood}
                      index={index}
                      isSelected={selectedMoods.includes(mood.id)}
                      onSelect={() => {
                        setSelectedMoods(prev => {
                          if (prev.includes(mood.id)) {
                            return prev.filter(id => id !== mood.id);
                          } else if (prev.length < maxSelections) {
                            return [...prev, mood.id];
                          }
                          return prev;
                        });
                      }}
                    />
                  ))
                )}
              </motion.div>
            )}
          </div>

          {!isLoading && !error && selectedMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center fixed bottom-8 left-0 right-0 z-20 pointer-events-none"
            >
              <div className="inline-block bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto mx-4">
                <p className="text-white mb-3 text-sm md:text-base">
                  Selected {selectedMoods.length} of {maxSelections} moods
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {selectedMoods.map(moodId => {
                    const mood = moods.find(m => m.id === moodId);
                    return mood ? (
                      <span
                        key={moodId}
                        className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs md:text-sm flex items-center gap-1 border border-white/20"
                      >
                        {mood.emoji} {mood.name}
                      </span>
                    ) : null;
                  })}
                </div>

                <Link href={`/mood/${selectedMoods[0]}?moods=${selectedMoods.join(',')}`} aria-label="Continue to your personal mood journey">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-sm md:text-base w-full"
                  >
                    Continue Journey →
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
