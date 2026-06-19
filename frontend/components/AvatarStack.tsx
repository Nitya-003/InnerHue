"use client";

import React from 'react';
import Image from 'next/image';

type ContributorMini = {
  login: string;
  avatar_url: string;
  html_url?: string;
};

export default function AvatarStack({
  contributors,
  maxVisible = 12,
  size = 36,
}: {
  contributors: ContributorMini[];
  maxVisible?: number;
  size?: number;
}) {
  const visible = contributors.slice(0, maxVisible);
  const extra = contributors.length - visible.length;

  return (
    <div className="flex items-center justify-center mt-6">
      <div className="relative" style={{ height: size }}>
        {visible.map((c, i) => {
          const overlap = Math.round(size * 0.55);
          const left = i * (size - overlap);
          const z = 100 + i;
          return (
            <a
              key={c.login + i}
              href={c.html_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              title={c.login}
              style={{
                position: 'absolute',
                left,
                zIndex: z,
                width: size,
                height: size,
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '2px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              }}
            >
              <Image src={c.avatar_url} alt={c.login} width={size} height={size} className="object-cover" unoptimized />
            </a>
          );
        })}

        {extra > 0 && (
          <div
            style={{
              position: 'absolute',
              left: visible.length * (size - Math.round(size * 0.55)),
              width: size,
              height: size,
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              border: '2px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              zIndex: 100 + visible.length,
            }}
          >
            <span className="text-xs font-semibold text-white px-1">+{extra}</span>
          </div>
        )}
      </div>
    </div>
  );
}
