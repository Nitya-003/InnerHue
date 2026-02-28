'use client';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-3 rounded-xl shadow-lg">
        <p className="font-semibold text-gray-800 dark:text-gray-200">{payload[0].payload.name}</p>
        <p className="text-sm font-medium" style={{ color: payload[0].payload.color }}>
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function MoodBarChart({ data }: MoodBarChartProps) {
  // Transform data to include mood names and colors
  const chartData = data.map((item) => {
    const moodInfo = MoodData.getMoodById(item.mood);
    return {
      name: moodInfo ? moodInfo.name : item.mood,
      count: item.count,
      color: moodInfo ? moodInfo.color : COLORS[0]
    };
  });

  return (
    <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 dark:border-white/10 transition-colors duration-500">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Mood Frequency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" strokeOpacity={0.1} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={80}
            tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
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
