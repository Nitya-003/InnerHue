
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, Shield } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden text-gray-100 font-sans">
            <FloatingBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors group">
                        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-8 h-8 text-pink-400" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                            Privacy Policy
                        </h1>
                    </div>
                    <p className="text-lg text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10"
                >
                    <div className="space-y-8 text-gray-200 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to InnerHue. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Data We Collect</h2>
                            <p className="mb-4">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-purple-400">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (e.g., mood logs, journal entries).</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-purple-400">
                                <li>To provide insights and personalized recommendations based on your mood.</li>
                                <li>To improve our website, products/services, marketing or customer relationships.</li>
                                <li>To manage your account and secure our platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                Your emotional data is treated with the highest level of sensitivity and confidentiality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                <a href="mailto:support@innerhue.app" className="text-pink-400 hover:text-pink-300 ml-1 transition-colors">support@innerhue.app</a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
