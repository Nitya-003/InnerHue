'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  align: 'left' | 'right';
  index: number;
}

export default function FeatureRow({ icon: Icon, title, description, align, index }: FeatureRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`
        flex flex-col md:flex-row items-center gap-8 md:gap-12
        ${align === 'right' ? 'md:flex-row-reverse' : ''}
      `}
    >
      {/* Content Card */}
      <div className="w-full md:w-1/2">
        <div className="
          bg-white/10
          backdrop-blur-lg
          rounded-3xl
          p-8 md:p-10
          border border-white/20
          transition-all duration-300
          hover:bg-white/15
        ">
          <div className="flex items-start gap-4 mb-4">
            <div className="
              p-3 rounded-xl
              bg-white/10
              shrink-0
            ">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
              {title}
            </h3>
          </div>

          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            {description}
          </p>
        </div>
      </div>

      {/* Visual Placeholder */}
      <div className="w-full md:w-1/2 h-64 md:h-80">
        <div className="
          w-full h-full
          bg-white/5
          rounded-3xl
          border border-white/10
          flex items-center justify-center
        ">
          <Icon className="w-16 h-16 text-white/20" />
        </div>
      </div>
    </motion.div>
  );
}
