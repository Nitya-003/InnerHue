export interface MoodAnalyticsEntry {
  timestamp: string;
  mood: string;
  emotion?: string;
  notes?: string;
}

export interface MoodTrendPoint {
  label: string;
  date: string;
  count: number;
  mood: string | null;
}

export interface HourlyPoint {
  hour: string;
  count: number;
}

export interface MoodStreakSummary {
  currentStreak: number;
  longestStreak: number;
  latestEntryDate: string | null;
}

export function buildMoodTrendData(entries: MoodAnalyticsEntry[], referenceDate: Date = new Date()): MoodTrendPoint[] {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setUTCDate(referenceDate.getUTCDate() - (6 - index));
    return date;
  });

  return days.map((day) => {
    const start = new Date(day);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setUTCHours(23, 59, 59, 999);

    const dayEntries = entries.filter((entry) => {
      const timestamp = new Date(entry.timestamp);
      return timestamp >= start && timestamp <= end;
    });

    const dominantMood = dayEntries.reduce<Record<string, number>>((acc, entry) => {
      const mood = entry.emotion || entry.mood || 'unknown';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    const mostCommonMood = Object.entries(dominantMood).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      label: day.toLocaleDateString('en', { weekday: 'short' }),
      date: day.toISOString().slice(0, 10),
      count: dayEntries.length,
      mood: mostCommonMood,
    };
  });
}

