'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TimeBasedAnalysisProps {
    data: { timeOfDay: string; count: number }[];
}

export function TimeBasedAnalysis({ data }: TimeBasedAnalysisProps) {
    const hasData = data && data.some(d => d.count > 0);

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Peak Logging Times</CardTitle>
                <CardDescription>When do you usually log your moods?</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No time history available.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="timeOfDay"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                dy={10}
                            />
                            <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
