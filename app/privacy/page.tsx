
'use client';
export const dynamic = "force-dynamic";
import React from 'react';

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
    const [activeSection, setActiveSection] = React.useState("section-0");

    React.useEffect(() => {
        const handleScroll = () => {
            const sectionsEls = document.querySelectorAll("section[id^='section-']");
            sectionsEls.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 120 && rect.bottom >= 120) {
                    setActiveSection(section.id);
                }
            });
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                <span>If you have questions about this policy, contact us at <a href="mailto:support@innerhue.app" className="text-cyan-400 underline hover:text-cyan-300">support@innerhue.app</a></span>,
        },
    ];

    return (
        <div className="bg-[#0b0f19] text-gray-200 min-h-screen relative">
            {/* Soft Premium Background Glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.12),transparent_40%)]" />
            <div className="max-w-7xl mx-auto px-6 py-20 flex gap-16">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:block w-64 sticky top-24 h-fit">
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-8">
                        On this page
                    </div>
                    <nav className="space-y-4 text-sm relative">
                        {sections.map((section, index) => {
                            const sectionId = `section-${index}`;
                            const isActive = activeSection === sectionId;
                            return (
                                <a
                                    key={index}
                                    href={`#${sectionId}`}
                                    className={`group flex items-center gap-3 transition-all duration-300 font-medium ${
                                        isActive ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
                                    }`}
                                >
                                    <span className={`h-6 w-[3px] rounded-full transition-all duration-300 ${
                                        isActive ? "bg-cyan-400" : "bg-transparent group-hover:bg-cyan-400/40"
                                    }`} />
                                    <span className={`transition-all duration-300 group-hover:translate-x-1 ${
                                        isActive ? "text-cyan-400" : "group-hover:text-cyan-400"
                                    }`}>
                                        {section.title}
                                    </span>
                                </a>
                            );
                        })}
                    </nav>
                </aside>
                {/* Main Content */}
                <div className="flex-1 max-w-3xl">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 mb-10 group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Back to Home
                    </Link>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Last updated: {new Date().toLocaleDateString("en-GB")}
                    </p>
                    <div className="space-y-12">
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <motion.section
                                    id={`section-${index}`}
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="scroll-mt-32 relative group rounded-xl border border-white/10 bg-gradient-to-br from-[#181c2a] via-[#232a3d] to-[#1a2236] p-8 shadow-md"
                                >
                                    {/* Glow Hover Effect */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
                                    {/* Animated Left Border */}
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-gradient-to-b from-cyan-400 to-indigo-500 transition-all duration-500 rounded-full" />
                                    <div className="pl-6">
                                        <h2 className="text-2xl font-semibold text-white mb-6 transition-colors duration-300 group-hover:text-cyan-400 flex items-center gap-2">
                                            <span className="inline-block w-6 h-6 bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 rounded-full mr-2" />
                                            {section.title}
                                        </h2>
                                        <div className="text-gray-400 leading-relaxed space-y-4 text-[15.5px] group-hover:text-gray-300 transition-colors duration-300">
                                            {section.content}
                                        </div>
                                    </div>
                                </motion.section>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
