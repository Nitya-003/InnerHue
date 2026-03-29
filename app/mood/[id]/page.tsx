import { Suspense } from 'react';
import { MoodData, type Mood } from '@/lib/moodData';
import { reflectiveMoods } from '@/lib/reflectiveMoods';
import MoodPageClient from './MoodPageClient';

/** Pre-render all default + reflective mood routes for static export. */
export async function generateStaticParams() {
  const defaultIds = MoodData.getDefaultMoods().map((m: Mood) => m.id);
  const reflectiveIds = reflectiveMoods.map(m => m.id);
  const seen = new Set<string>();
  const out: { id: string }[] = [];
  for (const id of [...defaultIds, ...reflectiveIds]) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push({ id });
    }
  }
  return out;
}

type MoodRoutePageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Avoid `await searchParams` here so `/mood/[id]` stays statically exportable.
 * `MoodPageClient` reads `?moods=` via `useSearchParams()`.
 */
function MoodPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default async function MoodPage({ params }: MoodRoutePageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<MoodPageFallback />}>
      <MoodPageClient routeId={id} />
    </Suspense>
  );
}
