'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Heart, Target } from 'lucide-react';

interface MoodStatsProps {
  stats: {
    totalEntries: number;
    todayEntries: number;
    weekEntries: number;
    mostCommonMood: string | null;
  };
}

export function MoodStats({ stats }: MoodStatsProps) {
  const statCards = [
    {
      icon: Heart,
      label: 'Total Reflections',
      value: stats.totalEntries,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Calendar,
      label: 'Today',
      value: stats.todayEntries,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100'
    },
    {
      icon: TrendingUp,
      label: 'This Week',
      value: stats.weekEntries,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-100'
    },
    {
      icon: Target,
      label: 'Most Common',
      value: stats.mostCommonMood ? stats.mostCommonMood.charAt(0).toUpperCase() + stats.mostCommonMood.slice(1) : 'None',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-100',
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.bgColor} dark:bg-opacity-20`}>
              <card.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.isText ? card.value : card.value}
            </div>
          </div>

          <h3 className="text-gray-600 dark:text-gray-400 font-medium">{card.label}</h3>

          {/* Progress animation */}
          <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${card.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: card.isText ? '100%' : `${Math.min((card.value as number) * 10, 100)}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
