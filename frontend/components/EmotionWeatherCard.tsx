'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, LucideIcon } from 'lucide-react';
import { MoodEntry } from '@/lib/useMoodStore';

interface EmotionWeatherCardProps {
  moodHistory: MoodEntry[];
}

type WeatherType = 'sunny' | 'partlyCloudy' | 'cloudy' | 'rainy' | 'stormy';

interface WeatherConfig {
  title: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  message: string;
  description: string;
}

const weatherConfigs: Record<WeatherType, WeatherConfig> = {
  sunny: {
    title: 'Sunny',
    icon: Sun,
    gradient: 'from-amber-400/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-600/10 border-amber-200/50 dark:border-amber-500/20',
    iconColor: 'text-amber-500 dark:text-amber-400',
    message: "You've experienced mostly positive emotions recently. Keep nurturing these habits.",
    description: 'Bright and uplifting emotional patterns.'
  },
  partlyCloudy: {
    title: 'Partly Cloudy',
    icon: CloudSun,
    gradient: 'from-sky-300/20 to-blue-400/20 dark:from-sky-500/10 dark:to-blue-600/10 border-sky-200/50 dark:border-sky-500/20',
    iconColor: 'text-sky-500 dark:text-sky-400',
    message: 'A sense of calm and balance surrounds you. A great time for mindful reflection.',
    description: 'Peaceful and balanced emotional patterns.'
  },
  cloudy: {
    title: 'Cloudy',
    icon: Cloud,
    gradient: 'from-slate-300/20 to-slate-400/20 dark:from-slate-500/10 dark:to-slate-600/10 border-slate-200/50 dark:border-slate-500/20',
    iconColor: 'text-slate-500 dark:text-slate-400',
    message: 'A neutral space. Take a moment to check in with yourself and see what you need.',
    description: 'Balanced, neutral, or contemplative emotional patterns.'
  },
  rainy: {
    title: 'Rainy',
    icon: CloudRain,
    gradient: 'from-blue-400/20 to-indigo-500/20 dark:from-blue-600/10 dark:to-indigo-700/10 border-blue-200/50 dark:border-blue-500/20',
    iconColor: 'text-blue-500 dark:text-blue-400',
    message: "It's okay to feel sad or lonely. Allow yourself to rest and process these feelings.",
    description: 'Quiet, reflective, or tender emotional patterns.'
  },
  stormy: {
    title: 'Stormy',
    icon: CloudLightning,
    gradient: 'from-purple-400/20 to-rose-400/20 dark:from-purple-700/10 dark:to-rose-800/10 border-purple-200/50 dark:border-purple-500/20',
    iconColor: 'text-purple-500 dark:text-purple-400',
    message: 'Tension or anxiety may be high. Deep breaths can help you navigate this storm.',
    description: 'High tension, stress, or challenging emotional patterns.'
  }
};

const emptyTodayConfig: WeatherConfig = {
  title: 'Clear Sky',
  icon: Sun,
  gradient: 'from-slate-200/40 to-slate-300/40 dark:from-slate-800/20 dark:to-slate-900/20 border-slate-200/40 dark:border-slate-800/40',
  iconColor: 'text-slate-400 dark:text-slate-600',
  message: "Log your first emotion today to reveal today's weather forecast.",
  description: 'Awaiting your reflections.'
};

const emptyWeeklyConfig: WeatherConfig = {
  title: 'Mild Breeze',
  icon: CloudSun,
  gradient: 'from-slate-200/40 to-slate-300/40 dark:from-slate-800/20 dark:to-slate-900/20 border-slate-200/40 dark:border-slate-800/40',
  iconColor: 'text-slate-400 dark:text-slate-600',
  message: 'Start logging your moods during the week to see your weekly weather pattern.',
  description: 'Awaiting weekly reflections.'
};

function getWeatherType(moodId: string): WeatherType {
  const m = moodId.toLowerCase();
  
  // Sunny moods
  if ([
    'happy', 'excited', 'grateful', 'inspired', 'proud', 'playful', 
    'motivated', 'silly', 'energized', 'empowered', 'romantic', 
    'adventurous', 'creative', 'hopeful', 'joy', 'blessed', 'loved', 
    'confident', 'optimistic'
  ].includes(m)) {
    return 'sunny';
  }
  
  // Partly Cloudy moods
  if ([
    'calm', 'content', 'peaceful', 'dreamy', 'relaxed', 'serene'
  ].includes(m)) {
    return 'partlyCloudy';
  }
  
  // Rainy moods
  if ([
    'sad', 'lonely', 'melancholy', 'aching-loneliness', 'gentle-melancholy', 
    'vulnerable', 'tender-vulnerability'
  ].includes(m)) {
    return 'rainy';
  }
  
  // Stormy moods
  if ([
    'anxious', 'angry', 'stressed', 'overwhelmed', 'frustrated', 'rebellious', 
    'jealous', 'raw-emotion', 'building-tension', 'social-fatigue', 
    'quiet-overwhelm', 'lingering-restlessness', 'restrained-frustration'
  ].includes(m)) {
    return 'stormy';
  }
  
  // Cloudy (Default/Neutral) moods
  return 'cloudy';
}

