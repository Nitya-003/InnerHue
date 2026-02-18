import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuoteData {
  content: string;
  author: string;
}

interface QuoteCardProps {
  quote: QuoteData;
  loading: boolean;
  onRefresh: () => void;
}

export function QuoteCard({ quote, loading, onRefresh }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white/40 backdrop-blur-sm rounded-xl p-6 transition-all hover:bg-white/60 shadow-sm hover:shadow-md border border-white/50"
    >
      <div className="relative pl-6 border-l-4 border-purple-300/50">
        <QuoteIcon className="absolute -top-2 -left-2 w-8 h-8 text-purple-200/50 transform -scale-x-100" />
        <blockquote className="font-playfair text-xl md:text-2xl italic text-gray-800 leading-relaxed mb-4 relative z-10">
          &quot;{quote.content}&quot;
        </blockquote>
        <div className="flex justify-between items-end pt-2 mt-2">
          <cite className="text-sm font-semibold text-gray-600 uppercase tracking-wider not-italic">
            — {quote.author}
          </cite>
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`p-2 rounded-full bg-white/50 hover:bg-white transition-all shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95 text-purple-500'}`}
            title="Refresh quote"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
