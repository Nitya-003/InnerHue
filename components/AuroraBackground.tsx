'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AuroraBackgroundProps {
    emotionColor?: string;
    emotionGlow?: string;
}

// Maps emotion color hex to aurora gradient stops
function buildAurora(color: string, glow: string) {
    return [
        `${color}33`,   // 20% opacity
        `${glow}22`,    // 13% opacity
        'transparent',
    ];
}

const defaultColors = {
    color: '#7c3aed',
    glow: '#a855f7',
};

export function AuroraBackground({ emotionColor, emotionGlow }: AuroraBackgroundProps) {
    const color = emotionColor ?? defaultColors.color;
    const glow = emotionGlow ?? defaultColors.glow;

    const [orbs, setOrbs] = useState<
        { id: number; x: number; y: number; size: number; delay: number; dur: number }[]
    >([]);

    useEffect(() => {
        setOrbs(
            Array.from({ length: 7 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 200 + Math.random() * 300,
                delay: i * 0.6,
                dur: 6 + Math.random() * 5,
            }))
        );
    }, []);

    const aurora = buildAurora(color, glow);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Deep base gradient — shifts with emotion */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={color}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    style={{
                        background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, ${aurora[0]} 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 80% 70%, ${aurora[1]} 0%, transparent 60%),
              linear-gradient(135deg, #0f0720 0%, #0a0a1a 50%, #0d0520 100%)
            `,
                    }}
                />
            </AnimatePresence>

            {/* Floating aurora orbs */}
            {orbs.map((orb) => (
                <motion.div
                    key={orb.id}
                    className="absolute rounded-full"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                        background: `radial-gradient(circle, ${color}28 0%, ${glow}14 40%, transparent 70%)`,
                        filter: 'blur(40px)',
                    }}
                    animate={{
                        x: [0, 30 - Math.random() * 60, 0],
                        y: [0, 20 - Math.random() * 40, 0],
                        scale: [1, 1.15, 1],
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                        duration: orb.dur,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: orb.delay,
                    }}
                />
            ))}

            {/* Subtle noise grain overlay */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }}
            />
        </div>
    );
}
