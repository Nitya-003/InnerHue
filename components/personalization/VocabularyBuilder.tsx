'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, BookOpen, Search, Check } from 'lucide-react';
import { CustomVocabulary } from '@/lib/personalizationTypes';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: string;
}

interface VocabularyBuilderProps {
  availableMoods: Mood[];
  vocabulary: CustomVocabulary[];
  onAdd: (word: Omit<CustomVocabulary, 'id' | 'createdAt'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CustomVocabulary>) => void;
}

const categoryOptions = [
  { value: 'positive', label: 'Positive', color: '#66BB6A' },
  { value: 'negative', label: 'Negative', color: '#7E57C2' },
  { value: 'neutral', label: 'Neutral', color: '#9C27B0' },
  { value: 'energetic', label: 'Energetic', color: '#FF6D00' },
  { value: 'calm', label: 'Calm', color: '#4FC3F7' },
  { value: 'stress', label: 'Stress', color: '#FF7043' },
  { value: 'intense', label: 'Intense', color: '#EF5350' },
  { value: 'playful', label: 'Playful', color: '#FF4081' },
];

const emojiSuggestions = ['💭', '✨', '🌊', '🔮', '💫', '🌸', '🎭', '💝', '🌙', '☀️', '🌈', '🦋'];

export function VocabularyBuilder({
  availableMoods,
  vocabulary,
  onAdd,
  onRemove,
  onUpdate,
}: VocabularyBuilderProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New word form state
  const [newWord, setNewWord] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [newCategory, setNewCategory] = useState<CustomVocabulary['category']>('neutral');
  const [selectedMoodIds, setSelectedMoodIds] = useState<string[]>([]);

  const filteredVocabulary = vocabulary.filter(
    (v) =>
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.definition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!newWord.trim()) return;

    onAdd({
      word: newWord.trim(),
      definition: newDefinition.trim() || undefined,
      emoji: newEmoji || undefined,
      category: newCategory,
      relatedMoodIds: selectedMoodIds,
      color: categoryOptions.find((c) => c.value === newCategory)?.color,
    });

    resetForm();
    setIsAdding(false);
  };

  const resetForm = () => {
    setNewWord('');
    setNewDefinition('');
    setNewEmoji('');
    setNewCategory('neutral');
    setSelectedMoodIds([]);
  };

  const toggleMoodSelection = (moodId: string) => {
    setSelectedMoodIds((prev) =>
      prev.includes(moodId)
        ? prev.filter((id) => id !== moodId)
        : [...prev, moodId]
    );
  };

  return (
    <div className="bg-card/80 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-border dark:border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-pink-400" />
          <div>
            <h3 className="text-lg font-semibold text-foreground dark:text-white">Emotional Vocabulary</h3>
            <p className="text-sm text-muted-foreground dark:text-white/60">Build your personal emotion dictionary</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground dark:text-white/50">{vocabulary.length} words</span>
      </div>

      {/* Search */}
      {vocabulary.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your vocabulary..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card dark:bg-white/10 border border-border dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 focus:outline-none focus:border-border dark:focus:border-white/40"
          />
        </div>
      )}

      {/* Vocabulary List */}
      {filteredVocabulary.length > 0 && (
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {filteredVocabulary.map((vocab) => (
              <motion.div
                key={vocab.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group p-3 rounded-xl bg-card/70 dark:bg-white/10 border border-border dark:border-white/15 hover:border-border/80 dark:hover:border-white/25 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {vocab.emoji && (
                      <span className="text-xl flex-shrink-0">{vocab.emoji}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-foreground dark:text-white font-medium">{vocab.word}</h4>
                        {vocab.category && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${categoryOptions.find((c) => c.value === vocab.category)?.color}30`,
                              color: categoryOptions.find((c) => c.value === vocab.category)?.color,
                            }}
                          >
                            {vocab.category}
                          </span>
                        )}
                      </div>
                      {vocab.definition && (
                        <p className="text-sm text-muted-foreground dark:text-white/60 mt-1">{vocab.definition}</p>
                      )}
                      {vocab.relatedMoodIds.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {vocab.relatedMoodIds.map((moodId) => {
                            const mood = availableMoods.find((m) => m.id === moodId);
                            return mood ? (
                              <span
                                key={moodId}
                                className="text-xs px-2 py-0.5 rounded-full bg-card dark:bg-white/10 text-foreground/80 dark:text-white/70"
                              >
                                {mood.emoji} {mood.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onRemove(vocab.id)}
                      className="p-1.5 rounded-lg hover:bg-card dark:hover:bg-white/20 transition-all"
                      aria-label={`Remove ${vocab.word}`}
                    >
                      <X className="w-4 h-4 text-muted-foreground dark:text-white/70" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {vocabulary.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground dark:text-white/50">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No custom words yet</p>
          <p className="text-sm mt-1">Start building your emotional vocabulary</p>
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
              <label className="block text-sm text-muted-foreground dark:text-white/70 mb-2">Word or Phrase *</label>
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder='e.g., "Bittersweet", "Sonder", "Hiraeth"'
                className="w-full px-4 py-2 rounded-xl bg-card dark:bg-white/10 border border-border dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 focus:outline-none focus:border-border dark:focus:border-white/40 focus:ring-2 focus:ring-border dark:focus:ring-white/20"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground dark:text-white/70 mb-2">Definition</label>
              <textarea
                value={newDefinition}
                onChange={(e) => setNewDefinition(e.target.value)}
                placeholder="What does this word mean to you?"
                rows={2}
                className="w-full px-4 py-2 rounded-xl bg-card dark:bg-white/10 border border-border dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 focus:outline-none focus:border-border dark:focus:border-white/40 focus:ring-2 focus:ring-border dark:focus:ring-white/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground dark:text-white/70 mb-2">Emoji</label>
              <div className="flex gap-2 flex-wrap">
                {emojiSuggestions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewEmoji(newEmoji === emoji ? '' : emoji)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      newEmoji === emoji
                        ? 'bg-card ring-2 ring-foreground/30 dark:bg-white/30 dark:ring-white'
                        : 'bg-card/70 hover:bg-card dark:bg-white/10 dark:hover:bg-white/20'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground dark:text-white/70 mb-2">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setNewCategory(cat.value as CustomVocabulary['category'])}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      newCategory === cat.value
                        ? 'ring-2 ring-white'
                        : 'hover:bg-card dark:hover:bg-white/10'
                    }`}
                    style={{
                      backgroundColor:
                        newCategory === cat.value
                          ? `${cat.color}40`
                          : `${cat.color}20`,
                      color: cat.color,
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground dark:text-white/70 mb-2">Related Moods</label>
              <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                {availableMoods.slice(0, 16).map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => toggleMoodSelection(mood.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
                      selectedMoodIds.includes(mood.id)
                        ? 'bg-card ring-1 ring-foreground/30 dark:bg-white/25 dark:ring-white'
                        : 'bg-card/70 hover:bg-card dark:bg-white/10 dark:hover:bg-white/15'
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span className="text-foreground/80 dark:text-white/80">{mood.name}</span>
                    {selectedMoodIds.includes(mood.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={!newWord.trim()}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Vocabulary
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsAdding(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-xl bg-card dark:bg-white/10 text-foreground dark:text-white hover:bg-card/80 dark:hover:bg-white/20"
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
            className="w-full py-3 rounded-xl border-2 border-dashed border-border dark:border-white/20 text-muted-foreground dark:text-white/60 hover:border-border/80 dark:hover:border-white/40 hover:text-foreground dark:hover:text-white/80 hover:bg-card/60 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Word</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
