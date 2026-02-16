
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';

export default function TermsOfService() {
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
                        <FileText className="w-8 h-8 text-blue-400" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Terms of Service
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
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using InnerHue (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.
                                In addition, when using the Service, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                            <p>
                                InnerHue is a digital wellbeing platform designed to help users track their moods, journal their thoughts, and receive personalized insights.
                                The Service is for informational and educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. User Conduct</h2>
                            <p className="mb-4">
                                You agree to use the Service only for lawful purposes. You are prohibited from posting or transmitting to or from this Site any:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-blue-400">
                                <li>Unlawful, threatening, libelous, defamatory, obscene, or pornographic material.</li>
                                <li>Material that would violate the law or rights of others.</li>
                                <li>Viruses or other harmful components.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Disclaimer of Warranties</h2>
                            <p>
                                The Site and its original content, features, and functionality are owned by InnerHue and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
                            <p>
                                In no event shall InnerHue, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to Terms</h2>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
