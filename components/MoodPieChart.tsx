'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MoodData } from '@/lib/moodData';

interface MoodPieChartProps {
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
        <p className="font-semibold text-gray-800 dark:text-gray-200">{payload[0].name}</p>
        <p className="text-sm font-medium" style={{ color: payload[0].payload.color }}>
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function MoodPieChart({ data }: MoodPieChartProps) {
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
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Mood Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
