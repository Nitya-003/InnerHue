'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Heart, Target } from 'lucide-react';
import { useMoodStore } from '@/lib/useMoodStore';

export function MoodStats() {
  const stats = useMoodStore(state => state.stats);
  const statCards = [
    {
      icon: Heart,
      label: 'Total Reflections',
      value: stats.totalEntries,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100 dark:bg-purple-500/20'
    },
    {
      icon: Calendar,
      label: 'Today',
      value: stats.todayEntries,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 dark:bg-blue-500/20'
    },
    {
      icon: TrendingUp,
      label: 'This Week',
      value: stats.weekEntries,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-100 dark:bg-green-500/20'
    },
    {
      icon: Target,
      label: 'Most Common',
      value: stats.mostCommonMood ? stats.mostCommonMood.charAt(0).toUpperCase() + stats.mostCommonMood.slice(1) : 'None',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-100 dark:bg-orange-500/20',
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
          className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:bg-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              <card.icon className="w-6 h-6 text-foreground" />
            </div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.isText ? card.value : card.value}
            </div>
          </div>

          <h3 className="text-muted-foreground font-medium">{card.label}</h3>

          <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
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
