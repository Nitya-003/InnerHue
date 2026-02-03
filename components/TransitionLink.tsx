'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, MouseEvent } from 'react';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TransitionLink({ href, children, className = '', onClick }: TransitionLinkProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Get click position for ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setIsTransitioning(true);
    onClick?.();

    // Small delay for visual feedback before navigation
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  return (
    <Link href={href} onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      
      {/* Ripple effect on click */}
      {isTransitioning && (
        <motion.span
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripplePosition.x,
            top: ripplePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
    </Link>
  );
}
