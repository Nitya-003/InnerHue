'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
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
  '#607D8B', '#E91E63', '#26A69A', '#AB47BC',
  '#FF7043', '#4FC3F7', '#FFD93D'
];

export default function MoodPieChart({ data }: MoodPieChartProps) {
  const chartData = data.map((item, index) => {
    const moodInfo = MoodData.getMoodById(item.mood);
    return {
      name: moodInfo ? moodInfo.name : item.mood,
      count: item.count,
      color: moodInfo?.color ?? COLORS[index % COLORS.length]
    };
  });

  const totalCount = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-border min-w-0 max-w-full">
      <h3 className="text-xl font-bold text-foreground mb-6">Mood Distribution</h3>
      <div className="w-full min-h-[280px] min-w-0">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={105}
              paddingAngle={chartData.length > 1 ? 0.5 : 0}
              label={false}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                const sliceName = String(p.name ?? p.payload?.name ?? '');
                const value = Number(p.value ?? 0);
                const pct =
                  totalCount > 0
                    ? Math.round((value / totalCount) * 100)
                    : 0;
                return (
                  <div
                    className="rounded-xl bg-popover px-3 py-2 text-sm shadow-lg border border-border"
                    style={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  >
                    <div className="font-medium text-popover-foreground">{sliceName}</div>
                    <div className="text-muted-foreground tabular-nums">
                      {value} ({pct}%)
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
        {chartData.map((entry, idx) => (
          <div
            key={`${entry.name}-${idx}`}
            className="flex items-start gap-2 min-w-0 rounded-lg bg-muted/80 border border-border px-2.5 py-1.5"
          >
            <span
              className="mt-1 shrink-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground leading-snug break-words text-left">
              {entry.name}
              <span className="text-muted-foreground tabular-nums">
                {' '}
                (
                {totalCount > 0
                  ? Math.round((entry.count / totalCount) * 100)
                  : 0}
                %)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
