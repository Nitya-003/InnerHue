import MoodPageClient from './MoodPageClient';
import { MoodData } from '@/lib/moodData';
import { reflectiveMoods } from '@/lib/reflectiveMoods';
import { getTraditionalMoodId } from '@/lib/moodMapping';

export function generateStaticParams() {
  const reflectiveIds = reflectiveMoods.map((m) => m.id);

  const traditionalIds =
    typeof (MoodData as any).getAllMoods === 'function'
      ? (MoodData as any).getAllMoods().map((m: any) => m.id)
      : [];

  const mappedTraditionalIds = reflectiveIds
    .map((id) => getTraditionalMoodId(id))
    .filter(Boolean);

  const ids = Array.from(new Set([...reflectiveIds, ...traditionalIds, ...mappedTraditionalIds]));

  return ids.map((id) => ({ id }));
}

export default function Page() {
  return <MoodPageClient />;
}