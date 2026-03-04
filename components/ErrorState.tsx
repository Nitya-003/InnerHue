// components/ErrorState.tsx
"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm max-w-md mx-auto mt-10"
    >
      <div className="bg-red-500/20 p-4 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Unable to Load Data</h3>
      <p className="text-gray-300 mb-6">{message}</p>
      
      <button 
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all active:scale-95"
      >
        <RefreshCcw className="w-4 h-4" />
        Try Again
      </button>
    </motion.div>
  );
}