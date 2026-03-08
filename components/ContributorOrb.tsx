"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type MiniContributor = {
  login: string;
  avatar_url: string;
  html_url?: string;
  contributions?: number;
};

export default function ContributorOrb({
  contributors,
  size = 220,
  maxAvatars = 36,
}: {
  contributors: MiniContributor[];
  size?: number;
  maxAvatars?: number;
}) {
  const list = contributors.slice(0, maxAvatars);
  const maxContrib = Math.max(...(list.map((c) => c.contributions || 0) || [1]));

  return (
    <div className="mx-auto mt-6" style={{ width: size, height: size, position: 'relative' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 20%, rgba(129, 90, 240, 0.08), transparent 40%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.04), transparent 30%)',
          display: 'block',
        }}
      />

      {list.map((c, i) => {
        const t = list.length > 1 ? i / (list.length - 1) : 0.5;
        const angle = t * Math.PI * 2;
        // radial distribution (more toward center)
        const radius = (Math.sqrt(t) * 0.75 + 0.05) * (size / 2 - 20);
        const x = Math.cos(angle) * radius + size / 2;
        const y = Math.sin(angle) * radius + size / 2;

        const contrib = c.contributions ?? 0;
        const min = 28;
        const max = 72;
        const s = Math.round(min + ((contrib / (maxContrib || 1)) * (max - min || 0)));

        return (
          <motion.a
            key={c.login + i}
            href={c.html_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.02 * i + 0.2 }}
            whileHover={{ scale: 1.06, zIndex: 40 }}
            style={{
              position: 'absolute',
              left: x - s / 2,
              top: y - s / 2,
              width: s,
              height: s,
              borderRadius: '9999px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            }}
          >
            <Image src={c.avatar_url} alt={c.login} width={s} height={s} className="object-cover" unoptimized />
          </motion.a>
        );
      })}
    </div>
  );
}
