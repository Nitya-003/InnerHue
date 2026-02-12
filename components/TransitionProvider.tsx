'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

interface TransitionContextType {
  startTransition: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within TransitionProvider');
  }
  return context;
}

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const router = useRouter();

  const startTransition = useCallback((href: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTransitionPhase('exit');

    // Wait for exit animation, then navigate
    setTimeout(() => {
      router.push(href);
      setTransitionPhase('enter');
      
      // Complete transition
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionPhase('idle');
      }, 700);
    }, 500);
  }, [isTransitioning, router]);

  // Smooth easing curves
  const smoothEase = [0.4, 0, 0.2, 1] as const;
  const bounceEase = [0.68, -0.6, 0.32, 1.6] as const;

  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}
      
      {/* Full-screen Transition Overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <>
            {/* Gradient curtain sliding up */}
            <motion.div
              className="fixed inset-0 z-[100] pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #581c87 75%, #1e1b4b 100%)',
              }}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ 
                duration: 0.5, 
                ease: smoothEase,
              }}
            />

            {/* Secondary gradient layer for depth */}
            <motion.div
              className="fixed inset-0 z-[100] pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 60%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.4, 
                ease: 'easeInOut',
              }}
            />

            {/* Animated grid pattern overlay */}
            <motion.div
              className="fixed inset-0 z-[101] pointer-events-none opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 0.1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: smoothEase }}
            />

            {/* Floating orbs with smoother motion */}
            {[...Array(5)].map((_, i) => {
              const colors = [
                'rgba(167, 139, 250, 0.6)',
                'rgba(244, 114, 182, 0.5)',
                'rgba(96, 165, 250, 0.6)',
                'rgba(192, 132, 252, 0.5)',
                'rgba(251, 191, 36, 0.4)',
              ];
              const positions = [
                { x: -30, y: -20 },
                { x: 40, y: -30 },
                { x: -35, y: 35 },
                { x: 45, y: 25 },
                { x: 0, y: 40 },
              ];
              
              return (
                <motion.div
                  key={i}
                  className="fixed z-[101] rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${colors[i]} 0%, transparent 70%)`,
                    width: 120 + i * 40,
                    height: 120 + i * 40,
                    left: '50%',
                    top: '50%',
                    filter: 'blur(1px)',
                  }}
                  initial={{ 
                    x: '-50%',
                    y: '-50%',
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{ 
                    x: `calc(-50% + ${positions[i].x}%)`,
                    y: `calc(-50% + ${positions[i].y}%)`,
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{ 
                    scale: 0.5,
                    opacity: 0,
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: i * 0.06,
                    ease: smoothEase,
                  }}
                />
              );
            })}

            {/* Center content with smooth reveal */}
            <motion.div
              className="fixed inset-0 z-[102] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div className="text-white text-center relative">
                {/* Logo heart with pulse */}
                <motion.div
                  className="relative mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: bounceEase,
                    delay: 0.1
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.15, 1],
                    }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Heart className="w-16 h-16 text-pink-400 fill-pink-400 mx-auto drop-shadow-2xl" />
                  </motion.div>
                  
                  {/* Pulse rings */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full border-2 border-pink-400/30"
                        animate={{
                          scale: [1, 2, 2.5],
                          opacity: [0.6, 0.2, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: 'easeOut',
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Text with staggered reveal */}
                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: smoothEase }}
                >
                  InnerHue
                </motion.h2>

                {/* Loading dots */}
                <motion.div
                  className="flex justify-center gap-2 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/60"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Subtle sparkle particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="fixed z-[101] pointer-events-none"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2 + i * 0.1,
                  ease: 'easeOut',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white" className="drop-shadow-lg">
                  <path d="M10 0L11.5 8.5L20 10L11.5 11.5L10 20L8.5 11.5L0 10L8.5 8.5L10 0Z" />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
