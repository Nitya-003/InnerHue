'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MoodFrequencyProps {
    data: { name: string; value: number; fill: string }[];
}

export function MoodFrequency({ data }: MoodFrequencyProps) {
    const hasData = data && data.length > 0;

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
                <CardDescription>Frequency of primary moods.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No data available.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill || `hsl(${(index * 45) % 360}, 70%, 50%)`} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
