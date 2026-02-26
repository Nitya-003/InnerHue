'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Link2, Sparkles, ArrowRight } from 'lucide-react';
import { MoodCombination, combinationSuggestions } from '@/lib/personalizationTypes';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface MoodCombinationBuilderProps {
  availableMoods: Mood[];
  existingCombinations: MoodCombination[];
  onAdd: (combination: Omit<MoodCombination, 'id' | 'createdAt'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MoodCombination>) => void;
}

export function MoodCombinationBuilder({
  availableMoods,
  existingCombinations,
  onAdd,
  onRemove,
  onUpdate,
}: MoodCombinationBuilderProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [combinationName, setCombinationName] = useState('');
  const [combinationDescription, setCombinationDescription] = useState('');

  const getMoodById = (id: string) => availableMoods.find((m) => m.id === id);

  const handleMoodToggle = (moodId: string) => {
    setSelectedMoods((prev) =>
      prev.includes(moodId)
        ? prev.filter((id) => id !== moodId)
        : prev.length < 4
        ? [...prev, moodId]
        : prev
    );
  };

  const handleAdd = () => {
    if (selectedMoods.length < 2 || !combinationName.trim()) return;

    const emojis = selectedMoods
      .map((id) => getMoodById(id)?.emoji || '')
      .join('');

    onAdd({
      name: combinationName.trim(),
      description: combinationDescription.trim() || undefined,
      moodIds: selectedMoods,
      emoji: emojis,
    });

    setSelectedMoods([]);
    setCombinationName('');
    setCombinationDescription('');
    setIsAdding(false);
  };

  const handleSuggestionClick = (suggestion: typeof combinationSuggestions[0]) => {
    const validMoodIds = suggestion.moodIds.filter((id) =>
      availableMoods.some((m) => m.id === id)
    );
    
    if (validMoodIds.length >= 2) {
      onAdd({
        name: suggestion.name,
        moodIds: validMoodIds,
        emoji: suggestion.emoji,
      });
    }
  };

  const unusedSuggestions = combinationSuggestions.filter(
    (s) =>
      !existingCombinations.some(
        (e) => e.name.toLowerCase() === s.name.toLowerCase()
      )
  );

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link2 className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Mood Combinations</h3>
            <p className="text-sm text-white/60">Express complex emotions</p>
          </div>
        </div>
        <span className="text-sm text-white/50">{existingCombinations.length} created</span>
      </div>

      {/* Existing Combinations */}
      {existingCombinations.length > 0 && (
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {existingCombinations.map((combo) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="group relative p-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-white/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{combo.emoji}</span>
                    <div>
                      <h4 className="text-white font-medium">{combo.name}</h4>
                      <div className="flex items-center gap-1 text-white/50 text-sm">
                        {combo.moodIds.map((moodId, idx) => {
                          const mood = getMoodById(moodId);
                          return (
                            <React.Fragment key={moodId}>
                              {idx > 0 && <span className="mx-1">+</span>}
                              <span>{mood?.name || 'Unknown mood'}</span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(combo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/20 transition-all"
                    aria-label={`Remove ${combo.name}`}
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
                {combo.description && (
                  <p className="mt-2 text-sm text-white/60">{combo.description}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Suggestions */}
      {unusedSuggestions.length > 0 && !isAdding && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Quick Add Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.slice(0, 4).map((suggestion) => (
              <motion.button
                key={suggestion.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-2"
              >
                <span>{suggestion.emoji}</span>
                <span className="text-sm">{suggestion.name}</span>
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
              <label className="block text-sm text-white/70 mb-2">
                Select 2-4 moods to combine
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                {availableMoods.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodToggle(mood.id)}
                    className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      selectedMoods.includes(mood.id)
                        ? 'bg-white/25 ring-2 ring-white'
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-xs text-white/80 truncate w-full text-center">
                      {mood.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Preview */}
            {selectedMoods.length >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-xl bg-white/10 border border-white/20"
              >
                <div className="flex items-center justify-center gap-2 text-2xl mb-2">
                  {selectedMoods.map((moodId, idx) => (
                    <React.Fragment key={moodId}>
                      {idx > 0 && (
                        <ArrowRight className="w-4 h-4 text-white/40" />
                      )}
                      <span>{getMoodById(moodId)?.emoji}</span>
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-center text-white/60 text-sm">
                  {selectedMoods.map((id) => getMoodById(id)?.name).join(' + ')}
                </p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm text-white/70 mb-2">Combination Name *</label>
              <input
                type="text"
                value={combinationName}
                onChange={(e) => setCombinationName(e.target.value)}
                placeholder='e.g., "Grateful but Tired"'
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Description (optional)</label>
              <textarea
                value={combinationDescription}
                onChange={(e) => setCombinationDescription(e.target.value)}
                placeholder="When do you feel this way?"
                rows={2}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={selectedMoods.length < 2 || !combinationName.trim()}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Combination
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsAdding(false);
                  setSelectedMoods([]);
                  setCombinationName('');
                  setCombinationDescription('');
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
            <span>Create New Combination</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
