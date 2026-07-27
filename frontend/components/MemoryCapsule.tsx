"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Lock, Unlock, Sparkles, Clock, Heart } from 'lucide-react';
import { useMemoryCapsules } from '@/hooks/useMemoryCapsules';
import { MemoryCapsuleForm } from './MemoryCapsuleForm';
import { MemoryCapsuleArchive } from './MemoryCapsuleArchive';

export function MemoryCapsule() {
  const { capsules, addCapsule, updateCapsuleReflection, deleteCapsule, stats } =
    useMemoryCapsules();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-purple-500/20 text-indigo-600 dark:text-purple-300 border border-indigo-500/20 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Emotional Memory Capsule</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground dark:text-white tracking-tight leading-tight">
          Write a message to your future self
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Lock away your thoughts, hopes, and present emotions. When your unlock date arrives, open your capsule and reflect on how far you&apos;ve come.
        </p>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.35)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-base shadow-xl flex items-center gap-2.5 mx-auto group transition-all duration-300"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create New Capsule</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        {/* Total Capsules */}
        <div className="p-5 rounded-3xl bg-card/75 dark:bg-white/5 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Capsules
            </div>
          </div>
        </div>

        {/* Locked Capsules */}
        <div className="p-5 rounded-3xl bg-card/75 dark:bg-white/5 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground dark:text-white">
              {stats.locked}
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Locked Capsules
            </div>
          </div>
        </div>

        {/* Unlocked Capsules */}
        <div className="p-5 rounded-3xl bg-card/75 dark:bg-white/5 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Unlock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground dark:text-white">
              {stats.unlocked}
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Unlocked & Reflected
            </div>
          </div>
        </div>
      </motion.div>

      {/* Archive & Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <MemoryCapsuleArchive
          capsules={capsules}
          onDeleteCapsule={deleteCapsule}
          onSaveReflection={updateCapsuleReflection}
          onCreateClick={() => setIsFormOpen(true)}
        />
      </motion.div>

      {/* Creation Modal Form */}
      <MemoryCapsuleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={addCapsule}
      />
    </div>
  );
}
