import React from 'react';
import { cn } from '@/lib/utils';

interface SoftCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SoftCard({ children, className }: SoftCardProps) {
  return (
    <div 
      className={cn(
        "bg-white/10 backdrop-blur-lg rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)]",
        "p-6 border border-white/10 transition-all duration-300",
        "hover:shadow-[0px_8px_20px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}
