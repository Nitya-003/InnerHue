'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Palette, 
  Sliders, 
  Tags, 
  Link2, 
  BookOpen,
  RotateCcw,
  Settings
} from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';
import { usePersonalization } from '@/hooks/usePersonalization';
import {
  ColorPalettePicker,
  IntensitySlider,
  SubcategoryBuilder,
  MoodCombinationBuilder,
  VocabularyBuilder,
} from '@/components/personalization';

// Mood data for the personalization features
const moods = [
  { id: 'happy', name: 'Happy', emoji: '😊', color: '#FFD93D', glow: '#FFF176', category: 'positive' },
  { id: 'excited', name: 'Excited', emoji: '🤩', color: '#AB47BC', glow: '#BA68C8', category: 'energetic' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: '#26A69A', glow: '#4DB6AC', category: 'positive' },
  { id: 'hopeful', name: 'Hopeful', emoji: '🌟', color: '#FFCA28', glow: '#FFD54F', category: 'positive' },
  { id: 'calm', name: 'Calm', emoji: '😌', color: '#66BB6A', glow: '#81C784', category: 'calm' },
  { id: 'peaceful', name: 'Peaceful', emoji: '🕊️', color: '#4FC3F7', glow: '#81D4FA', category: 'calm' },
  { id: 'sad', name: 'Sad', emoji: '😢', color: '#42A5F5', glow: '#64B5F6', category: 'negative' },
  { id: 'lonely', name: 'Lonely', emoji: '😔', color: '#7E57C2', glow: '#9575CD', category: 'negative' },
  { id: 'anxious', name: 'Anxious', emoji: '😰', color: '#FF7043', glow: '#FF8A65', category: 'stress' },
  { id: 'stressed', name: 'Stressed', emoji: '😤', color: '#FF5722', glow: '#FF6F00', category: 'stress' },
  { id: 'angry', name: 'Angry', emoji: '😡', color: '#EF5350', glow: '#E57373', category: 'intense' },
  { id: 'confused', name: 'Confused', emoji: '😕', color: '#FFA726', glow: '#FFB74D', category: 'neutral' },
  { id: 'nostalgic', name: 'Nostalgic', emoji: '📸', color: '#D4A574', glow: '#DDBF94', category: 'neutral' },
  { id: 'energized', name: 'Energized', emoji: '⚡', color: '#FFEB3B', glow: '#FFF176', category: 'energetic' },
  { id: 'creative', name: 'Creative', emoji: '🎨', color: '#FF7043', glow: '#FFAB91', category: 'playful' },
  { id: 'content', name: 'Content', emoji: '😊', color: '#AED581', glow: '#C5E1A5', category: 'calm' },
];

type TabType = 'colors' | 'intensity' | 'subcategories' | 'combinations' | 'vocabulary';

const tabs: { id: TabType; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'colors', label: 'Color Palettes', icon: Palette, description: 'Customize mood colors' },
  { id: 'intensity', label: 'Intensity', icon: Sliders, description: 'Track emotional depth' },
  { id: 'subcategories', label: 'Subcategories', icon: Tags, description: 'Define mood variations' },
  { id: 'combinations', label: 'Combinations', icon: Link2, description: 'Mix emotions together' },
  { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, description: 'Personal emotion words' },
];

