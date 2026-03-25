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
          "px-6 py-3 bg-card/80 dark:bg-white/10 backdrop-blur text-foreground dark:text-white rounded-full border border-border dark:border-white/30 hover:bg-card dark:hover:bg-white/20 transition-all duration-300 " +
          className
        }
      >
        {children ?? "Learn More"}
      </motion.button>
    </Link>
  );
}
