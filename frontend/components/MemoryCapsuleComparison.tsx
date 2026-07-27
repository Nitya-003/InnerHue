"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowDown, Sparkles, Save, Edit2, CheckCircle2 } from 'lucide-react';
import { CapsuleReflection } from '@/lib/memoryCapsule';
import { MoodData } from '@/lib/moodData';

const popularMoods = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A' },
  { id: 'peaceful', name: 'Peaceful', emoji: '🕊️', color: '#4FC3F7' },
  { id: 'hopeful', name: 'Hopeful', emoji: '🌟', color: '#FFCA28' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: '#26A69A' },
  { id: 'energized', name: 'Energized', emoji: '⚡', color: '#FFEB3B' },
  { id: 'content', name: 'Content', emoji: '😊', color: '#AED581' },
  { id: 'inspired', name: 'Inspired', emoji: '💡', color: '#FFD740' },
  { id: 'thoughtful', name: 'Thoughtful', emoji: '🤔', color: '#9C27B0' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043' },
  { id: 'stressed', name: 'Stressed', emoji: '😤', color: '#FF5722' },
];

interface MemoryCapsuleComparisonProps {
  pastMood: string;
  savedReflection?: CapsuleReflection;
  onSaveReflection: (reflection: CapsuleReflection) => void;
  className?: string;
}

export function MemoryCapsuleComparison({
  pastMood,
  savedReflection,
  onSaveReflection,
  className = '',
}: MemoryCapsuleComparisonProps) {
  const [selectedMood, setSelectedMood] = useState<string>(
    savedReflection?.currentMood || 'calm'
  );
  const [reflectionText, setReflectionText] = useState<string>(
    savedReflection?.text || ''
  );
  const [isEditing, setIsEditing] = useState<boolean>(!savedReflection);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Helper to find mood details
  const getMoodInfo = (moodId: string) => {
    const allMoods = MoodData.getAllMoods ? MoodData.getAllMoods() : [];
    const found = allMoods.find((m) => m.id.toLowerCase() === moodId.toLowerCase());
    if (found) return found;

    const fallback = popularMoods.find((m) => m.id.toLowerCase() === moodId.toLowerCase());
    if (fallback) return fallback;

    return {
      id: moodId,
      name: moodId.charAt(0).toUpperCase() + moodId.slice(1),
      emoji: '💭',
      color: '#8B5CF6',
    };
  };

  const pastMoodInfo = getMoodInfo(pastMood);
  const currentMoodInfo = getMoodInfo(selectedMood);

  const handleSave = () => {
    if (!reflectionText.trim()) return;
    setIsSaving(true);

    setTimeout(() => {
      onSaveReflection({
        currentMood: selectedMood,
        text: reflectionText.trim(),
        createdAt: new Date().toISOString(),
      });
      setIsSaving(false);
      setIsEditing(false);
    }, 300);
  };

  return (
    <div
      className={`rounded-2xl p-5 md:p-6 bg-card/80 dark:bg-white/5 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-lg space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500 dark:text-purple-400" />
          <h4 className="text-base sm:text-lg font-semibold text-foreground dark:text-white">
            Emotional Reflection
          </h4>
        </div>
        {savedReflection && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-purple-300 hover:underline"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Reflection</span>
          </button>
        )}
      </div>

      {/* Mood Transformation Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center py-2">
        {/* Past Mood */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="p-4 rounded-xl bg-background/60 dark:bg-white/5 border border-border/60 dark:border-white/10 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Past Mood (Creation)
          </span>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
            style={{ backgroundColor: `${pastMoodInfo.color}33`, borderColor: pastMoodInfo.color }}
          >
            {pastMoodInfo.emoji}
          </div>
          <span className="text-sm font-medium text-foreground dark:text-white capitalize">
            {pastMoodInfo.name}
          </span>
        </motion.div>

        {/* Transition Indicator */}
        <div className="flex flex-col items-center justify-center gap-1 text-indigo-500 dark:text-purple-400">
          <ArrowDown className="w-6 h-6 animate-bounce" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Shift Over Time
          </span>
        </div>

        {/* Present Mood */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="p-4 rounded-xl bg-background/60 dark:bg-white/5 border border-border/60 dark:border-white/10 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Current Feeling
          </span>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md transition-colors"
            style={{ backgroundColor: `${currentMoodInfo.color}33`, borderColor: currentMoodInfo.color }}
          >
            {currentMoodInfo.emoji}
          </div>
          <span className="text-sm font-medium text-foreground dark:text-white capitalize">
            {currentMoodInfo.name}
          </span>
        </motion.div>
      </div>

      {/* Editing Mode vs Saved Display */}
      {isEditing ? (
        <div className="space-y-4 pt-2 border-t border-border/60 dark:border-white/10">
          {/* Mood Selection Picker */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Select Your Current Mood:
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 scrollbar-thin">
              {popularMoods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMood(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                    selectedMood === m.id
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'bg-background/80 dark:bg-white/10 text-foreground dark:text-white hover:bg-card border border-border/70 dark:border-white/10'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt & Reflection Note Input */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              How have your feelings changed?
            </label>
            <textarea
              rows={3}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Reflect on your emotional evolution since this capsule was locked..."
              className="w-full px-4 py-3 rounded-xl bg-background/80 dark:bg-black/30 border border-border dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            {savedReflection && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!reflectionText.trim() || isSaving}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md flex items-center gap-1.5 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Reflection'}</span>
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="pt-3 border-t border-border/60 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Reflection Saved</span>
          </div>
          <p className="text-sm text-foreground dark:text-white/90 italic bg-background/50 dark:bg-white/5 p-4 rounded-xl border border-border/50 dark:border-white/10 leading-relaxed">
            &ldquo;{savedReflection?.text}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
