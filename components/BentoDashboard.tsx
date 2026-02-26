'use client';

import { motion, Variants } from 'framer-motion';
import { TrendingUp, Calendar, Heart, Target, Sparkles } from 'lucide-react';
import { useMoodStore } from '@/lib/useMoodStore';
import MoodBarChart from '@/components/MoodBarChart';

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    }),
};

export function BentoDashboard() {
    const stats = useMoodStore(state => state.stats);
    const chartData = Object.entries(stats.moodCounts).map(([mood, count]) => ({
        mood,
        count
    })).sort((a, b) => b.count - a.count);

    const statCards = [
        {
            icon: Heart,
            label: 'Total Reflections',
            value: stats.totalEntries,
            color: 'bg-purple-500/20',
            textColor: 'text-purple-300',
            size: 'col-span-1',
        },
        {
            icon: Calendar,
            label: 'Today',
            value: stats.todayEntries,
            color: 'bg-blue-500/20',
            textColor: 'text-blue-300',
            size: 'col-span-1',
        },
        {
            icon: TrendingUp,
            label: 'This Week',
            value: stats.weekEntries,
            color: 'bg-green-500/20',
            textColor: 'text-green-300',
            size: 'col-span-1',
        },
        {
            icon: Target,
            label: 'Most Common',
            value: stats.mostCommonMood
                ? stats.mostCommonMood.charAt(0).toUpperCase() + stats.mostCommonMood.slice(1)
                : 'None',
            color: 'bg-pink-500/20',
            textColor: 'text-pink-300',
            size: 'col-span-1',
            isText: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stat Cards — Bento Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -2 }}
                        className={`relative overflow-hidden rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${card.size}
                        bg-white/5 backdrop-blur-lg border border-white/10`}
                    >
                        <div className={`inline-flex p-2.5 rounded-xl ${card.color} mb-3 shadow-sm`}>
                            <card.icon className={`w-5 h-5 ${card.textColor}`} />
                        </div>

                        <div className={`text-2xl font-semibold ${card.textColor} mb-1`}>
                            {card.value}
                        </div>
                        <div className="text-xs text-white/60 font-medium">{card.label}</div>

                        {/* Subtle progress indicator */}
                        <div className="mt-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${card.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{
                                    width: card.isText ? '100%' : `${Math.min((card.value as number) * 10, 100)}%`,
                                }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Large Chart Card */}
            <motion.div
                custom={4}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-3xl p-6 shadow-sm bg-white/5 backdrop-blur-lg border border-white/10"
            >
                <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                        <Sparkles className="w-4 h-4 text-purple-300" />
                    </div>
                    <h3 className="font-semibold text-white">Mood Frequency</h3>
                </div>
                <MoodBarChart data={chartData} />
            </motion.div>
        </div>
    );
}
