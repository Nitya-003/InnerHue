import { Suspense } from 'react';
import MoodPageClient from './MoodPageClient';
import { MoodData } from '@/lib/moodData';
import { reflectiveMoods } from '@/lib/reflectiveMoods';

/** Pre-render all default + reflective mood routes for static export (`output: 'export'`). */
export function generateStaticParams() {
  const defaultIds = Object.keys(MoodData.moods) as string[];
  const reflectiveIds = reflectiveMoods.map((m) => m.id);
  const ids = Array.from(new Set([...defaultIds, ...reflectiveIds]));
  return ids.map((id) => ({ id }));
}

type MoodPageProps = {
  params: Promise<{ id: string }>;
};

function MoodPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default async function MoodPage({ params }: MoodPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<MoodPageFallback />}>
      <MoodPageClient id={id} />
    </Suspense>
  );
}
