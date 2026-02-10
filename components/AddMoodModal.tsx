'use client';

import { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Palette, Smile, Tag } from 'lucide-react';
import { CustomMoodStorage, CustomMood } from '@/lib/customMoods';

interface AddMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMoodAdded: (mood: CustomMood) => void;
}

const EMOJI_OPTIONS = [
  '😊', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '😋',
  '😍', '🥰', '😘', '😚', '😙', '🥳', '🤗', '🤔', '🤫', '🤭',
  '😇', '🙂', '🙃', '😉', '😌', '😎', '🥸', '🤓', '🧐', '😕',
  '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨',
  '😰', '😥', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳',
  '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '😑',
  '😐', '😶', '😏', '😒', '🙄', '😬', '🤐', '🤨', '😔', '😪',
  '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥴', '😵',
  '🤠', '🥳', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀',
  '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼',
  '😽', '🙀', '😿', '😾'
];

const COLOR_OPTIONS = [
  '#FFD93D', '#42A5F5', '#FF7043', '#AB47BC', '#66BB6A', '#EF5350',
  '#FFA726', '#26A69A', '#7E57C2', '#FFCA28', '#FF5722', '#4FC3F7',
  '#FFEB3B', '#F06292', '#AED581', '#FF8A65', '#FFD740', '#90A4AE',
  '#FF6D00', '#F8BBD9', '#6A1B9A', '#D4A574', '#8BC34A', '#FF9800',
  '#9C27B0', '#607D8B', '#FF5722', '#4CAF50', '#E91E63', '#3F51B5',
  '#FF4081', '#9FA8DA', '#FF6F00', '#E1BEE7', '#FF7043', '#5E35B1',
  '#D32F2F', '#FFC107'
];

const CATEGORY_OPTIONS = [
  'positive', 'negative', 'calm', 'energetic', 'stress', 'intense', 'neutral', 'playful'
];

export function AddMoodModal({ isOpen, onClose, onMoodAdded }: AddMoodModalProps) {

  const [formData, setFormData] = useState({
    name: '',
    emoji: '😊',
    color: '#FFD93D',
    category: 'positive' as string
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      emoji: '😊',
      color: '#FFD93D',
      category: 'positive'
    });
    setError('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter a mood name');
      return;
    }

    if (CustomMoodStorage.moodNameExists(formData.name.trim())) {
      setError('A mood with this name already exists');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const glowColor = CustomMoodStorage.generateGlowColor(formData.color);

      const newMood = CustomMoodStorage.saveCustomMood({
        name: formData.name.trim(),
        emoji: formData.emoji,
        color: formData.color,
        glow: glowColor,
        category: formData.category
      });

      onMoodAdded(newMood);
      handleClose();
    } catch (err) {
      setError('Failed to create mood. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e: MouseEvent) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-green-600" />
                  Create Custom Mood
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Mood Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Mood Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData(prev => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g., Motivated, Zen, Adventurous"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100"
                      maxLength={20}
                    />
                  </div>

                  {/* Emoji Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Smile className="w-4 h-4 inline mr-1" />
                      Choose Emoji
                    </label>
                    <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 dark:bg-gray-800/50">
                      {EMOJI_OPTIONS.map((emoji, index) => (
                        <button
                          key={`${emoji}-${index}`}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                          className={`p-2 rounded-md text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${formData.emoji === emoji ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500' : ''
                            }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Palette className="w-4 h-4 inline mr-1" />
                      Choose Color
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {COLOR_OPTIONS.map((color, index) => (
                        <button
                          key={`${color}-${index}`}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-gray-400 scale-110' : 'hover:scale-105'
                            }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setFormData(prev => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preview
                    </label>
                    <div
                      className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r text-white text-center"
                      style={{
                        background: `linear-gradient(135deg, ${formData.color} 0%, ${CustomMoodStorage.generateGlowColor(formData.color)} 100%)`
                      }}
                    >
                      <div className="text-2xl mb-1">{formData.emoji}</div>
                      <div className="font-medium">{formData.name || 'Your Mood Name'}</div>
                      <div className="text-xs opacity-90 mt-1">{formData.category}</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Mood'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}