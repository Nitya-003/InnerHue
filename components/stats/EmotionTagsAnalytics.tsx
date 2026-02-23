'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EmotionTagsAnalyticsProps {
    data: { name: string; count: number }[];
}

export function EmotionTagsAnalytics({ data }: EmotionTagsAnalyticsProps) {
    const hasData = data && data.length > 0;

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader>
                <CardTitle>Top Emotion Tags</CardTitle>
                <CardDescription>Most frequently logged specific emotions.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
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
                                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
