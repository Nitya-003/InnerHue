"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Calendar,
  Tag,
  Trash2,
  Eye,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { MemoryCapsule, CapsuleReflection } from '@/lib/memoryCapsule';
import { formatDisplayDate, formatDateTime } from '@/lib/dateHelpers';
import { MemoryCapsuleCountdown } from './MemoryCapsuleCountdown';
import { MemoryCapsuleComparison } from './MemoryCapsuleComparison';
import { MoodData } from '@/lib/moodData';

interface MemoryCapsuleCardProps {
  capsule: MemoryCapsule;
  onDelete?: (id: string) => void;
  onSaveReflection?: (id: string, reflection: CapsuleReflection) => void;
}

export function MemoryCapsuleCard({
  capsule,
  onDelete,
  onSaveReflection,
}: MemoryCapsuleCardProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(capsule.isUnlocked);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  // Derive mood emoji & color
  const allMoods = MoodData.getAllMoods ? MoodData.getAllMoods() : [];
  const moodInfo = allMoods.find(
    (m) => m.id.toLowerCase() === capsule.currentMood.toLowerCase()
  ) || {
    id: capsule.currentMood,
    name: capsule.currentMood,
    emoji: '💭',
    color: '#8B5CF6',
  };

  const handleUnlockEvent = () => {
    setIsUnlocked(true);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={`relative group rounded-3xl backdrop-blur-2xl transition-all duration-500 overflow-hidden border ${
        isUnlocked
          ? 'bg-card/75 dark:bg-white/10 border-indigo-500/30 dark:border-indigo-400/30 shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.25)]'
          : 'bg-card/65 dark:bg-white/5 border-border/80 dark:border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
      }`}
    >
      {/* Background Ambient Glow */}
      <div
        className={`absolute -inset-1 opacity-20 group-hover:opacity-35 transition-opacity duration-500 blur-2xl pointer-events-none -z-10 ${
          isUnlocked ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-amber-500/30'
        }`}
      />

      <div className="p-6 sm:p-7 space-y-5">
        {/* Top Bar: Status Badge, Title, Delete Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mood Badge */}
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                style={{ backgroundColor: `${moodInfo.color}25`, color: moodInfo.color }}
              >
                <span>{moodInfo.emoji}</span>
                <span className="capitalize">{moodInfo.name}</span>
              </span>

              {/* Lock Status Badge */}
              {isUnlocked ? (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                >
                  <Unlock className="w-3 h-3 text-emerald-500" />
                  <span>Unlocked</span>
                </motion.span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500 animate-pulse" />
                  <span>Locked</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white tracking-tight leading-snug">
              {capsule.title}
            </h3>
          </div>

          {/* Delete Action */}
          {onDelete && (
            <div className="flex items-center gap-1">
              {showConfirmDelete ? (
                <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded-xl border border-red-500/30">
                  <button
                    onClick={() => onDelete(capsule.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-2 py-1 bg-card dark:bg-white/10 text-xs font-medium rounded-lg text-foreground dark:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Delete Capsule"
                  aria-label="Delete capsule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Timestamps Section */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground dark:text-gray-300 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Created: {formatDisplayDate(capsule.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Unlock className="w-3.5 h-3.5 text-purple-500" />
            <span>Unlock Date: {formatDateTime(capsule.unlockDate)}</span>
          </div>
        </div>

        {/* Countdown Area (For Locked Capsules) */}
        {!isUnlocked && (
          <div className="pt-2">
            <MemoryCapsuleCountdown
              unlockDate={capsule.unlockDate}
              onUnlock={handleUnlockEvent}
            />
          </div>
        )}

        {/* Message Content & Animation */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-4 pt-3 border-t border-border/60 dark:border-white/10"
            >
              {/* Unlocked Message Container */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 border border-indigo-500/20 shadow-inner space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Message from Your Past Self</span>
                </div>
                <p className="text-base text-foreground dark:text-white/95 leading-relaxed whitespace-pre-wrap font-serif">
                  {capsule.message}
                </p>
              </motion.div>

              {/* Reflection & Comparison Component */}
              <div className="pt-2">
                <MemoryCapsuleComparison
                  pastMood={capsule.currentMood}
                  savedReflection={capsule.reflection}
                  onSaveReflection={(ref) => {
                    if (onSaveReflection) {
                      onSaveReflection(capsule.id, ref);
                    }
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags Footer */}
        {capsule.tags && capsule.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            {capsule.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-background/80 dark:bg-white/10 text-muted-foreground border border-border/50 dark:border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* View Details / Expand Button (for locked capsules or detailed view) */}
        {!isUnlocked && (
          <div className="pt-2 text-center border-t border-border/40 dark:border-white/5">
            <button
              onClick={handleToggleExpand}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline py-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'Hide Details' : 'View Capsule Details'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-200 text-left space-y-2"
              >
                <p className="font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  Message Sealed
                </p>
                <p className="text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                  This memory is safely locked until {formatDateTime(capsule.unlockDate)}. When the unlock time arrives, the message will reveal itself automatically with an emotional reflection prompt.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
