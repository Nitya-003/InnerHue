'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const }
  }
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#14143b] to-[#0c1025] text-gray-100">
      
      <FloatingBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center text-indigo-400 hover:text-cyan-400 transition-all duration-300 group mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform duration-300" />
            Back to Home
          </Link>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <FileText className="w-10 h-10 text-cyan-400 drop-shadow-lg" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>

          <p className="mt-4 text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                y: -8,
                scale: 1.03
              }}
              className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300 group"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none"></div>

              <h2 className="text-xl font-semibold text-white mb-4 relative z-10">
                {section.title}
              </h2>

              <div className="text-gray-300 leading-relaxed relative z-10">
                {section.content}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: (
      <p>
        By accessing and using InnerHue ("the Service"), you agree to be bound
        by these Terms. If you do not agree, discontinue use immediately.
      </p>
    )
  },
  {
    title: "2. Description of Service",
    content: (
      <p>
        InnerHue is a digital wellbeing platform designed to help users track
        moods, journal thoughts, and receive insights. It does not replace
        professional medical advice.
      </p>
    )
  },
  {
    title: "3. User Conduct",
    content: (
      <ul className="list-disc pl-6 space-y-2 marker:text-cyan-400">
        <li>No unlawful or harmful content.</li>
        <li>No IP violations.</li>
        <li>No malware distribution.</li>
      </ul>
    )
  },
  {
    title: "4. Disclaimer of Warranties",
    content: (
      <p>
        The Service is provided "as is" and without warranties of any kind,
        express or implied.
      </p>
    )
  },
  {
    title: "5. Limitation of Liability",
    content: (
      <p>
        InnerHue shall not be liable for indirect or consequential damages
        arising from use of the Service.
      </p>
    )
  },
  {
    title: "6. Changes to Terms",
    content: (
      <p>
        We reserve the right to modify these Terms at any time. Continued use
        constitutes acceptance of changes.
      </p>
    )
  }
];
