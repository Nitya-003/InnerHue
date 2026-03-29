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
    <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border">
      <h3 className="text-xl font-bold text-foreground mb-6">Mood Frequency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={108}
            tick={{ fill: axisMuted, fontSize: 13, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [`${value} entries`, name]}
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              color: 'hsl(var(--popover-foreground))',
              borderRadius: '12px',
              border: '1px solid hsl(var(--border))',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
