import { MoodData } from '@/lib/moodData';
import { reflectiveMoods } from '@/lib/reflectiveMoods';
import MoodPageClient from './MoodPageClient';

export const dynamic = 'force-static';

export function generateStaticParams() {
  const traditionalIds = Object.keys(MoodData.moods);
  const reflectiveIds = reflectiveMoods.map((mood) => mood.id);
  const moodIds = Array.from(new Set([...traditionalIds, ...reflectiveIds]));

  return moodIds.map((id) => ({ id }));
}

export default function MoodPage() {
  return <MoodPageClient />;
}
