'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

// ─── Emotion Config ───────────────────────────────────────────────────────────

const emotionConfig: Record<string, { distortion: number; speed: number; pulseScale: number }> = {
  anxious: { distortion: 0.85, speed: 2.2, pulseScale: 0.18 },
  angry: { distortion: 0.95, speed: 2.8, pulseScale: 0.22 },
  stressed: { distortion: 0.90, speed: 2.5, pulseScale: 0.20 },
  overwhelmed: { distortion: 1.00, speed: 3.0, pulseScale: 0.25 },
  frustrated: { distortion: 0.88, speed: 2.4, pulseScale: 0.19 },
  calm: { distortion: 0.10, speed: 0.6, pulseScale: 0.05 },
  peaceful: { distortion: 0.08, speed: 0.5, pulseScale: 0.04 },
  content: { distortion: 0.12, speed: 0.7, pulseScale: 0.06 },
  happy: { distortion: 0.25, speed: 1.1, pulseScale: 0.09 },
  excited: { distortion: 0.55, speed: 1.8, pulseScale: 0.15 },
  energized: { distortion: 0.60, speed: 2.0, pulseScale: 0.17 },
  hopeful: { distortion: 0.20, speed: 0.9, pulseScale: 0.08 },
  inspired: { distortion: 0.30, speed: 1.2, pulseScale: 0.10 },
  sad: { distortion: 0.10, speed: 0.5, pulseScale: 0.05 },
  lonely: { distortion: 0.08, speed: 0.4, pulseScale: 0.04 },
  melancholy: { distortion: 0.12, speed: 0.6, pulseScale: 0.05 },
  default: { distortion: 0.30, speed: 1.0, pulseScale: 0.10 },
};

// ─── Canvas Orb ───────────────────────────────────────────────────────────────

interface CanvasOrbProps {
  color: string;
  glow: string;
  moodId: string;
}

function CanvasOrb({ color, glow, moodId }: CanvasOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const cfg = emotionConfig[moodId] ?? emotionConfig.default;

  useAnimationFrame((_, delta) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += delta * 0.001 * cfg.speed;
    const t = timeRef.current;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const base = Math.min(W, H) * 0.36;

    ctx.clearRect(0, 0, W, H);

    // Build a wobbly blob path
    const pts = 120;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const angle = (i / pts) * Math.PI * 2;
      const n1 = Math.sin(angle * 3 + t * 1.1) * cfg.distortion * 0.08;
      const n2 = Math.sin(angle * 5 - t * 0.7) * cfg.distortion * 0.06;
      const n3 = Math.sin(angle * 7 + t * 1.3) * cfg.distortion * 0.04;
      const r = base * (1 + n1 + n2 + n3);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Outer glow
    const glowGrad = ctx.createRadialGradient(cx, cy, base * 0.4, cx, cy, base * 1.5);
    glowGrad.addColorStop(0, `${glow}55`);
    glowGrad.addColorStop(1, 'transparent');
    ctx.shadowBlur = 60;
    ctx.shadowColor = glow;
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Inner fill gradient
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const angle = (i / pts) * Math.PI * 2;
      const n1 = Math.sin(angle * 3 + t * 1.1) * cfg.distortion * 0.08;
      const n2 = Math.sin(angle * 5 - t * 0.7) * cfg.distortion * 0.06;
      const n3 = Math.sin(angle * 7 + t * 1.3) * cfg.distortion * 0.04;
      const r = base * (1 + n1 + n2 + n3);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    const fillGrad = ctx.createRadialGradient(cx - base * 0.2, cy - base * 0.2, 0, cx, cy, base);
    fillGrad.addColorStop(0, `${color}ff`);
    fillGrad.addColorStop(0.5, `${glow}cc`);
    fillGrad.addColorStop(1, `${color}88`);
    ctx.shadowBlur = 30;
    ctx.shadowColor = glow;
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Glass specular highlight
    ctx.beginPath();
    ctx.ellipse(cx - base * 0.2, cy - base * 0.25, base * 0.22, base * 0.12, -Math.PI / 4, 0, Math.PI * 2);
    const specGrad = ctx.createRadialGradient(cx - base * 0.2, cy - base * 0.25, 0, cx - base * 0.2, cy - base * 0.25, base * 0.22);
    specGrad.addColorStop(0, 'rgba(255,255,255,0.65)');
    specGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = specGrad;
    ctx.shadowBlur = 0;
    ctx.fill();
  });

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

// ─── Public Component ─────────────────────────────────────────────────────────

interface ShaderOrbProps {
  mood: { id: string; color: string; glow: string };
}

export function ShaderOrb({ mood }: ShaderOrbProps) {
  const cfg = emotionConfig[mood.id] ?? emotionConfig.default;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glow rings */}
      {[1.6, 1.3, 1.1].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '60%', height: '60%',
            background: `radial-gradient(circle, ${mood.glow}18 0%, transparent 70%)`,
            border: `1px solid ${mood.glow}22`,
          }}
          animate={{ scale: [scale, scale + cfg.pulseScale, scale], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* Canvas orb */}
      <motion.div
        className="relative z-10"
        style={{ width: '60%', height: '60%' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60 / cfg.speed, repeat: Infinity, ease: 'linear' }}
      >
        <CanvasOrb color={mood.color} glow={mood.glow} moodId={mood.id} />
      </motion.div>
    </div>
  );
}
