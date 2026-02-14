'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="w-12 h-12" />; // Placeholder to prevent layout jump
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative p-3 rounded-full bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/40 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0, rotate: -90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Moon className="w-6 h-6 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ scale: 0, rotate: 90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Sun className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                    </motion.div>
                )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
