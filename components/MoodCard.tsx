'use client';

import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import './moodcard.css';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
}

interface MoodCardProps {
  mood: Mood;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const MoodCard = memo(function MoodCard({ mood, index, isSelected, onSelect }: MoodCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      variants={{
        hidden: {
          opacity: 0,
          y: 50,
          scale: 0.8,
          rotateX: -15,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: index * 0.04
          }
        }
      }}
      whileHover={{
        scale: 1.12,
        y: -12,
        rotateY: 8,
        rotateX: 5,
        z: 50,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      }}
      whileTap={{
        scale: 0.92,
        rotateX: -5,
        transition: { duration: 0.1 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative cursor-pointer p-4 rounded-3xl backdrop-blur-xl border-2 outline-none
        transform-gpu will-change-transform flex flex-col items-center justify-center gap-2 aspect-square w-full
        group perspective-1000
        ${isSelected
          ? 'bg-gradient-to-br from-white/95 to-white/85 border-transparent'
          : 'bg-white/25 border-white/30 hover:bg-white/45 hover:border-white/50'
        }
      `}
      onClick={onSelect}
      aria-label={`Select ${mood.name} mood`}
      aria-pressed={isSelected}
      style={{
        boxShadow: isSelected
          ? `0 25px 50px ${mood.color}40, 0 0 0 3px ${mood.color}60, 0 0 30px ${mood.glow}40, inset 0 1px 0 rgba(255,255,255,0.8)`
          : isHovered
            ? `0 20px 40px ${mood.color}25, 0 0 20px ${mood.glow}20`
            : '0 10px 30px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.3)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${mood.color}15, ${mood.glow}10)`,
        }}
      />

      {/* Rotating glow ring on hover */}
      {isHovered && !isSelected && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          exit={{ opacity: 0 }}
          transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
          style={{
            background: `conic-gradient(from 0deg, transparent, ${mood.color}30, transparent, ${mood.glow}30, transparent)`,
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
        initial={false}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            x: isHovered ? ['100%', '-100%'] : '100%',
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            width: '50%',
          }}
        />
      </motion.div>

      {/* Selection indicator with animation */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`,
            boxShadow: `0 4px 15px ${mood.color}60`,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          >
            <Check className="w-4 h-4 text-white stroke-[3]" />
          </motion.div>
        </motion.div>
      )}

      {/* Floating particles when selected */}
      {isSelected && (
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? mood.color : mood.glow,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0.4, 0.9, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Emoji with enhanced floating animation */}
      <motion.div
        className="relative z-10 text-center flex flex-col items-center"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 6, -6, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 4 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.1
        }}
      >
        <motion.div
          className="text-5xl mb-2 select-none filter drop-shadow-lg relative"
          whileHover={{
            scale: 1.25,
            rotate: [0, -15, 15, 0],
            transition: { duration: 0.4 }
          }}
        >
          {/* Emoji glow effect */}
          <motion.div
            className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{ background: mood.color, borderRadius: '50%', transform: 'scale(1.5)' }}
          />
          <span className="relative z-10">{mood.emoji}</span>
        </motion.div>

        <motion.div 
          className={`text-sm font-bold transition-all duration-300 ${
            isSelected 
              ? 'text-gray-900' 
              : 'text-white group-hover:text-gray-100'
          } drop-shadow-lg`}
          style={{
            textShadow: isSelected ? 'none' : '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {mood.name}
        </motion.div>
      </motion.div>

      {/* Enhanced glow effect when selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
        >
          {/* Corner sparkles */}
          <motion.div
            className="absolute top-3 left-3"
            animate={{ rotate: 360, scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" style={{ color: mood.glow }} />
          </motion.div>
          <motion.div
            className="absolute bottom-3 right-3"
            animate={{ rotate: -360, scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles className="w-4 h-4" style={{ color: mood.color }} />
          </motion.div>

          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-3xl"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: `radial-gradient(circle at center, ${mood.glow}40 0%, ${mood.color}20 40%, transparent 70%)`,
            }}
          />
        </motion.div>
      )}

      {/* 3D depth shadow */}
      <motion.div 
        className="absolute inset-0 rounded-3xl -z-20 opacity-30"
        style={{
          background: `linear-gradient(145deg, ${mood.color}15, ${mood.glow}10)`,
          filter: 'blur(4px)',
          transform: 'translate(3px, 3px)',
        }}
        animate={{
          opacity: isSelected ? 0.6 : 0.2,
        }}
      />
    </motion.button>
  );
});


