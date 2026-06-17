'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return (
    <main id="main" className="min-h-screen px-6 py-8 bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))] text-foreground dark:text-white">
      <h1 className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-300">Test Page - InnerHue</h1>
      <p className="text-muted-foreground dark:text-white/80">If you can see this, Next.js is working!</p>
      <p className="text-muted-foreground dark:text-white/80 mt-2">Current time: {time}</p>
      <style jsx>{`
        main { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
      `}</style>
    </main>
  );
}