export default function PersonalizationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    settings,
    setCustomPalette,
    removeCustomPalette,
    getCustomPalette,
    addSubcategory,
    removeSubcategory,
    getSubcategoriesForMood,
    addMoodCombination,
    removeMoodCombination,
    updateMoodCombination,
    addCustomWord,
    removeCustomWord,
    updateCustomWord,
    setDefaultIntensity,
    toggleIntensityTracking,
    resetAllPersonalization,
    stats,
  } = usePersonalization();

  const renderContent = () => {
    switch (activeTab) {
      case 'colors':
        return (
          <div className="space-y-6">
            {/* Mood Selector */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <label className="block text-sm text-white/70 mb-3">Select a mood to customize</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {moods.map((mood) => {
                  const customPalette = getCustomPalette(mood.id);
                  return (
                    <motion.button
                      key={mood.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedMood(mood)}
                      className={`relative p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                        selectedMood.id === mood.id
                          ? 'bg-white/25 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/15'
                      }`}
                    >
                      <span className="text-xl">{mood.emoji}</span>
                      <span className="text-xs text-white/80 truncate w-full text-center">
                        {mood.name}
                      </span>
                      {customPalette && (
                        <div
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                          style={{ backgroundColor: customPalette.primaryColor }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette Picker */}
            <ColorPalettePicker
              moodId={selectedMood.id}
              moodName={selectedMood.name}
              currentPalette={getCustomPalette(selectedMood.id)}
              originalColor={selectedMood.color}
              originalGlow={selectedMood.glow}
              onSelectPalette={setCustomPalette}
              onReset={() => removeCustomPalette(selectedMood.id)}
            />
          </div>
        );

      case 'intensity':
        return (
          <div className="space-y-6">
            {/* Intensity Settings */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Intensity Settings</h3>
              
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">Enable Intensity Tracking</p>
                  <p className="text-sm text-white/60">Track how strongly you feel each emotion</p>
                </div>
                <button
                  onClick={() => toggleIntensityTracking(!settings.enableIntensityTracking)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.enableIntensityTracking
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                    animate={{ x: settings.enableIntensityTracking ? 28 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="py-4">
                <p className="text-white font-medium mb-2">Default Intensity Level</p>
                <p className="text-sm text-white/60 mb-4">
                  Starting intensity when selecting emotions
                </p>
                <IntensitySlider
                  value={settings.defaultIntensity}
                  onChange={setDefaultIntensity}
                  moodName="Default"
                  moodColor="#8B5CF6"
                  compact
                />
              </div>
            </div>

            {/* Try Intensity Slider */}
            <div>
              <p className="text-white/70 text-sm mb-3">Try it with a mood:</p>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {moods.slice(0, 8).map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                      selectedMood.id === mood.id
                        ? 'bg-white/25 ring-1 ring-white'
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span className="text-white text-sm">{mood.name}</span>
                  </motion.button>
                ))}
              </div>
              <IntensitySlider
                value={5}
                onChange={() => {}}
                moodName={selectedMood.name}
                moodColor={getCustomPalette(selectedMood.id)?.primaryColor || selectedMood.color}
                disabled={!settings.enableIntensityTracking}
              />
            </div>
          </div>
        );

      case 'subcategories':
        return (
          <div className="space-y-6">
            {/* Mood Selector for Subcategories */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <label className="block text-sm text-white/70 mb-3">Select a mood to add subcategories</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {moods.filter(m => ['stressed', 'anxious', 'happy', 'sad', 'angry', 'calm'].includes(m.id)).map((mood) => {
                  const subcats = getSubcategoriesForMood(mood.id);
                  return (
                    <motion.button
                      key={mood.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMood(mood)}
                      className={`relative p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                        selectedMood.id === mood.id
                          ? 'bg-white/25 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/15'
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-sm text-white/80">{mood.name}</span>
                      {subcats.length > 0 && (
                        <span className="text-xs text-white/50">{subcats.length} subs</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Subcategory Builder */}
            <SubcategoryBuilder
              parentMoodId={selectedMood.id}
              parentMoodName={selectedMood.name}
              parentMoodEmoji={selectedMood.emoji}
              parentMoodColor={selectedMood.color}
              existingSubcategories={getSubcategoriesForMood(selectedMood.id)}
              onAdd={addSubcategory}
              onRemove={removeSubcategory}
            />
          </div>
        );

      case 'combinations':
        return (
          <MoodCombinationBuilder
            availableMoods={moods}
            existingCombinations={settings.moodCombinations}
            onAdd={addMoodCombination}
            onRemove={removeMoodCombination}
            onUpdate={updateMoodCombination}
          />
        );

      case 'vocabulary':
        return (
          <VocabularyBuilder
            availableMoods={moods}
            vocabulary={settings.customVocabulary}
            onAdd={addCustomWord}
            onRemove={removeCustomWord}
            onUpdate={updateCustomWord}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0720] relative overflow-hidden">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/emotions">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 shadow-sm hover:shadow-md transition-all border border-white/10"
              >
                <ArrowLeft className="w-6 h-6 text-white/70" />
              </motion.div>
            </Link>

            <div className="flex items-center space-x-2">
              <Settings className="text-white w-8 h-8" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Personalization
              </h1>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{stats.totalCustomPalettes}</p>
              <p className="text-xs text-white/60">Colors</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">{stats.totalSubcategories}</p>
              <p className="text-xs text-white/60">Subcats</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">{stats.totalCombinations}</p>
              <p className="text-xs text-white/60">Combos</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">{stats.totalCustomWords}</p>
              <p className="text-xs text-white/60">Words</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Make It Yours
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Customize how you express and track your emotions with personalized colors, 
              intensity levels, subcategories, and your own emotional vocabulary.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl flex items-center gap-2 transition-all backdrop-blur-lg ${
                      activeTab === tab.id
                        ? 'bg-white/20 border border-white/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-white/70'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${activeTab === tab.id ? 'text-white' : 'text-white/80'}`}>
                        {tab.label}
                      </p>
                      <p className="text-xs text-white/50 hidden sm:block">{tab.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>

          {/* Reset Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <AnimatePresence>
              {showResetConfirm ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="inline-flex items-center gap-3 p-4 bg-red-500/20 rounded-xl border border-red-500/30"
                >
                  <p className="text-white">Reset all personalization?</p>
                  <button
                    onClick={() => {
                      resetAllPersonalization();
                      setShowResetConfirm(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResetConfirm(true)}
                  className="text-white/50 hover:text-white/70 flex items-center gap-2 mx-auto text-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Personalization
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
