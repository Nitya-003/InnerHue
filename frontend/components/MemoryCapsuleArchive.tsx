"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Lock, Unlock, Sparkles, Inbox } from 'lucide-react';
import { MemoryCapsule, CapsuleReflection, filterCapsules } from '@/lib/memoryCapsule';
import { MemoryCapsuleCard } from './MemoryCapsuleCard';

const moodFilterOptions = [
  { id: 'all', label: 'All Moods' },
  { id: 'happy', label: 'Happy 😊' },
  { id: 'calm', label: 'Calm 😌' },
  { id: 'hopeful', label: 'Hopeful 🌟' },
  { id: 'grateful', label: 'Grateful 🙏' },
  { id: 'peaceful', label: 'Peaceful 🕊️' },
  { id: 'energized', label: 'Energized ⚡' },
  { id: 'anxious', label: 'Anxious 😰' },
  { id: 'sad', label: 'Sad 😢' },
  { id: 'stressed', label: 'Stressed 😤' },
];

interface MemoryCapsuleArchiveProps {
  capsules: MemoryCapsule[];
  onDeleteCapsule?: (id: string) => void;
  onSaveReflection?: (id: string, reflection: CapsuleReflection) => void;
  onCreateClick?: () => void;
}

export function MemoryCapsuleArchive({
  capsules,
  onDeleteCapsule,
  onSaveReflection,
  onCreateClick,
}: MemoryCapsuleArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [selectedMood, setSelectedMood] = useState('all');

  const filteredCapsules = useMemo(() => {
    return filterCapsules(capsules, searchQuery, statusFilter, selectedMood);
  }, [capsules, searchQuery, statusFilter, selectedMood]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-card/75 dark:bg-white/5 backdrop-blur-2xl border border-border/80 dark:border-white/15 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capsules by title, message, or #tags..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-background/80 dark:bg-white/10 border border-border dark:border-white/15 text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="md:col-span-3 flex items-center gap-1 bg-background/80 dark:bg-white/10 p-1 rounded-2xl border border-border dark:border-white/15">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${
                statusFilter === 'locked'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-amber-500'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${
                statusFilter === 'unlocked'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-emerald-500'
              }`}
            >
              <Unlock className="w-3 h-3" />
              <span>Unlocked</span>
            </button>
          </div>

          {/* Mood Selector Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full pl-11 pr-8 py-3 rounded-2xl bg-background/80 dark:bg-white/10 border border-border dark:border-white/15 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium appearance-none cursor-pointer"
              >
                {moodFilterOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-card dark:bg-slate-900 text-foreground dark:text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Capsules */}
      {filteredCapsules.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredCapsules.map((capsule) => (
              <MemoryCapsuleCard
                key={capsule.id}
                capsule={capsule}
                onDelete={onDeleteCapsule}
                onSaveReflection={onSaveReflection}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-6 rounded-3xl bg-card/65 dark:bg-white/5 border border-border/80 dark:border-white/10 backdrop-blur-xl max-w-lg mx-auto space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 dark:bg-purple-500/20 text-indigo-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-foreground dark:text-white">
              No Memory Capsules Found
            </h4>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' || selectedMood !== 'all'
                ? 'Try adjusting your search query or filter criteria.'
                : 'Write your first message to your future self and lock it in a capsule!'}
            </p>
          </div>
          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              Create New Capsule
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
