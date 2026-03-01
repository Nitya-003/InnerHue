'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EmotionTagsAnalyticsProps {
    data: { name: string; count: number }[];
}

export function EmotionTagsAnalytics({ data }: EmotionTagsAnalyticsProps) {
    const hasData = data && data.length > 0;

    return (
        <Card className="col-span-full md:col-span-1 bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/10 backdrop-blur-md shadow-lg transition-colors duration-500">
            <CardHeader>
                <CardTitle className="text-gray-800 dark:text-white">Top Emotion Tags</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Most frequently logged specific emotions.</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[300px] w-full">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No tags data available.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: 'currentColor', opacity: 0.1 }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', opacity: 0.9 }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
