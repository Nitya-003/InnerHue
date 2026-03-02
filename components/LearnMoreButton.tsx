"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function LearnMoreButton({ className = "", children }: Props) {
  return (
    <Link href="/about">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={
          "px-6 py-3 bg-white/10 backdrop-blur text-white rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 " +
          className
        }
      >
        {children ?? "Learn More"}
      </motion.button>
    </Link>
  );
}
