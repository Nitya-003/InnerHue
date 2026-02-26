'use client';

import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import { Check, BookOpen, Wind, Music } from 'lucide-react';
import { getReflection } from '@/lib/reflectionData';
import './moodcard.css';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glow: string;
  category?: string;
  isCustom?: boolean;
}

interface MoodCardProps {
  mood: Mood;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (moodId: string) => void;
}

const actionIcons = {
  journal: BookOpen,
  breathe: Wind,
  music: Music,
} as const;

export const MoodCard = memo(function MoodCard({ mood, index, isSelected, onSelect }: MoodCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reflection = getReflection(mood.id);

  return (
    <motion.div
      layout
      variants={{
        hidden: {
          opacity: 0,
          y: 60,
          scale: 0.7,
          rotateX: -20,
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
            delay: index * 0.04,
          },
        },
      }}
      className="mood-card-container aspect-square w-full"
    >
      <div
        className={`mood-card-inner w-full h-full ${isSelected ? 'flipped' : ''}`}
      >
        {/* ====== FRONT FACE ====== */}
        <button
          className={`
            mood-card-front cursor-pointer p-3 sm:p-4 backdrop-blur-xl border-2 outline-none
            transform-gpu will-change-transform flex flex-col items-center justify-center gap-2
            group
            ${isSelected
              ? "bg-gradient-to-br from-white/95 to-white/80 border-transparent"
              : "bg-white/20 border-white/25 hover:bg-white/40 hover:border-white/50"
            }
          `}
          onClick={onSelect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect();
            }
          }}
          aria-label={`Select ${mood.name} mood`}
          aria-pressed={isSelected}
          style={{
            boxShadow: isSelected
              ? `0 30px 60px ${mood.color}50, 0 0 0 3px ${mood.color}80, 0 0 40px ${mood.glow}50, inset 0 2px 0 rgba(255,255,255,0.9)`
              : isHovered
                ? `0 25px 50px ${mood.color}40, 0 0 30px ${mood.glow}35, 0 0 0 2px ${mood.color}50`
                : "0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
            transition: "box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Animated gradient background on hover */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${mood.color}25, ${mood.glow}20, ${mood.color}15)`,
            }}
            animate={
              isHovered
                ? {
                  background: [
                    `linear-gradient(135deg, ${mood.color}25, ${mood.glow}20, ${mood.color}15)`,
                    `linear-gradient(225deg, ${mood.glow}25, ${mood.color}20, ${mood.glow}15)`,
                    `linear-gradient(315deg, ${mood.color}25, ${mood.glow}20, ${mood.color}15)`,
                    `linear-gradient(45deg, ${mood.glow}25, ${mood.color}20, ${mood.glow}15)`,
                    `linear-gradient(135deg, ${mood.color}25, ${mood.glow}20, ${mood.color}15)`,
                  ],
                }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Rotating rainbow border on hover */}
          {isHovered && !isSelected && (
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.3 },
              }}
              style={{
                background: `conic-gradient(from 0deg, ${mood.color}, ${mood.glow}, ${mood.color}, ${mood.glow}, ${mood.color})`,
                padding: "2px",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
          )}

          {/* Shimmer sweep effect */}
          <motion.div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0"
              animate={isHovered ? { x: ["150%", "-150%"] } : { x: "150%" }}
              transition={{
                duration: 1,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 0.5,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                width: "40%",
                skewX: "-20deg",
              }}
            />
          </motion.div>

          {/* Glowing orbs on hover */}
          {isHovered && (
            <>
              <motion.div
                className="absolute w-16 h-16 rounded-full pointer-events-none"
                style={{
                  background: mood.color,
                  filter: "blur(25px)",
                  top: "-10%",
                  right: "-10%",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.6, scale: 1, y: [0, -10, 0] }}
                transition={{ type: "keyframes", duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-12 h-12 rounded-full pointer-events-none"
                style={{
                  background: mood.glow,
                  filter: "blur(20px)",
                  bottom: "-5%",
                  left: "-5%",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.5, scale: 1, y: [0, 10, 0] }}
                transition={{
                  type: "keyframes",
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 0.3,
                }}
              />
            </>
          )}

          {/* Selection indicator with sparkle animation */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center z-20 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`,
                boxShadow: `0 6px 20px ${mood.color}70`,
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 600 }}
              >
                <Check className="w-5 h-5 text-white stroke-[3]" />
              </motion.div>
            </motion.div>
          )}

          {/* Floating particles when selected or hovered */}
          {(isSelected || isHovered) && (
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${i % 2 === 0 ? mood.color : mood.glow}, transparent)`,
                    width: 4 + (i % 3) * 2,
                    height: 4 + (i % 3) * 2,
                    left: `${10 + i * 12}%`,
                    top: `${15 + (i % 4) * 22}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, i % 2 === 0 ? 15 : -15, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Emoji with enhanced animations */}
          <motion.div
            className="relative z-10 text-center flex flex-col items-center"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4 + (index % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.08,
            }}
          >
            <motion.div
              className="text-4xl sm:text-5xl mb-2 select-none filter drop-shadow-xl relative"
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              {/* Emoji glow effect */}
              <motion.div
                className="absolute inset-0 blur-2xl rounded-full"
                style={{ background: mood.color }}
                animate={
                  isHovered
                    ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }
                    : { opacity: 0 }
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative z-10">{mood.emoji}</span>
            </motion.div>

            <div className="text-sm font-medium text-gray-800 drop-shadow-sm">
              {mood.name}
            </div>
          </motion.div>

          {/* Enhanced glow effects when selected */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            >
              {/* Pulsing radial glow */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-3xl"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  background: `radial-gradient(circle at center, ${mood.glow}40 0%, ${mood.color}25 40%, transparent 70%)`,
                }}
              />
            </motion.div>
          )}

          {/* 3D depth shadow layer */}
          <motion.div
            className="absolute inset-0 rounded-3xl -z-20"
            style={{
              background: `linear-gradient(145deg, ${mood.color}20, ${mood.glow}15)`,
              filter: "blur(6px)",
              transform: "translate(4px, 4px)",
            }}
            animate={{
              opacity: isSelected ? 0.7 : isHovered ? 0.5 : 0.2,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Bottom color accent line */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${mood.color}, ${mood.glow}, ${mood.color}, transparent)`,
            }}
            animate={{
              width: isSelected ? "80%" : isHovered ? "60%" : "0%",
              opacity: isSelected ? 1 : isHovered ? 0.8 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </button>

        {/* ====== BACK FACE (Reflection Card) ====== */}
        <div
          className="mood-card-back flex flex-col items-center justify-center gap-3 p-3 sm:p-4 cursor-pointer"
          onClick={onSelect}
          role="button"
          tabIndex={-1}
          aria-label={`Deselect ${mood.name} mood`}
          style={{
            boxShadow: `0 20px 50px ${mood.color}40, 0 0 30px ${mood.glow}25, inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}
        >
          {/* Quote */}
          <p className="text-[0.65rem] sm:text-xs leading-snug text-white/85 italic text-center px-1">
            &ldquo;{reflection.question}&rdquo;
          </p>

          {/* Single quick recommendation */}
          {reflection.actions[0] && (() => {
            const action = reflection.actions[0];
            const IconComp = actionIcons[action.icon];
            return (
              <span
                className="reflection-action"
                title={action.description}
                style={{
                  borderColor: `${mood.color}40`,
                  background: `${mood.color}25`,
                }}
              >
                <IconComp className="w-2.5 h-2.5" />
                {action.label}
              </span>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
});
