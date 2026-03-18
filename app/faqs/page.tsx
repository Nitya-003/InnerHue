"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function FAQsPage() {
  const faqs = [
    {
      question: "What is InnerHue?",
      answer:
        "InnerHue is a mindful companion app designed to help users reflect, understand, and grow emotionally.",
    },
    {
      question: "How does mood tracking work?",
      answer:
        "You can select your mood, view insights, and track your emotional journey over time.",
    },
    {
      question: "Is my data private?",
      answer:
        "Yes, your data is secure and handled according to our privacy policy.",
    },
    {
      question: "Can I personalize my experience?",
      answer:
        "Absolutely! You can customize mood categories, color palettes, and more.",
    },
    {
      question: "Who can I contact for support?",
      answer:
        "Please reach out via our contact page or social channels for assistance.",
    },
  ];

  return (
    <main id="main" className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-full bg-muted/40 dark:bg-white/10 backdrop-blur-md border border-border text-foreground font-medium shadow-md hover:bg-muted/60 dark:hover:bg-white/20 transition-all duration-300"
          >
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground">
          Frequently Asked Questions
        </h1>

        {/* FAQ Cards */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-muted/40 dark:bg-white/10 backdrop-blur-lg border border-border shadow-lg overflow-hidden transition-all duration-500 hover:shadow-purple-500/30 hover:border-purple-400 hover:-translate-y-1"
            >
              {/* Question */}
              <h2 className="text-lg md:text-xl font-semibold text-pink-600 dark:text-pink-300 group-hover:text-foreground transition-colors duration-300">
                {faq.question}
              </h2>

              {/* Answer (Hidden by default, show on hover) */}
              <p className="mt-4 text-muted-foreground max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                {faq.answer}
              </p>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
