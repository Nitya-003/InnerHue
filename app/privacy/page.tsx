'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ChevronLeft,
    Shield,
    Database,
    Settings,
    Lock,
    Mail
} from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';

export default function PrivacyPolicy() {

    const sections = [
        {
            title: "Introduction",
            icon: Shield,
            content:
                "Welcome to InnerHue. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information and your rights.",
        },
        {
            title: "Data We Collect",
            icon: Database,
            content:
                "We may collect Identity Data (name, username), Contact Data (email), Usage Data (mood logs, journal entries), and Technical Data (IP address, browser type, login data).",
        },
        {
            title: "How We Use Your Data",
            icon: Settings,
            content:
                "We use your data to provide personalized insights, improve user experience, maintain platform security, and enhance our services.",
        },
        {
            title: "Data Security",
            icon: Lock,
            content:
                "We implement strong security measures to protect your data from unauthorized access, alteration, or disclosure. Your emotional data is handled with strict confidentiality.",
        },
        {
            title: "Contact Us",
            icon: Mail,
            content:
                "If you have questions about this policy, contact us at support@innerhue.app",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-100">

            {/* Background Glow */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse"></div>

            <FloatingBackground />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Privacy Policy
                    </h1>

                    <p className="mt-4 text-gray-400">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </motion.div>

                {/* CARD GRID */}
                <div className="grid md:grid-cols-2 gap-8">

                    {sections.map((section, index) => {
                        const Icon = section.icon;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                whileHover={{
                                    scale: 1.04,
                                    rotateX: 3,
                                    rotateY: -3,
                                }}
                                className="relative group"
                            >
                                {/* Gradient Border Glow */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                {/* Card */}
                                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 group-hover:border-purple-400/40">

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-700/40"
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </motion.div>

                                    <h2 className="text-2xl font-semibold mb-4 text-white">
                                        {index + 1}. {section.title}
                                    </h2>

                                    <p className="text-gray-300 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}

                </div>

            </div>
        </div>
    );
}
