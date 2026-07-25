'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  Sparkles,
  TrendingUp,
  Calendar,
  BookOpen,
  Heart,
  CheckCircle2,
  BarChart3,
  Loader2,
  Flame,
  Award,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useMoodStore } from '@/lib/useMoodStore';
import { buildGrowthReportData } from '@/lib/moodAnalytics';

interface GrowthReportProps {
  isOpen: boolean;
  onClose: () => void;
  initialTimeframe?: 'weekly' | 'monthly';
}

export function GrowthReport({
  isOpen,
  onClose,
  initialTimeframe = 'weekly',
}: GrowthReportProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>(initialTimeframe);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const moodHistory = useMoodStore((s) => s.moodHistory);

  // Sync initial timeframe when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeframe(initialTimeframe);
      setExportSuccess(false);
    }
  }, [isOpen, initialTimeframe]);

  // Compute report data memoized
  const reportData = useMemo(() => {
    return buildGrowthReportData(moodHistory, timeframe);
  }, [moodHistory, timeframe]);

  // Switch timeframe with a smooth loading feedback
  const handleTimeframeChange = (newTimeframe: 'weekly' | 'monthly') => {
    if (newTimeframe === timeframe) return;
    setIsGenerating(true);
    setTimeframe(newTimeframe);
    setTimeout(() => {
      setIsGenerating(false);
    }, 250);
  };

  // Print / Export handler
  const handleExportPDF = useCallback(() => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
    }, 3500);
    window.print();
  }, []);

  // Keyboard navigation (Escape key to close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Personalized Emotional Growth Report"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md no-print"
        >
          {/* Style injection for PDF export printing */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #growth-report-printable-area,
              #growth-report-printable-area * {
                visibility: visible !important;
              }
              #growth-report-printable-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 24px !important;
                background: #ffffff !important;
                color: #111827 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
              .print-dark-text {
                color: #111827 !important;
              }
              .print-card-bg {
                background-color: #f9fafb !important;
                border-color: #e5e7eb !important;
              }
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl my-auto rounded-3xl border border-border dark:border-white/10 bg-card/95 dark:bg-gray-900/95 text-foreground shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header Control Bar (non-printable) */}
            <div className="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border dark:border-white/10 bg-card/80 dark:bg-gray-900/80 p-4 sm:p-6 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Emotional Growth Report
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Personalized insights & printable summary
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Timeframe Selector */}
                <div className="flex items-center rounded-full border border-border bg-muted/50 p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => handleTimeframeChange('weekly')}
                    className={`rounded-full px-3 py-1.5 transition-all ${
                      timeframe === 'weekly'
                        ? 'bg-purple-600 text-white shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeframeChange('monthly')}
                    className={`rounded-full px-3 py-1.5 transition-all ${
                      timeframe === 'monthly'
                        ? 'bg-purple-600 text-white shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly
                  </button>
                </div>

                {/* PDF Export Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleExportPDF}
                  className="flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all"
                  aria-label="Export Report as PDF"
                >
                  {exportSuccess ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      <span>PDF Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="h-4 w-4" />
                      <span>Export PDF</span>
                    </>
                  )}
                </motion.button>

                {/* Close Modal Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notification Toast for Export */}
            <AnimatePresence>
              {exportSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="no-print bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Opening print preview. Select &apos;Save as PDF&apos; in your printer menu to download.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Report Content Container (Print Target) */}
            <div className="overflow-y-auto p-4 sm:p-8 space-y-8 custom-scrollbar">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Generating your {timeframe} growth report...
                  </p>
                </div>
              ) : (
                <article
                  id="growth-report-printable-area"
                  className="space-y-8 text-foreground"
                >
                  {/* Printable Header */}
                  <header className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          IH
                        </div>
                        <span className="text-xl font-bold text-foreground font-playfair tracking-tight">
                          InnerHue
                        </span>
                      </div>
                      <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground font-playfair">
                        Personalized Emotional Growth Report
                      </h1>
                      <p className="text-xs text-muted-foreground mt-1">
                        A reflective synthesis of your emotional check-ins, journaling, and wellness trends.
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end text-xs text-muted-foreground space-y-1">
                      <div className="inline-flex items-center space-x-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-purple-600 dark:text-purple-300 font-semibold capitalize">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{reportData.timeframe} Report</span>
                      </div>
                      <div className="font-mono text-xs pt-1">
                        {reportData.startDate} – {reportData.endDate}
                      </div>
                      <div className="text-[11px] text-muted-foreground/80">
                        Generated: {reportData.generatedAt}
                      </div>
                    </div>
                  </header>

                  {/* Overall Emotional Progress Card */}
                  <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10 p-6 shadow-sm print-card-bg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                            Emotional Trajectory
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                          {reportData.overallProgress.status}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xl">
                          {reportData.overallProgress.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card/80 border border-border shadow-sm min-w-[130px] print-card-bg">
                        <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                          {reportData.overallProgress.score}%
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Positivity Ratio
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Statistics Summary Grid */}
                  <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm print-card-bg">
                      <div className="flex items-center space-x-2 text-muted-foreground text-xs font-medium">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                        <span>Total Reflections</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-foreground">
                        {reportData.totalEntries}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ~{reportData.dailyAverage} per day
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm print-card-bg">
                      <div className="flex items-center space-x-2 text-muted-foreground text-xs font-medium">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span>Dominant Emotion</span>
                      </div>
                      <p className="mt-2 text-xl font-bold capitalize text-foreground truncate">
                        {reportData.mostCommonMood || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Top recorded state
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm print-card-bg">
                      <div className="flex items-center space-x-2 text-muted-foreground text-xs font-medium">
                        <BookOpen className="h-4 w-4 text-cyan-500" />
                        <span>Journaling Rate</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-foreground">
                        {reportData.journalingRate}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {reportData.entriesWithNotesCount} written entries
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm print-card-bg">
                      <div className="flex items-center space-x-2 text-muted-foreground text-xs font-medium">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>Reflection Streak</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-foreground">
                        {reportData.streak.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Best: {reportData.streak.longestStreak} days
                      </p>
                    </div>
                  </section>

                  {/* Mood Frequency Breakdown */}
                  <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-bold text-foreground">
                        Mood & Emotion Frequency
                      </h3>
                    </div>

                    {reportData.moodFrequencies.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4">
                        No mood logs recorded for this period.
                      </p>
                    ) : (
                      <div className="space-y-3 rounded-2xl border border-border bg-card/50 p-5 shadow-sm print-card-bg">
                        {reportData.moodFrequencies.map((item) => (
                          <div key={item.mood} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="capitalize text-foreground">{item.mood}</span>
                              <span className="text-muted-foreground">
                                {item.count} check-in{item.count === 1 ? '' : 's'} ({item.percentage}%)
                              </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${Math.max(4, item.percentage)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Emotional Trends Section */}
                  <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-bold text-foreground">
                        Daily Reflection Breakdown
                      </h3>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {reportData.trendData.slice(-7).map((point, idx) => (
                        <div
                          key={point.date || idx}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card/60 text-center shadow-xs print-card-bg"
                        >
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {point.label}
                          </span>
                          <span className="mt-1 text-lg font-bold text-purple-600 dark:text-purple-300">
                            {point.count}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize truncate w-full px-1">
                            {point.mood || '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Positive Insights Section */}
                  <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-bold text-foreground">
                        Mindfulness Insights
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {reportData.positiveInsights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 rounded-2xl border border-purple-500/15 bg-purple-500/5 p-4 text-xs text-foreground print-card-bg"
                        >
                          <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Journal Excerpts / Reflection Highlights */}
                  {reportData.reflectionHighlights.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-bold text-foreground">
                          Recent Reflections & Journal Excerpts
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {reportData.reflectionHighlights.map((note, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-border bg-card/60 p-4 text-xs italic text-muted-foreground shadow-xs print-card-bg"
                          >
                            &ldquo;{note}&rdquo;
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Printable Footer */}
                  <footer className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>InnerHue Wellness Platform — Stored locally & securely</span>
                    </div>

                    <div className="text-right">
                      <p>Personalized Emotional Growth Report</p>
                      <p className="text-[10px] opacity-75">
                        Page 1 of 1 • Generated {reportData.generatedAt}
                      </p>
                    </div>
                  </footer>
                </article>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