function calculateWeather(entries: MoodEntry[]): WeatherType | null {
  if (entries.length === 0) return null;
  
  const counts: Record<WeatherType, number> = {
    sunny: 0,
    partlyCloudy: 0,
    cloudy: 0,
    rainy: 0,
    stormy: 0
  };
  
  entries.forEach(entry => {
    const moodId = entry.emotion || entry.mood;
    const type = getWeatherType(moodId);
    counts[type]++;
  });
  
  // Tie-breaker tracking
  const latestTimestamps: Record<WeatherType, number> = {
    sunny: 0,
    partlyCloudy: 0,
    cloudy: 0,
    rainy: 0,
    stormy: 0
  };
  
  entries.forEach(entry => {
    const moodId = entry.emotion || entry.mood;
    const type = getWeatherType(moodId);
    const time = new Date(entry.timestamp).getTime();
    if (time > latestTimestamps[type]) {
      latestTimestamps[type] = time;
    }
  });

  let dominantType: WeatherType = 'cloudy';
  let maxCount = -1;

  Object.entries(counts).forEach(([type, count]) => {
    const weatherType = type as WeatherType;
    if (count > maxCount) {
      maxCount = count;
      dominantType = weatherType;
    } else if (count === maxCount && count > 0) {
      if (latestTimestamps[weatherType] > latestTimestamps[dominantType]) {
        dominantType = weatherType;
      }
    }
  });
  
  return dominantType;
}

function getMoodSummary(entries: MoodEntry[], timeframe: 'today' | 'weekly'): string {
  if (entries.length === 0) {
    return timeframe === 'today' 
      ? 'No moods logged today.' 
      : 'No moods logged this week.';
  }
  
  const counts: Record<string, number> = {};
  entries.forEach(entry => {
    const rawMood = entry.emotion || entry.mood;
    const formattedMood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1).replace(/-/g, ' ');
    counts[formattedMood] = (counts[formattedMood] || 0) + 1;
  });
  
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  
  if (sorted.length === 1) {
    return `Mood: ${sorted[0][0]} (${sorted[0][1]}x)`;
  }
  
  return `Dominant: ${sorted[0][0]} (${sorted[0][1]}x), ${sorted[1][0]} (${sorted[1][1]}x)`;
}

export function EmotionWeatherCard({ moodHistory }: EmotionWeatherCardProps) {
  // Today's weather
  const todayStr = new Date().toDateString();
  const todayEntries = moodHistory.filter(
    entry => new Date(entry.timestamp).toDateString() === todayStr
  );
  const todayWeatherType = calculateWeather(todayEntries);
  const todayConfig = todayWeatherType ? weatherConfigs[todayWeatherType] : emptyTodayConfig;
  const todaySummary = getMoodSummary(todayEntries, 'today');

  // Weekly weather (past 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyEntries = moodHistory.filter(
    entry => new Date(entry.timestamp) >= oneWeekAgo
  );
  const weeklyWeatherType = calculateWeather(weeklyEntries);
  const weeklyConfig = weeklyWeatherType ? weatherConfigs[weeklyWeatherType] : emptyWeeklyConfig;
  const weeklySummary = getMoodSummary(weeklyEntries, 'weekly');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
      aria-label="Emotional Weather Forecast"
    >
      {/* Today's Emotional Weather Card */}
      <motion.article
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className={`relative flex flex-col justify-between rounded-3xl p-6 md:p-8 border backdrop-blur-md transition-all duration-300 bg-gradient-to-br ${todayConfig.gradient} shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50`}
        tabIndex={0}
        aria-label={`Today's Emotional Weather: ${todayConfig.title}`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Today&apos;s Forecast
              </span>
              <h4 className="text-2xl font-bold text-foreground mt-1">
                {todayConfig.title}
              </h4>
            </div>
            
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className={`p-3 rounded-2xl bg-white/20 dark:bg-black/20 ${todayConfig.iconColor}`}
            >
              <todayConfig.icon className="w-8 h-8" aria-hidden="true" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Current Mood Summary
              </p>
              <p className="text-sm font-medium text-foreground mt-1">
                {todaySummary}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {todayConfig.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-sm italic font-medium text-foreground/80 leading-relaxed">
            &ldquo;{todayConfig.message}&rdquo;
          </p>
        </div>
      </motion.article>

      {/* Weekly Emotional Weather Card */}
      <motion.article
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className={`relative flex flex-col justify-between rounded-3xl p-6 md:p-8 border backdrop-blur-md transition-all duration-300 bg-gradient-to-br ${weeklyConfig.gradient} shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50`}
        tabIndex={0}
        aria-label={`Weekly Emotional Weather Forecast: ${weeklyConfig.title}`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Weekly Weather Pattern
              </span>
              <h4 className="text-2xl font-bold text-foreground mt-1">
                {weeklyConfig.title}
              </h4>
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2
              }}
              className={`p-3 rounded-2xl bg-white/20 dark:bg-black/20 ${weeklyConfig.iconColor}`}
            >
              <weeklyConfig.icon className="w-8 h-8" aria-hidden="true" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Weekly Mood Summary
              </p>
              <p className="text-sm font-medium text-foreground mt-1">
                {weeklySummary}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {weeklyConfig.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-sm italic font-medium text-foreground/80 leading-relaxed">
            &ldquo;{weeklyConfig.message}&rdquo;
          </p>
        </div>
      </motion.article>
    </motion.section>
  );
}