export function buildHourlyDistribution(entries: MoodAnalyticsEntry[]): HourlyPoint[] {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour.toString().padStart(2, '0')}:00`, count: 0 }));

  entries.forEach((entry) => {
    const hour = new Date(entry.timestamp).getUTCHours();
    buckets[hour].count += 1;
  });

  return buckets;
}

export function getMoodStreakSummary(entries: MoodAnalyticsEntry[], referenceDate: Date = new Date()): MoodStreakSummary {
  const sorted = [...entries]
    .map((entry) => ({ ...entry, timestamp: new Date(entry.timestamp) }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const latestDate = sorted[0]?.timestamp ?? referenceDate;
  const latestDay = new Date(latestDate);
  latestDay.setUTCHours(0, 0, 0, 0);

  const seenDays = new Set<string>();
  sorted.forEach((entry) => {
    const day = new Date(entry.timestamp);
    day.setUTCHours(0, 0, 0, 0);
    seenDays.add(day.toISOString().slice(0, 10));
  });

  const today = new Date(referenceDate);
  today.setUTCHours(0, 0, 0, 0);

  let currentStreak = 0;
  const cursor = new Date(today);
  while (seenDays.has(cursor.toISOString().slice(0, 10))) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let longestStreak = 0;
  let tempStreak = 0;
  const dates = Array.from(seenDays).sort();
  let previousDate: Date | null = null;

  dates.forEach((dateString) => {
    const currentDate = new Date(dateString);
    if (previousDate && (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
      tempStreak += 1;
    } else {
      tempStreak = 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    previousDate = currentDate;
  });

  return {
    currentStreak,
    longestStreak,
    latestEntryDate: latestDate.toISOString(),
  };
}

export interface MoodFrequencyItem {
  mood: string;
  count: number;
  percentage: number;
}

export interface GrowthReportData {
  timeframe: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalEntries: number;
  dailyAverage: number;
  mostCommonMood: string | null;
  moodFrequencies: MoodFrequencyItem[];
  entriesWithNotesCount: number;
  journalingRate: number;
  positiveCount: number;
  positivePercentage: number;
  streak: MoodStreakSummary;
  trendData: MoodTrendPoint[];
  reflectionHighlights: string[];
  positiveInsights: string[];
  overallProgress: {
    status: string;
    description: string;
    score: number;
  };
  generatedAt: string;
}

const POSITIVE_MOOD_KEYWORDS = [
  'happy', 'joy', 'calm', 'peaceful', 'excited', 'content', 'grateful',
  'serene', 'cheerful', 'relaxed', 'positive', 'zen', 'hopeful', 'blessed',
  'loved', 'confident', 'optimistic', 'motivated', 'energetic', 'playful'
];

function getTimeOfDayLabel(entries: MoodAnalyticsEntry[]): string {
  if (entries.length === 0) return 'evening';
  const hoursCount: Record<string, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };
  entries.forEach((e) => {
    const hour = new Date(e.timestamp).getHours();
    if (hour >= 5 && hour < 12) hoursCount.morning += 1;
    else if (hour >= 12 && hour < 17) hoursCount.afternoon += 1;
    else if (hour >= 17 && hour < 22) hoursCount.evening += 1;
    else hoursCount.night += 1;
  });

  let topPeriod = 'evening';
  let maxCount = -1;
  Object.entries(hoursCount).forEach(([period, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topPeriod = period;
    }
  });
  return topPeriod;
}

export function buildGrowthReportData(
  entries: MoodAnalyticsEntry[],
  timeframe: 'weekly' | 'monthly' = 'weekly',
  referenceDate: Date = new Date()
): GrowthReportData {
  const daysCount = timeframe === 'weekly' ? 7 : 30;

  const endDateObj = new Date(referenceDate);
  const startDateObj = new Date(referenceDate);
  startDateObj.setDate(startDateObj.getDate() - (daysCount - 1));
  startDateObj.setHours(0, 0, 0, 0);

  const startDateStr = startDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDateStr = endDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const filteredEntries = entries.filter((entry) => {
    const ts = new Date(entry.timestamp);
    return ts >= startDateObj && ts <= endDateObj;
  });

  const totalEntries = filteredEntries.length;
  const dailyAverage = Math.round((totalEntries / daysCount) * 10) / 10;

  // Mood Frequency
  const counts: Record<string, number> = {};
  filteredEntries.forEach((entry) => {
    const moodName = entry.emotion || entry.mood || 'Unspecified';
    counts[moodName] = (counts[moodName] || 0) + 1;
  });

  const moodFrequencies: MoodFrequencyItem[] = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([mood, count]) => ({
      mood,
      count,
      percentage: totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0,
    }));

  const mostCommonMood = moodFrequencies[0]?.mood ?? null;

  // Journaling Activity
  const entriesWithNotes = filteredEntries.filter(
    (e) => e.notes && e.notes.trim().length > 0
  );
  const entriesWithNotesCount = entriesWithNotes.length;
  const journalingRate =
    totalEntries > 0 ? Math.round((entriesWithNotesCount / totalEntries) * 100) : 0;

  const reflectionHighlights = entriesWithNotes
    .slice()
    .reverse()
    .slice(0, 5)
    .map((e) => e.notes?.trim() || '');

  // Sentiment Analysis
  let positiveCount = 0;
  filteredEntries.forEach((entry) => {
    const moodLabel = (entry.emotion || entry.mood || '').toLowerCase();
    const isPositive = POSITIVE_MOOD_KEYWORDS.some((kw) => moodLabel.includes(kw));
    if (isPositive) {
      positiveCount += 1;
    }
  });

  const positivePercentage =
    totalEntries > 0 ? Math.round((positiveCount / totalEntries) * 100) : 0;

  // Overall Emotional Progress
  let status = 'Gently Evolving';
  let description =
    'Every emotion logged is a step toward self-discovery and inner strength.';
  let score = 50;

  if (totalEntries === 0) {
    status = 'Awaiting Reflections';
    description = 'Start logging your moods to unlock personalized growth analysis.';
    score = 0;
  } else if (positivePercentage >= 70) {
    status = 'Consistently Radiant';
    description =
      'Your emotional journey reflects high resilience, joy, and inner balance.';
    score = Math.min(100, 75 + Math.round(positivePercentage * 0.25));
  } else if (positivePercentage >= 40) {
    status = 'Balanced & Reflective';
    description =
      'You are navigating emotions with steady self-awareness and mindful growth.';
    score = Math.min(85, 50 + Math.round(positivePercentage * 0.35));
  } else {
    status = 'Mindfully Growing';
    description =
      'Acknowledging challenging emotions fosters deeper emotional wisdom over time.';
    score = Math.max(35, 30 + Math.round(positivePercentage * 0.4));
  }

  // Trend Data for timeframe
  const trendDays = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() - (daysCount - 1 - i));
    return d;
  });

  const trendData: MoodTrendPoint[] = trendDays.map((day) => {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);

    const dayEntries = filteredEntries.filter((e) => {
      const ts = new Date(e.timestamp);
      return ts >= start && ts <= end;
    });

    const dayCounts: Record<string, number> = {};
    dayEntries.forEach((e) => {
      const label = e.emotion || e.mood || 'unknown';
      dayCounts[label] = (dayCounts[label] || 0) + 1;
    });

    const dominant =
      Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      label: day.toLocaleDateString('en-US', {
        weekday: daysCount <= 7 ? 'short' : undefined,
        month: daysCount > 7 ? 'numeric' : undefined,
        day: 'numeric',
      }),
      date: day.toISOString().slice(0, 10),
      count: dayEntries.length,
      mood: dominant,
    };
  });

  // Streak
  const streak = getMoodStreakSummary(entries, referenceDate);

  // Positive Insights
  const insights: string[] = [];
  if (totalEntries > 0) {
    if (mostCommonMood) {
      const topPct = moodFrequencies[0]?.percentage || 0;
      insights.push(
        `Your most frequently logged emotion was "${mostCommonMood}", accounting for ${topPct}% of your check-ins.`
      );
    }

    if (positivePercentage > 0) {
      insights.push(
        `${positivePercentage}% of your recorded reflections represented calm, joyful, or uplifting states.`
      );
    } else {
      insights.push(
        `Logging all emotions—both light and heavy—builds meaningful emotional awareness.`
      );
    }

    if (journalingRate >= 40) {
      insights.push(
        `You maintained strong journaling depth, writing reflections in ${journalingRate}% of your entries.`
      );
    } else if (entriesWithNotesCount > 0) {
      insights.push(
        `You wrote ${entriesWithNotesCount} detailed journal reflections during this ${timeframe} period.`
      );
    } else {
      insights.push(
        `Adding brief journal notes to mood check-ins helps unlock deeper self-reflection.`
      );
    }

    const peakTime = getTimeOfDayLabel(filteredEntries);
    insights.push(
      `You were most active in reflecting on your emotions during the ${peakTime}.`
    );

    if (streak.currentStreak > 1) {
      insights.push(
        `You have sustained an active ${streak.currentStreak}-day reflection streak!`
      );
    }
  } else {
    insights.push('Log your daily emotions to generate personalized growth insights.');
  }

  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return {
    timeframe,
    startDate: startDateStr,
    endDate: endDateStr,
    totalEntries,
    dailyAverage,
    mostCommonMood,
    moodFrequencies,
    entriesWithNotesCount,
    journalingRate,
    positiveCount,
    positivePercentage,
    streak,
    trendData,
    reflectionHighlights,
    positiveInsights: insights,
    overallProgress: {
      status,
      description,
      score,
    },
    generatedAt,
  };
}

