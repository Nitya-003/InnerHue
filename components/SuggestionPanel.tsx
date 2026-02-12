'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Quote, Hash, Music, Wind, Target, Play } from 'lucide-react';
import toast from 'react-hot-toast';

interface SuggestionPanelProps {
  suggestions: {
    prompt: string;
    quote: string;
    author: string;
    keywords: string[];
    music: string;
    breathing?: {
      technique: string;
      steps: string[];
      cycles: number;
      intervalSeconds: number;
    };
    actionItem?: {
      title: string;
      description: string;
      timeEstimate: string;
    };
  };
  mood: any;
  onRefresh: () => void | Promise<void>;
  isRefreshing?: boolean;
}

export function SuggestionPanel({ suggestions, mood, onRefresh, isRefreshing = false }: SuggestionPanelProps) {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false);
  
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsPlayerLoaded(false);
    setBreathingActive(false);
    setBreathingStep(0);
    setActionCompleted(false);
    
    // Cleanup timers when mood changes
    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
      if (breathingTimeoutRef.current) {
        clearTimeout(breathingTimeoutRef.current);
      }
    };
  }, [mood.id]);

  const handleCopy = () => {
    const textToCopy = `"${suggestions.quote}" — ${suggestions.author}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success('Quote copied to clipboard!');
  };

  const startBreathing = () => {
    if (!suggestions.breathing || breathingActive) return;
    
    // Clear any existing timers first
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
    }
    if (breathingTimeoutRef.current) {
      clearTimeout(breathingTimeoutRef.current);
    }
    
    setBreathingActive(true);
    setBreathingStep(0);
    
    const { cycles, intervalSeconds, steps } = suggestions.breathing;
    const intervalMs = intervalSeconds * 1000;
    const totalDurationMs = cycles * intervalMs;
    
    const cycleSteps = () => {
      setBreathingStep(prev => (prev + 1) % steps.length);
    };
    
    breathingIntervalRef.current = setInterval(cycleSteps, intervalMs);
    
    breathingTimeoutRef.current = setTimeout(() => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
      setBreathingActive(false);
      toast.success('Breathing exercise completed! 🌸');
    }, totalDurationMs);
  };

  const handleActionComplete = () => {
    setActionCompleted((prev) => {
      const next = !prev;
      toast.success(prev ? 'Action unmarked!' : 'Great job completing this action! ✨');
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-pink-100">
            <Quote className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Inspirational Quote</h4>
            <blockquote className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-2">
              &ldquo;{suggestions.quote}&rdquo;
            </blockquote>
            <cite className="text-sm text-gray-500 dark:text-gray-400">— {suggestions.author}</cite>
          </div>
        </div>
      </motion.div>

      {/* Journal Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <MessageCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Journal Prompt</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{suggestions.prompt}</p>
          </div>
        </div>
      </motion.div>

        {/* Breathing Exercise */}
        {suggestions.breathing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-cyan-100">
                <Wind className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">Breathing Exercise</h4>
                <p className="text-gray-700 mb-3">{suggestions.breathing.technique}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Duration: {suggestions.breathing.cycles} cycles × {suggestions.breathing.intervalSeconds}s 
                  ({Math.floor((suggestions.breathing.cycles * suggestions.breathing.intervalSeconds) / 60)}min {(suggestions.breathing.cycles * suggestions.breathing.intervalSeconds) % 60}s)
                </p>
                
                {breathingActive ? (
                  <div className="space-y-4">
                    <motion.div
                      key={breathingStep}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200"
                    >
                      <p className="text-lg font-medium text-cyan-800 text-center">
                        {suggestions.breathing.steps[breathingStep]}
                      </p>
                    </motion.div>
                    <div className="flex justifysuggestions.breathing.intervalSecondscenter">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-30"
                      />
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startBreathing}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Breathing</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Item */}
        {suggestions.actionItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">{suggestions.actionItem.title}</h4>
                <p className="text-gray-700 mb-3">{suggestions.actionItem.description}</p>
                <p className="text-sm text-gray-500 mb-4">⏱️ {suggestions.actionItem.timeEstimate}</p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleActionComplete}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    actionCompleted
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    actionCompleted ? 'bg-white border-white' : 'border-white'
                  } flex items-center justify-center`}>
                    {actionCompleted && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                  </div>
                  <span>{actionCompleted ? 'Completed!' : 'Mark as Done'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

      {/* Keywords Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Hash className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Emotion Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.keywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium hover:shadow-sm transition-all cursor-default"
                  style={{
                    background: `linear-gradient(135deg, ${mood.color}20, ${mood.glow}20)`
                  }}
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Music Soundscape (Spotify) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-green-100">
            <Music className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 space-y-3">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Soundscape</h4>

            <div className="relative w-full h-[152px] rounded-xl overflow-hidden bg-white/50 backdrop-blur-md shadow-inner border border-white/20">
              {!isPlayerLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur animate-pulse">
                  <div className="flex flex-col items-center space-y-2">
                    <Music className="w-8 h-8 text-green-400/50 animate-bounce" />
                    <span className="text-gray-500 text-sm font-medium">Loading Soundscape...</span>
                  </div>
                </div>
              )}
              <iframe
                src={`https://open.spotify.com/embed/playlist/${mood.spotifyPlaylistId || '37i9dQZF1DX3Ogo9pFno96'}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className={`w-full h-full transition-opacity duration-500 ${isPlayerLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsPlayerLoaded(true)}
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              <span className="font-medium text-green-600">Suggested:</span> {suggestions.music}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
