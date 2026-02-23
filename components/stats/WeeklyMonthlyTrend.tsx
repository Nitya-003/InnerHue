'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface WeeklyMonthlyTrendProps {
    data: { date: string; score: number; count: number }[];
    timeRange: string;
}

export function WeeklyMonthlyTrend({ data, timeRange }: WeeklyMonthlyTrendProps) {
    const chartConfig = useMemo(() => {
        return {
            title: timeRange === '7d' ? 'Weekly Mood Trend' : timeRange === '30d' ? 'Monthly Mood Trend' : 'All-Time Mood Trend',
            description: 'Your average emotional sentiment over time.'
        };
    }, [timeRange]);

    const hasData = data && data.some(d => d.count > 0);

    return (
        <Card className="col-span-full md:col-span-2">
            <CardHeader>
                <CardTitle>{chartConfig.title}</CardTitle>
                <CardDescription>{chartConfig.description}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No data available for this period.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                dy={10}
                            />
                            <YAxis
                                domain={[0, 5]}
                                ticks={[1, 2, 3, 4, 5]}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(val) => {
                                    const labels = ['N/A', 'Awful', 'Bad', 'Meh', 'Good', 'Rad'];
                                    return labels[val] || '';
                                }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                                formatter={(value: number, name: string) => [Number(value).toFixed(1), 'Avg Sentiment']}
                                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#colorScore)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
