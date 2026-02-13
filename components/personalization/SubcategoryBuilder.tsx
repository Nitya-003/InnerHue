'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Lightbulb } from 'lucide-react';
import { MoodSubcategory, subcategorySuggestions } from '@/lib/personalizationTypes';

interface SubcategoryBuilderProps {
  parentMoodId: string;
  parentMoodName: string;
  parentMoodEmoji: string;
  parentMoodColor: string;
  existingSubcategories: MoodSubcategory[];
  onAdd: (subcategory: Omit<MoodSubcategory, 'id' | 'createdAt'>) => void;
  onRemove: (id: string) => void;
}

const commonEmojis = ['💼', '💰', '❤️', '🏥', '📚', '🏠', '👥', '🎯', '⚡', '🌙', '☀️', '🎭'];

export function SubcategoryBuilder({
  parentMoodId,
  parentMoodName,
  parentMoodEmoji,
  parentMoodColor,
  existingSubcategories,
  onAdd,
  onRemove,
}: SubcategoryBuilderProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const suggestions = subcategorySuggestions[parentMoodId] || [];
  const unusedSuggestions = suggestions.filter(
    (s) => !existingSubcategories.some((e) => e.name.toLowerCase() === s.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    onAdd({
      name: newName.trim(),
      parentMoodId,
      emoji: newEmoji || undefined,
      description: newDescription.trim() || undefined,
    });
    
    setNewName('');
    setNewEmoji('');
    setNewDescription('');
    setIsAdding(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAdd({
      name: suggestion,
      parentMoodId,
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{parentMoodEmoji}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{parentMoodName} Subcategories</h3>
            <p className="text-sm text-white/60">Define specific variations</p>
          </div>
        </div>
        <span className="text-sm text-white/50">{existingSubcategories.length} custom</span>
      </div>

      {/* Existing Subcategories */}
      {existingSubcategories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <AnimatePresence>
            {existingSubcategories.map((sub) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 border border-white/20"
                style={{ borderColor: `${parentMoodColor}40` }}
              >
                {sub.emoji && <span>{sub.emoji}</span>}
                <span className="text-white text-sm font-medium">{sub.name}</span>
                <button
                  onClick={() => onRemove(sub.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/20 transition-all"
                  aria-label={`Remove ${sub.name}`}
                >
                  <X className="w-3 h-3 text-white/70" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Suggestions */}
      {unusedSuggestions.length > 0 && !isAdding && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.slice(0, 5).map((suggestion) => (
              <motion.button
                key={suggestion}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-dashed border-white/20 text-white/70 text-sm hover:bg-white/10 hover:border-white/30 transition-all"
              >
                + {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Add New Form */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm text-white/70 mb-2">Name *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`e.g., "Work ${parentMoodName}"`}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Emoji (optional)</label>
              <div className="flex gap-2 flex-wrap">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewEmoji(newEmoji === emoji ? '' : emoji)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      newEmoji === emoji
                        ? 'bg-white/30 ring-2 ring-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Description (optional)</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe when you feel this way..."
                rows={2}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Subcategory
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsAdding(false);
                  setNewName('');
                  setNewEmoji('');
                  setNewDescription('');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:border-white/40 hover:text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Custom Subcategory</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
