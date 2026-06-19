'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Track scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Clean up
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-7 z-50 p-3 rounded-full bg-card/85 dark:bg-white/20 backdrop-blur-md border border-border dark:border-white/30 shadow-lg hover:bg-card dark:hover:bg-white/30 hover:scale-110 transition-all duration-200 group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 text-foreground group-hover:text-foreground/90 dark:text-white/90 dark:group-hover:text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
