"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Sparkles,
  Calendar as CalendarIcon,
  Tag,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { CreateCapsuleInput } from '@/lib/memoryCapsule';
import { getPresetUnlockDate, isFutureDate } from '@/lib/dateHelpers';

const moodOptions = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A' },
  { id: 'peaceful', name: 'Peaceful', emoji: '🕊️', color: '#4FC3F7' },
  { id: 'hopeful', name: 'Hopeful', emoji: '🌟', color: '#FFCA28' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: '#26A69A' },
  { id: 'energized', name: 'Energized', emoji: '⚡', color: '#FFEB3B' },
  { id: 'content', name: 'Content', emoji: '😊', color: '#AED581' },
  { id: 'inspired', name: 'Inspired', emoji: '💡', color: '#FFD740' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5' },
  { id: 'stressed', name: 'Stressed', emoji: '😤', color: '#FF5722' },
  { id: 'lonely', name: 'Lonely', emoji: '😔', color: '#7E57C2' },
];

interface MemoryCapsuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCapsuleInput) => void;
}

export function MemoryCapsuleForm({
  isOpen,
  onClose,
  onSubmit,
}: MemoryCapsuleFormProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [currentMood, setCurrentMood] = useState('hopeful');
  const [unlockDate, setUnlockDate] = useState(() => getPresetUnlockDate('1w'));
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSealing, setIsSealing] = useState(false);

  const TITLE_LIMIT = 60;
  const MESSAGE_LIMIT = 1000;

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePresetSelect = (preset: '1d' | '1w' | '1m' | '6m' | '1y') => {
    setUnlockDate(getPresetUnlockDate(preset));
    setErrors((prev) => ({ ...prev, unlockDate: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.length > TITLE_LIMIT) {
      newErrors.title = `Title cannot exceed ${TITLE_LIMIT} characters.`;
    }

    if (!message.trim()) {
      newErrors.message = 'Future message is required.';
    } else if (message.length > MESSAGE_LIMIT) {
      newErrors.message = `Message cannot exceed ${MESSAGE_LIMIT} characters.`;
    }

    if (!currentMood) {
      newErrors.currentMood = 'Please select your current mood.';
    }

    if (!unlockDate) {
      newErrors.unlockDate = 'Unlock date is required.';
    } else if (!isFutureDate(unlockDate)) {
      newErrors.unlockDate = 'Unlock date must be in the future.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Trigger sealing animation sequence
    setIsSealing(true);

    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        message: message.trim(),
        currentMood,
        unlockDate,
        tags,
      });

      setIsSealing(false);
      // Reset form
      setTitle('');
      setMessage('');
      setCurrentMood('hopeful');
      setUnlockDate(getPresetUnlockDate('1w'));
      setTags([]);
      setTagInput('');
      setErrors({});
      onClose();
    }, 1200);
  };

  // Convert ISO string to datetime-local format for input
  const getDatetimeLocalValue = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card/95 dark:bg-slate-900/95 border border-border/80 dark:border-white/20 shadow-2xl p-6 sm:p-8"
        >
          {/* Sealing Overlay Animation */}
          {isSealing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 rounded-3xl bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center gap-4 text-center p-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Sealing Capsule...</h4>
                <p className="text-sm text-gray-300">
                  Your message is being safely locked away for your future self.
                </p>
              </div>
            </motion.div>
          )}

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-border/60 dark:border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-purple-500/20 text-indigo-600 dark:text-purple-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground dark:text-white">
                  Create Memory Capsule
                </h3>
                <p className="text-xs text-muted-foreground">
                  Send a thoughtful message to your future self.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-card dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Capsule Title <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {title.length}/{TITLE_LIMIT}
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="e.g., A Message to Me in 6 Months"
                className="w-full px-4 py-3 rounded-2xl bg-background/80 dark:bg-white/5 border border-border dark:border-white/15 text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
              {errors.title && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Current Mood Grid */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Current Mood <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {moodOptions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCurrentMood(m.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all border ${
                      currentMood === m.id
                        ? 'bg-indigo-600/15 dark:bg-purple-500/25 border-indigo-500 text-foreground dark:text-white shadow-md scale-105'
                        : 'bg-background/60 dark:bg-white/5 border-border/70 dark:border-white/10 text-muted-foreground hover:bg-card'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[11px] font-medium capitalize">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Future Message Textarea */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Future Message <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {message.length}/{MESSAGE_LIMIT}
                </span>
              </div>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                }}
                placeholder="Write whatever you want your future self to hear. How are you feeling today? What dreams, hopes, or reminders do you want to lock away?"
                className="w-full px-4 py-3 rounded-2xl bg-background/80 dark:bg-white/5 border border-border dark:border-white/15 text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed resize-none"
              />
              {errors.message && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Unlock Date & Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Unlock Date & Time <span className="text-red-500">*</span>
              </label>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { label: '+1 Day', key: '1d' },
                  { label: '+1 Week', key: '1w' },
                  { label: '+1 Month', key: '1m' },
                  { label: '+6 Months', key: '6m' },
                  { label: '+1 Year', key: '1y' },
                ].map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => handlePresetSelect(preset.key as '1d' | '1w' | '1m' | '6m' | '1y')}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 dark:bg-purple-500/20 text-indigo-600 dark:text-purple-300 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Time Input */}
              <div className="relative">
                <input
                  type="datetime-local"
                  value={getDatetimeLocalValue(unlockDate)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      setUnlockDate(new Date(val).toISOString());
                      setErrors((prev) => ({ ...prev, unlockDate: '' }));
                    }
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-background/80 dark:bg-white/5 border border-border dark:border-white/15 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                />
              </div>
              {errors.unlockDate && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.unlockDate}</span>
                </p>
              )}
            </div>

            {/* Optional Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag e.g. goals, reflection"
                  className="flex-1 px-4 py-2 rounded-2xl bg-background/80 dark:bg-white/5 border border-border dark:border-white/15 text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  Add Tag
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-600 dark:text-purple-300 flex items-center gap-1.5 border border-indigo-500/20"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Seal Capsule</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
