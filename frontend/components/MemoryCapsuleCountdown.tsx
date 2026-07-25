"use client";

import { useState, useEffect } from 'react';
import { calculateCountdown, CountdownTime } from '@/lib/dateHelpers';
import { Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MemoryCapsuleCountdownProps {
  unlockDate: string;
  onUnlock?: () => void;
  compact?: boolean;
  className?: string;
}

export function MemoryCapsuleCountdown({
  unlockDate,
  onUnlock,
  compact = false,
  className = '',
}: MemoryCapsuleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(() => calculateCountdown(unlockDate));

  useEffect(() => {
    // Initial check
    const initial = calculateCountdown(unlockDate);
    setTimeLeft(initial);
    if (initial.isUnlocked && onUnlock) {
      onUnlock();
      return;
    }

    const interval = setInterval(() => {
      const current = calculateCountdown(unlockDate);
      setTimeLeft(current);

      if (current.isUnlocked) {
        clearInterval(interval);
        if (onUnlock) {
          onUnlock();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockDate, onUnlock]);

  if (timeLeft.isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Unlocked</span>
      </motion.div>
    );
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-300 font-medium ${className}`}>
        <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
        <span>{timeLeft.formatted}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-300">
        <Clock className="w-4 h-4 animate-pulse text-amber-500" />
        <span>Unlocks in</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
        <div className="bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur border border-amber-500/20 rounded-xl p-2">
          <div className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-200">
            {timeLeft.days}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-amber-600/80 dark:text-amber-300/70 font-semibold">
            Days
          </div>
        </div>
        <div className="bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur border border-amber-500/20 rounded-xl p-2">
          <div className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-200">
            {timeLeft.hours}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-amber-600/80 dark:text-amber-300/70 font-semibold">
            Hours
          </div>
        </div>
        <div className="bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur border border-amber-500/20 rounded-xl p-2">
          <div className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-200">
            {timeLeft.minutes}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-amber-600/80 dark:text-amber-300/70 font-semibold">
            Mins
          </div>
        </div>
        <div className="bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur border border-amber-500/20 rounded-xl p-2">
          <div className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-200">
            {timeLeft.seconds}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-amber-600/80 dark:text-amber-300/70 font-semibold">
            Secs
          </div>
        </div>
      </div>
    </div>
  );
}
