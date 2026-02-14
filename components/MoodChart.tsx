'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MoodData } from '@/lib/moodData';
import { motion } from 'framer-motion';
import { useMoodStore } from '@/lib/useMoodStore';

export function MoodChart() {
  // Get data from Zustand store with selective subscriptions
  const moodHistory = useMoodStore(state => state.moodHistory);
  const stats = useMoodStore(state => state.stats);

  // Keep chartType as local UI state
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prepare data for Recharts
  const data = Object.entries(stats.moodCounts || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([mood, count]) => {
      const moodInfo = MoodData.getMoodById(mood);
      return {
        name: moodInfo ? moodInfo.name : mood,
        count: count as number,
        color: moodInfo ? moodInfo.color : '#8B5CF6' // Fallback color
      };
    });

  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/50 dark:border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Mood Distribution</h3>
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
            <PieChartIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        {/* Scrollable container for mobile bars */}
        <div className={`w-full ${chartType === 'bar' && isMobile ? 'overflow-x-auto pb-4' : ''}`}>
          <div className={`${chartType === 'bar' && isMobile ? 'w-[600px]' : 'w-full'} h-[300px] sm:h-[400px]`}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart
                  data={data}
                  layout={isMobile ? 'horizontal' : 'vertical'}
                  margin={{ top: 5, right: 30, left: isMobile ? 0 : 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  {isMobile ? (
                    <>
                      <XAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: '#4B5563', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                      />
                      <YAxis type="number" hide />
                    </>
                  ) : (
                    <>
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={80}
                        tick={{ fill: '#4B5563', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                    </>
                  )}
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="count" radius={isMobile ? [4, 4, 0, 0] : [0, 4, 4, 0]} barSize={32}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="70%"
                    paddingAngle={2}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
