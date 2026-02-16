// components/SkeletonMoodCard.tsx
"use client";

export function SkeletonMoodCard() {
  return (
    <div className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg">
      {/* The Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Static shapes to mimic content */}
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-4">
        {/* Circle (Emoji placeholder) */}
        <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
        
        {/* Bar (Text placeholder) */}
        <div className="h-4 w-20 rounded-full bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}