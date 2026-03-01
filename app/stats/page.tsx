'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Info, Music } from 'lucide-react';
import { useAdvancedStats, TimeRange } from '@/hooks/useAdvancedStats';
import { WeeklyMonthlyTrend } from '@/components/stats/WeeklyMonthlyTrend';
import { MoodFrequency } from '@/components/stats/MoodFrequency';
import { EmotionTagsAnalytics } from '@/components/stats/EmotionTagsAnalytics';
import { TimeBasedAnalysis } from '@/components/stats/TimeBasedAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function StatsDashboard() {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const { trendData, moodDistribution, emotionTagsData, timeBasedData, totalEntries } = useAdvancedStats(timeRange);

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-[#0a091a] dark:via-[#161233] dark:to-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-500">
            {/* Background Aura */}
            <AuroraBackground emotionColor="#9333ea" emotionGlow="#d8b4fe" />

            {/* Main Container */}
            <main className="relative z-10 px-4 py-8 md:px-6 md:py-12 max-w-7xl mx-auto flex flex-col gap-6">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative z-10 w-full mb-6 md:mb-8"
                >
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                            <Link href="/" className="inline-flex items-center text-sm text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-white mb-2 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Emotional Insights
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
                                Understand your mood patterns and emotional wellness journey.
                            </p>
                        </div>

                        <nav className="flex flex-col md:flex-row items-end md:items-center space-y-4 md:space-y-0 md:space-x-3 mt-4 md:mt-0">
                            {/* Time Range Selector */}
                            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/20 mr-2">
                                {(['7d', '30d', 'all'] as TimeRange[]).map((range) => (
                                    <Button
                                        key={range}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setTimeRange(range)}
                                        className={`rounded-md px-3 md:px-4 capitalize transition-all ${timeRange === range
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {range === 'all' ? 'All Time' : range.toUpperCase()}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Link href="/music" aria-label="Relaxing Music">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="p-2 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/10 dark:border-white/10"
                                        title="Music"
                                    >
                                        <Music className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-white" />
                                    </motion.div>
                                </Link>
                                <ThemeToggle />
                            </div>
                        </nav>
                    </div>
                </motion.header>

                {/* Global Summary Metric */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <Card className="bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/10 backdrop-blur-md shadow-lg transition-colors duration-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-300 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Total Entries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-800 dark:text-white mb-1">{totalEntries}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Logged {timeRange === '7d' ? 'this week' : timeRange === '30d' ? 'this month' : 'overall'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/10 backdrop-blur-md shadow-lg transition-colors duration-500 md:col-span-2 flex items-center p-6">
                        <div className="flex gap-4 items-center w-full">
                            <div className="bg-purple-100 dark:bg-purple-500/20 p-3 rounded-full flex-shrink-0">
                                <Info className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <h3 className="font-medium text-lg text-gray-800 dark:text-white">Did you know?</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    Visualizing emotional data helps increase self-awareness. Over time, spotting these trends makes it easier to identify what brings you joy and what causes stress.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2"
                >
                    {/* Trend Area Chart spanning full width on md+ */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <WeeklyMonthlyTrend data={trendData} timeRange={timeRange} />
                    </div>

                    {/* Pie Chart */}
                    <MoodFrequency data={moodDistribution} />

                    {/* Emotion Tags Bar Chart */}
                    <EmotionTagsAnalytics data={emotionTagsData} />

                    {/* Time Based Heatmap/Bar */}
                    <TimeBasedAnalysis data={timeBasedData} />
                </motion.div>

            </main>
        </div>
    );
}
