'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Calendar, Clock, MessageSquare } from 'lucide-react';
import { MoodEntry } from '@/lib/useMoodStore';
import { MoodData } from '@/lib/moodData';

interface EmotionTimelineReplayProps {
  moodHistory: MoodEntry[];
}

export function EmotionTimelineReplay({ moodHistory }: EmotionTimelineReplayProps) {
  // Sort history chronologically (oldest first, newest last)
  const sortedHistory = useMemo(() => {
    return [...moodHistory].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [moodHistory]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index if history changes/decreases
  useEffect(() => {
    if (currentIndex >= sortedHistory.length) {
      setCurrentIndex(Math.max(0, sortedHistory.length - 1));
    }
  }, [sortedHistory.length, currentIndex]);

  // Automatic playback effect
  useEffect(() => {
    if (!isPlaying || sortedHistory.length <= 1) return;

    const delay = speed === 2 ? 1000 : 2000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= sortedHistory.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => clearInterval(timer);
  }, [isPlaying, speed, sortedHistory.length]);

  const activeEntry = sortedHistory[currentIndex];

  const moodDetails = useMemo(() => {
    if (!activeEntry) return null;
    const moodId = (activeEntry.emotion || activeEntry.mood || '').toLowerCase();
    const standardMood = MoodData.moods[moodId as keyof typeof MoodData.moods];
    if (standardMood) {
      return {
        name: standardMood.name,
        emoji: standardMood.emoji,
        color: activeEntry.color || standardMood.color,
        glow: standardMood.glow,
      };
    }

    const name = moodId.charAt(0).toUpperCase() + moodId.slice(1).replace(/-/g, ' ');
    return {
      name: name || 'Unknown',
      emoji: '💭',
      color: activeEntry.color || '#8b5cf6',
      glow: activeEntry.color || '#a78bfa',
    };
  }, [activeEntry]);

  if (sortedHistory.length === 0) {
    return null;
  }

  const handlePlayPause = () => {
    if (currentIndex >= sortedHistory.length - 1) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.min(sortedHistory.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlePrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const progressPercentage = sortedHistory.length > 1
    ? (currentIndex / (sortedHistory.length - 1)) * 100
    : 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-border shadow-xl w-full select-none"
      aria-label="Emotion Replay Timeline"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Interactive Journey
          </span>
          <h3 className="text-2xl font-bold text-foreground mt-0.5">
            Emotion Timeline Replay
          </h3>
        </div>

        {/* Playback Speed Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
            aria-label={`Playback speed: current speed ${speed}x. Click to change.`}
          >
            <span className="text-purple-600 dark:text-purple-400">⚡</span>
            <span>Speed: {speed}x</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.2fr] gap-6 items-center">
        {/* Replay Details Panel */}
        <div className="min-h-[220px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeEntry && moodDetails && (
              <motion.div
                key={activeEntry.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4"
              >
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <motion.div
                    animate={{
                      scale: isPlaying ? [1, 1.08, 1] : 1,
                      rotate: isPlaying ? [0, -3, 3, 0] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isPlaying ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    className="text-6xl sm:text-7xl p-4 rounded-3xl bg-white/20 dark:bg-black/20 flex items-center justify-center border border-white/10 dark:border-white/5 shadow-md"
                    style={{
                      boxShadow: `0 10px 30px ${moodDetails.color}25`,
                    }}
                  >
                    {moodDetails.emoji}
                  </motion.div>

                  <div>
                    <h4
                      className="text-3xl font-extrabold capitalize tracking-tight"
                      style={{
                        color: moodDetails.color,
                        textShadow: `0 0 25px ${moodDetails.color}35`,
                      }}
                    >
                      {moodDetails.name}
                    </h4>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-1.5 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        {formatDate(activeEntry.timestamp)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-pink-500" />
                        {formatTime(activeEntry.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {activeEntry.notes && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-full rounded-2xl bg-white/40 dark:bg-white/5 p-4 border border-black/5 dark:border-white/5 max-w-md"
                  >
                    <p className="text-sm italic text-foreground/80 leading-relaxed flex items-start gap-2.5">
                      <MessageSquare className="w-4.5 h-4.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span>{`"${activeEntry.notes}"`}</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-36 bg-border" />

        {/* Controls and Timeline Track */}
        <div className="flex flex-col gap-6 w-full">
          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={currentIndex === 0}
              className="p-3 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              title="Restart from beginning"
              aria-label="Restart replay"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              title="Step backward"
              aria-label="Previous emotional entry"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handlePlayPause}
              className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause replay' : 'Play replay'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white stroke-white" />
              ) : (
                <Play className="w-6 h-6 fill-white stroke-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === sortedHistory.length - 1}
              className="p-3 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              title="Step forward"
              aria-label="Next emotional entry"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Timeline range slider */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
              <span>Oldest Reflection</span>
              <span>
                Reflection {currentIndex + 1} of {sortedHistory.length}
              </span>
              <span>Newest Reflection</span>
            </div>

            <div className="relative flex items-center group">
              <input
                type="range"
                min={0}
                max={sortedHistory.length - 1}
                value={currentIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentIndex(Number(e.target.value));
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-purple-100 dark:bg-purple-950/40 accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                style={{
                  background: `linear-gradient(to right, #9333ea 0%, #9333ea ${progressPercentage}%, #e9d5ff ${progressPercentage}%, #e9d5ff 100%)`,
                }}
                aria-label="Timeline progress slider"
                aria-valuenow={currentIndex + 1}
                aria-valuemin={1}
                aria-valuemax={sortedHistory.length}
                aria-valuetext={activeEntry ? `${moodDetails?.name} recorded on ${formatDate(activeEntry.timestamp)}` : ''}
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground pt-1 px-1">
              <span>{formatDate(sortedHistory[0].timestamp)}</span>
              <span>{formatDate(sortedHistory[sortedHistory.length - 1].timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
