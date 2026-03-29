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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * `MoodPageClient` reads `?moods=` via `useSearchParams()` (no `await searchParams` here
 * so the route stays statically exportable).
 */
export default async function MoodPage({ params }: MoodPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<MoodPageFallback />}>
      <MoodPageClient routeId={id} />
    </Suspense>
  );
}
