'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { MoodData } from '@/lib/moodData';

interface MoodBarChartProps {
  data: Array<{
    mood: string;
    count: number;
  }>;
}

const COLORS = [
  '#4CAF50', '#2196F3', '#FFC107', '#F44336',
  '#9C27B0', '#00BCD4', '#FF9800', '#795548',
  '#607D8B', '#E91E63'
];

export default function MoodBarChart({ data }: MoodBarChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  const axisMuted = isDark ? '#a1a1aa' : '#4B5563';
  const gridStroke = isDark ? '#374151' : '#e5e7eb';

  const chartData = data.map((item) => {
    const moodInfo = MoodData.getMoodById(item.mood);
    return {
      name: moodInfo ? moodInfo.name : item.mood,
      count: item.count,
      color: moodInfo ? moodInfo.color : COLORS[0]
    };
  });

  return (
    <div className="bg-white/80 dark:bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 dark:border-white/10">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Mood Frequency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={80}
            tick={{ fill: axisMuted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              background: isDark ? 'hsl(240 8% 12%)' : '#fff',
              color: isDark ? '#f3f4f6' : '#111827',
            }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
