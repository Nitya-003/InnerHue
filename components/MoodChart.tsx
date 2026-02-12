'use client';

import { useState } from 'react';
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

interface MoodChartProps {
  moodHistory: any[];
  stats: any;
}

export function MoodChart({ moodHistory, stats }: MoodChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

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
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-800">Mood Distribution</h3>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-all ${
              chartType === 'bar' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg transition-all ${
              chartType === 'pie' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <PieChartIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
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
                innerRadius={80}
                outerRadius={140}
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
  );
}
