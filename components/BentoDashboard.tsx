'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Heart, Target, Sparkles } from 'lucide-react';
import { useMoodStore } from '@/lib/useMoodStore';
import { MoodChart } from '@/components/MoodChart';

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.08, type: 'spring' as const, stiffness: 120, damping: 16 },
    }),
};

export function BentoDashboard() {
    const stats = useMoodStore(state => state.stats);

    const statCards = [
        {
            icon: Heart,
            label: 'Total Reflections',
            value: stats.totalEntries,
            gradient: 'from-violet-500 to-purple-600',
            glow: 'shadow-violet-500/30',
            size: 'col-span-1',
        },
        {
            icon: Calendar,
            label: 'Today',
            value: stats.todayEntries,
            gradient: 'from-blue-500 to-cyan-500',
            glow: 'shadow-blue-500/30',
            size: 'col-span-1',
        },
        {
            icon: TrendingUp,
            label: 'This Week',
            value: stats.weekEntries,
            gradient: 'from-emerald-500 to-teal-500',
            glow: 'shadow-emerald-500/30',
            size: 'col-span-1',
        },
        {
            icon: Target,
            label: 'Most Common',
            value: stats.mostCommonMood
                ? stats.mostCommonMood.charAt(0).toUpperCase() + stats.mostCommonMood.slice(1)
                : 'None',
            gradient: 'from-orange-500 to-pink-500',
            glow: 'shadow-orange-500/30',
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
                        whileHover={{ scale: 1.03, y: -3 }}
                        className={`relative overflow-hidden rounded-2xl p-5 shadow-xl ${card.glow} ${card.size}`}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                        }}
                    >
                        {/* Gradient accent blob */}
                        <div
                            className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl`}
                        />

                        <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} mb-3 shadow-lg`}>
                            <card.icon className="w-5 h-5 text-white" />
                        </div>

                        <div className={`text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-1`}>
                            {card.value}
                        </div>
                        <div className="text-xs text-white/50 font-medium">{card.label}</div>

                        {/* Animated progress bar */}
                        <div className="mt-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{
                                    width: card.isText ? '100%' : `${Math.min((card.value as number) * 10, 100)}%`,
                                }}
                                transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }}
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
                className="rounded-3xl p-6 shadow-2xl"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255,255,255,0.10)',
                }}
            >
                <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-white/90">Mood Frequency</h3>
                </div>
                <MoodChart />
            </motion.div>
        </div>
    );
}
