"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw } from "lucide-react";

const quotes = [
  "You are enough just as you are.",
  "Breathe. This too shall pass.",
  "Your feelings are valid.",
  "One day at a time.",
  "You are stronger than you know.",
  "Peace comes from within.",
  "It is okay to rest.",
  "Small steps are still progress.",
  "Protect your peace.",
  "You deserve happiness.",
  "Inhale courage, exhale fear.",
  "Your potential is endless.",
  "Focus on the present moment."
];

export function QuoteCard() {
  const [quote, setQuote] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  // Set initial quote on mount to avoid hydration mismatch
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const getNewQuote = () => {
    setIsSpinning(true);
    let newQuote = quote;
    // Ensure we get a different quote than the current one
    while (newQuote === quote) {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setQuote(newQuote);
    setTimeout(() => setIsSpinning(false), 500);
  };

  if (!quote) return null; // Prevent hydration flicker

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl mb-8 relative overflow-hidden shadow-lg mx-4 md:mx-0"
    >
      <div className="absolute top-0 right-0 p-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-4">
          <div className="bg-purple-500/20 p-3 rounded-xl hidden sm:block">
            <Quote className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-gray-300 text-xs md:text-sm font-medium uppercase tracking-wider mb-2">Daily Affirmation</h3>
            <AnimatePresence mode="wait">
              <motion.p 
                key={quote}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-lg md:text-2xl font-semibold text-white italic leading-relaxed"
              >
                "{quote}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={getNewQuote}
          disabled={isSpinning}
          className="p-2 hover:bg-white/10 rounded-full transition-colors group"
          aria-label="Get new quote"
        >
          <RefreshCw className={`w-5 h-5 text-gray-400 group-hover:text-white transition-all ${isSpinning ? "animate-spin" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}