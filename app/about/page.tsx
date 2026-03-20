
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, Heart, Users, Sparkles, BrainCircuit } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AboutUs() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    };

    return (
        <main id="main" className="min-h-screen bg-[#0f0720] relative overflow-hidden text-white font-sans">
            <FloatingBackground />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 relative"
                >
                    {/* Back Link */}
                    <motion.div
                        whileHover={{ x: -4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="inline-block"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors duration-200 group"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <div className="absolute right-0 top-0">
                        <ThemeToggle />
                    </div>

                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                            {/* Animated Heart Icon */}
                            <motion.div
                                whileHover={{ scale: 1.3, rotate: [0, -10, 10, -6, 6, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <Heart className="w-10 h-10 text-pink-500 fill-pink-500 animate-pulse" />
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                                About InnerHue
                            </h1>
                        </div>
                        <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                            Your mindful companion for navigating the complex landscape of human emotions.
                        </p>
                    </div>
                </motion.header>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-8 md:grid-cols-2"
                >
                    {/* Mission Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: '0 0 40px rgba(168, 85, 247, 0.25)',
                            borderColor: 'rgba(168, 85, 247, 0.4)',
                        }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className="md:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 cursor-default"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <motion.span
                                whileHover={{ rotate: 20, scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="inline-block"
                            >
                                <Sparkles className="w-8 h-8 text-yellow-300" />
                            </motion.span>
                            Our Mission
                        </h2>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            In a world that never stops moving, it&apos;s easy to lose touch with how we really feel.
                            <strong> InnerHue</strong> was born from a simple belief: acknowledging your emotions is the first step towards well-being.
                            We aim to provide a safe, beautiful, and intuitive space where you can pause, reflect, and find clarity amidst the chaos.
                        </p>
                    </motion.div>

                    {/* How It Works Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.04,
                            boxShadow: '0 0 36px rgba(168, 85, 247, 0.3)',
                            borderColor: 'rgba(168, 85, 247, 0.35)',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/5 cursor-default"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: -8, backgroundColor: 'rgba(168, 85, 247, 0.35)' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                            className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-300"
                        >
                            <BrainCircuit className="w-7 h-7" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
                        <p className="text-gray-300 leading-relaxed">
                            InnerHue uses color psychology and mood tracking to help you visualize your emotional state.
                            By selecting your current mood, you unlock personalized journal prompts, inspirational quotes, and
                            curated resources designed to support exactly how you&apos;re feeling right now.
                        </p>
                    </motion.div>

                    {/* Community / For Everyone Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.04,
                            boxShadow: '0 0 36px rgba(59, 130, 246, 0.3)',
                            borderColor: 'rgba(59, 130, 246, 0.35)',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/5 cursor-default"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 8, backgroundColor: 'rgba(59, 130, 246, 0.35)' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                            className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-300"
                        >
                            <Users className="w-7 h-7" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-4">For Everyone</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Whether you&apos;re feeling overwhelmed, ecstatic, or somewhere in between, InnerHue is here for you.
                            We believe that every emotion is valid and deserves to be heard. There is no &quot;right&quot; or &quot;wrong&quot; way to feel—only
                            your unique human experience.
                        </p>
                    </motion.div>

                    {/* Closing Statement */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className="md:col-span-2 text-center py-12 cursor-default"
                    >
                        <motion.h3
                            whileHover={{
                                scale: 1.05,
                                textShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
                            }}
                            transition={{ duration: 0.3 }}
                            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-6 inline-block"
                        >
                            &quot;To feel is to be human.&quot;
                        </motion.h3>
                        <p className="text-gray-400">
                            Thank you for being part of our journey.
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </main>
    );
}
