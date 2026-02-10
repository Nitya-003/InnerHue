'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart3, PieChart, Activity } from 'lucide-react';

interface MoodChartProps {
  moodHistory: any[];
  stats: any;
}

export function MoodChart({ moodHistory, stats }: MoodChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const moodColors: { [key: string]: string } = {
    happy: '#FFD93D',
    sad: '#42A5F5',
    anxious: '#FF7043',
    excited: '#AB47BC',
    calm: '#66BB6A',
    angry: '#EF5350',
    confused: '#FFA726',
    grateful: '#26A69A',
    lonely: '#7E57C2',
    hopeful: '#FFCA28',
    stressed: '#FF5722',
    peaceful: '#4FC3F7',
    energized: '#FFEB3B',
    overwhelmed: '#F06292',
    content: '#AED581',
    frustrated: '#FF8A65',
    inspired: '#FFD740',
    melancholy: '#90A4AE',
    motivated: '#FF6D00',
    vulnerable: '#F8BBD9',
    empowered: '#6A1B9A',
    nostalgic: '#D4A574'
  };

  const maxCount = Math.max(...Object.values(stats.moodCounts || {}).map(v => Number(v)));

  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 dark:border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Mood Distribution</h3>
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-all ${chartType === 'bar'
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
          >
            <BarChart3 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg transition-all ${chartType === 'pie'
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
          >
            <PieChart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {chartType === 'bar' ? (
        <div className="space-y-4">
          {Object.entries(stats.moodCounts || {})
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 10)
            .map(([mood, count], index) => (
              <motion.div
                key={mood}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {mood}
                </div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: moodColors[mood] || '#8B5CF6' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${((count as number) / maxCount) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {count as number}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="relative w-80 h-80">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {Object.entries(stats.moodCounts || {})
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 8)
                .reduce((acc, [mood, count], index, array) => {
                  const total = array.reduce((sum, [, c]) => sum + (c as number), 0);
                  const percentage = ((count as number) / total) * 100;
                  const angle = (percentage / 100) * 360;

                  const startAngle = acc.currentAngle;
                  const endAngle = startAngle + angle;

                  const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

                  const largeArcFlag = angle > 180 ? 1 : 0;

                  const pathData = [
                    `M 100 100`,
                    `L ${x1} ${y1}`,
                    `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');

                  acc.segments.push(
                    <motion.path
                      key={mood}
                      d={pathData}
                      fill={moodColors[mood] || '#8B5CF6'}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.8, scale: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  );

                  acc.currentAngle = endAngle;
                  return acc;
                }, { segments: [] as React.JSX.Element[], currentAngle: 0 }).segments}
            </svg>

            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{stats.totalEntries}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
