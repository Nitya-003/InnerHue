import { useMemo } from 'react';
import { useMoodStore } from '@/lib/useMoodStore';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, isWithinInterval, parseISO, getHours } from 'date-fns';

export type TimeRange = '7d' | '30d' | 'all';

export function useAdvancedStats(timeRange: TimeRange = '7d') {
  const moodHistory = useMoodStore((state) => state.moodHistory);

  const filteredHistory = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    if (timeRange === '7d') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === '30d') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else {
      startDate = new Date(0); // All time
    }

    return moodHistory.filter((entry) => new Date(entry.timestamp) >= startDate);
  }, [moodHistory, timeRange]);

  // 1. Trend Data for Area/Line Chart
  const trendData = useMemo(() => {
    const now = new Date();
    let intervalStart: Date;
    let intervalEnd = now;

    if (timeRange === '7d') {
      intervalStart = startOfWeek(now, { weekStartsOn: 1 });
      intervalEnd = endOfWeek(now, { weekStartsOn: 1 });
    } else if (timeRange === '30d') {
      intervalStart = startOfMonth(now);
      intervalEnd = endOfMonth(now);
    } else {
      if (filteredHistory.length === 0) return [];
      const times = filteredHistory.map(e => new Date(e.timestamp).getTime());
      intervalStart = new Date(Math.min(...times));
      intervalEnd = new Date(Math.max(...times));
    }

    if (filteredHistory.length === 0 && timeRange === 'all') return [];

    const days = eachDayOfInterval({ start: intervalStart, end: intervalEnd });
    
    // Simplistic mapping of root mood to a valance score for trend line
    const sentimentScore: Record<string, number> = {
      'rad': 5,
      'good': 4,
      'meh': 3,
      'bad': 2,
      'awful': 1
    };

    return days.map(day => {
      const dayEntries = filteredHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.getDate() === day.getDate() && 
               entryDate.getMonth() === day.getMonth() && 
               entryDate.getFullYear() === day.getFullYear();
      });

      let averageScore = 0;
      if (dayEntries.length > 0) {
        const totalScore = dayEntries.reduce((acc, curr) => acc + (sentimentScore[curr.mood] || 3), 0);
        averageScore = totalScore / dayEntries.length;
      }

      return {
        date: format(day, timeRange === '30d' ? 'MMM dd' : 'EEE'),
        score: averageScore,
        count: dayEntries.length
      };
    });
  }, [filteredHistory, timeRange]);

  // 2. Mood Frequency for Pie/Bar Chart
  const moodDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    const colors: Record<string, string> = {}; // Extracting colors if available
    
    filteredHistory.forEach(entry => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      if (entry.color && !colors[entry.mood]) {
        colors[entry.mood] = entry.color;
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ 
        name, 
        value,
        fill: colors[name] || '#8884d8' // Default color if not found
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredHistory]);

  // 3. Emotion Tags Analytics
  const emotionTagsData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    filteredHistory.forEach(entry => {
      if (entry.emotion) {
         // Some entries might have emotions mapped, let's just count them
         counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 emotions
  }, [filteredHistory]);

  // 4. Time-based Analysis (Peak times)
  const timeBasedData = useMemo(() => {
    const buckets = {
      'Morning (6-12)': 0,
      'Afternoon (12-17)': 0,
      'Evening (17-21)': 0,
      'Night (21-6)': 0,
    };

    filteredHistory.forEach(entry => {
      const hour = getHours(new Date(entry.timestamp));
      if (hour >= 6 && hour < 12) buckets['Morning (6-12)']++;
      else if (hour >= 12 && hour < 17) buckets['Afternoon (12-17)']++;
      else if (hour >= 17 && hour < 21) buckets['Evening (17-21)']++;
      else buckets['Night (21-6)']++;
    });

    return Object.entries(buckets).map(([timeOfDay, count]) => ({
      timeOfDay,
      count
    }));
  }, [filteredHistory]);

  return {
    trendData,
    moodDistribution,
    emotionTagsData,
    timeBasedData,
    totalEntries: filteredHistory.length
  };
}
