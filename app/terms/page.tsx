'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TermsOfService() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeSection, setActiveSection] = useState<string>("1");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
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

  return (
    <div className="bg-[#0b0f19] text-gray-200 min-h-screen relative">
      {/* Soft Premium Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.12),transparent_40%)]" />
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 origin-left z-50"
      />
      <div className="max-w-7xl mx-auto px-6 py-20 flex gap-16">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 sticky top-24 h-fit">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-8">
            On this page
          </div>
          <nav className="space-y-4 text-sm relative">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`group flex items-center gap-3 transition-all duration-300 ${activeSection === section.id
                  ? "text-cyan-400 font-semibold"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                {/* Active Indicator */}
                <span
                  className={`h-6 w-[3px] rounded-full transition-all duration-300 ${activeSection === section.id
                    ? "bg-gradient-to-b from-cyan-400 to-indigo-500"
                    : "bg-transparent group-hover:bg-white/30"
                    }`}
                />
                <span className="transition-all duration-300 group-hover:translate-x-1">
                  {section.title}
                </span>
              </a>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main id="main" className="flex-1 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 mb-10 group"
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section
                id={section.id}
                key={section.id}
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
                {index !== sections.length - 1 && (
                  <div className="mt-12 border-b border-white/10 group-hover:border-white/20 transition-all duration-300"></div>
                )}
              </motion.section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

const sections = [
  {
    id: "1",
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing and using InnerHue ("the Service"), you agree to be
          legally bound by these Terms of Service.
        </p>
        <p>
          If you do not agree to these terms, you must discontinue use of the
          Service immediately.
        </p>
      </>
    ),
  },
  {
    id: "2",
    title: "2. Description of Service",
    content: (
      <>
        <p>
          InnerHue is a digital wellbeing platform that allows users to track
          moods, journal reflections, and receive AI-generated insights.
        </p>
        <p>
          The Service does not provide medical or psychiatric advice and is not
          a substitute for professional healthcare.
        </p>
      </>
    ),
  },
  {
    id: "3",
    title: "3. User Conduct",
    content: (
      <ul className="list-disc pl-6 space-y-3 marker:text-cyan-400">
        <li>Users must not post unlawful, harmful, or abusive content.</li>
        <li>Users must not violate intellectual property rights.</li>
        <li>No malware, spam, or service interference is permitted.</li>
      </ul>
    ),
  },
  {
    id: "4",
    title: "4. Disclaimer of Warranties",
    content: (
      <p>
        The Service is provided on an "as is" and "as available" basis without
        warranties of any kind, either express or implied.
      </p>
    ),
  },
  {
    id: "5",
    title: "5. Limitation of Liability",
    content: (
      <p>
        InnerHue shall not be liable for indirect, incidental, or consequential
        damages resulting from the use or inability to use the Service.
      </p>
    ),
  },
  {
    id: "6",
    title: "6. Changes to Terms",
    content: (
      <p>
        We reserve the right to update or modify these Terms at any time.
        Continued use of the Service constitutes acceptance of any changes.
      </p>
    ),
  },
];