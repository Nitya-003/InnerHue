'use client';
import { useMoodStore } from '@/lib/useMoodStore';
import { MoodData } from '@/lib/moodData';
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

export function MoodChart() {
    const stats = useMoodStore(state => state.stats);
    const moodCounts = stats?.moodCounts || {};

    const data = Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
    }));

    const chartData = data.map((item) => {
        const moodInfo = MoodData.getMoodById(item.mood);
        return {
            name: moodInfo ? moodInfo.name : item.mood,
            count: item.count,
            color: moodInfo ? moodInfo.color : '#A78BFA'
        };
    }).sort((a, b) => b.count - a.count).slice(0, 5); // top 5 moods

    if (chartData.length === 0) {
        return (
            <div className="flex h-[300px] items-center justify-center text-white/50 text-sm">
                No mood entry available yet. Start reflecting to see your chart!
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={80}
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            color: '#fff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(10px)'
                        }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        itemStyle={{ color: '#fff', fontWeight: 600 }}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={28}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
export default MoodChart;