'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

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
      }, 800);
    }, 600);
  }, [isTransitioning, router]);

  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}
      
      {/* Full-screen Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Main expanding circle from center */}
            <motion.div
              className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <motion.div
                className="rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(236, 72, 153, 1) 50%, rgba(59, 130, 246, 1) 100%)',
                }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ 
                  width: '300vmax', 
                  height: '300vmax', 
                  opacity: 1,
                }}
                exit={{ 
                  opacity: 0,
                  scale: 1.2,
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.76, 0, 0.24, 1],
                }}
              />
            </motion.div>

            {/* Floating orbs during transition */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="fixed z-[101] rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${
                    ['rgba(167, 139, 250, 0.8)', 'rgba(244, 114, 182, 0.8)', 'rgba(96, 165, 250, 0.8)', 
                     'rgba(192, 132, 252, 0.8)', 'rgba(251, 113, 133, 0.8)', 'rgba(125, 211, 252, 0.8)'][i]
                  } 0%, transparent 70%)`,
                  width: 100 + i * 30,
                  height: 100 + i * 30,
                }}
                initial={{ 
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                  scale: 0,
                  opacity: 0,
                }}
                animate={{ 
                  left: `${20 + (i * 12)}%`,
                  top: `${15 + (i * 14)}%`,
                  scale: 1,
                  opacity: [0, 1, 0.8],
                  rotate: 360,
                }}
                exit={{ 
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Center logo/text during transition */}
            <motion.div
              className="fixed inset-0 z-[102] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div
                className="text-white text-center"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  ✨
                </motion.div>
                <motion.p
                  className="text-xl font-light tracking-widest opacity-90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  EXPLORING...
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Particle burst effect */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="fixed z-[101] w-2 h-2 rounded-full bg-white pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{ 
                  x: Math.cos((i * 30) * Math.PI / 180) * 200,
                  y: Math.sin((i * 30) * Math.PI / 180) * 200,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
