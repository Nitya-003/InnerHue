import MoodPageClient from './MoodPageClient';
import { MoodData } from '@/lib/moodData';
import { reflectiveMoods } from '@/lib/reflectiveMoods';
import { getTraditionalMoodId } from '@/lib/moodMapping';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <MoodPageClient />;
}