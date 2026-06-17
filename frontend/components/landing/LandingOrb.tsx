'use client';

import { motion } from 'framer-motion';

interface LandingOrbProps {
  className?: string;
}

export function LandingOrb({ className = '' }: LandingOrbProps) {
  // Soft, calming colors for the ambient orb
  const colors = {
    primary: '#8B5CF6',    // Purple
    secondary: '#EC4899',   // Pink  
    tertiary: '#3B82F6',    // Blue
    glow: '#A78BFA'         // Light purple
  };

  return (
    <div className={`relative ${className}`}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow}20 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles around the orb */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const distance = 120 + (i % 2) * 30;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}80, ${colors.secondary}80)`,
              left: `calc(50% + ${Math.cos(angle) * distance}px - 4px)`,
              top: `calc(50% + ${Math.sin(angle) * distance}px - 4px)`,
              boxShadow: `0 0 10px ${colors.glow}60`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + (i * 0.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        );
      })}

      {/* Secondary glow layer */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '180px',
          height: '180px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${colors.secondary}30 0%, ${colors.primary}20 50%, transparent 70%)`,
          filter: 'blur(25px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main orb */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: '140px',
          height: '140px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.tertiary} 100%)`,
          boxShadow: `
            0 0 60px ${colors.glow}40,
            0 0 100px ${colors.primary}30,
            inset 0 0 30px rgba(255,255,255,0.2)
          `,
        }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner highlight */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '60%',
            height: '60%',
            left: '15%',
            top: '15%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)',
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle inner glow pulse */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Ripple rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border"
          style={{
            width: `${140 + ring * 40}px`,
            height: `${140 + ring * 40}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: `${colors.glow}${30 - ring * 8}`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4 + ring,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ring * 0.5,
          }}
        />
      ))}
    </div>
  );
}
