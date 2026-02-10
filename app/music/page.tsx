'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, CloudRain, Trees, Waves, Wind, Volume2 } from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';
import { ThemeToggle } from '@/components/ThemeToggle';

// UPDATED: Google Developer Sounds (High Reliability, No CORS issues)
const soundscapes = [
  {
    id: 'rain',
    title: 'Heavy Rain',
    description: 'Continuous heavy rain falling on pavement.',
    icon: CloudRain,
    color: 'from-blue-400 to-indigo-500',
    src: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg'
  },
  {
    id: 'forest',
    title: 'Forest Morning',
    description: 'Birds chirping and wind rustling in the trees.',
    icon: Trees,
    color: 'from-green-400 to-emerald-600',
    src: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg'
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    description: 'Rhythmic waves crashing on the shore.',
    icon: Waves,
    color: 'from-cyan-400 to-blue-500',
    src: 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg'
  },
  {
    id: 'wind',
    title: 'Strong Wind',
    description: 'Howling wind to block out distractions.',
    icon: Wind,
    color: 'from-gray-300 to-slate-500',
    src: 'https://actions.google.com/sounds/v1/weather/strong_wind.ogg'
  }
];

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Object
  useEffect(() => {
    // We create the audio object on the client side only
    audioRef.current = new Audio();

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle Play/Pause Logic
  const togglePlay = async (trackId: string, src: string) => {
    if (!audioRef.current) return;

    try {
      if (currentTrack === trackId) {
        // Toggle play/pause for the same track
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        // Switch to a new track
        // 1. Reset state
        setIsPlaying(false);
        audioRef.current.pause();

        // 2. Load new source
        audioRef.current.src = src;
        audioRef.current.load();

        // 3. Play
        await audioRef.current.play();
        setCurrentTrack(trackId);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio Playback Error:", err);
      // Removed the alert so it doesn't annoy users, just logs to console
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))] relative overflow-x-hidden font-sans text-white">

      {/* Background (Accessible) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <FloatingBackground />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center text-purple-200 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Sonic Sanctuary
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Immerse yourself in calming soundscapes designed to help you focus, relax, or sleep.
          </p>
        </motion.div>

        {/* Sound Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {soundscapes.map((track, index) => {
            const isActive = currentTrack === track.id;
            const Icon = track.icon;

            return (
              <motion.button
                key={track.id}
                onClick={() => togglePlay(track.id, track.src)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`
                  relative overflow-hidden group p-6 rounded-3xl border text-left transition-all duration-300 h-full
                  flex flex-col justify-between
                  ${isActive
                    ? "bg-white/10 border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }
                `}
                aria-label={isActive && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                aria-pressed={isActive}
              >
                {/* Gradient Blob Background */}
                <div
                  className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${track.color} opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg
                    bg-gradient-to-br ${track.color}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{track.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-8">
                    {track.description}
                  </p>
                </div>

                {/* Player Controls UI */}
                <div className="relative z-10 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                    {isActive && isPlaying ? (
                      <span className="text-purple-300 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Playing
                      </span>
                    ) : (
                      <span>Ready to play</span>
                    )}
                  </div>

                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive && isPlaying ? "bg-white text-purple-900" : "bg-white/10 text-white group-hover:bg-white group-hover:text-purple-900"}
                  `}>
                    {isActive && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Active Visualizer (Simple Animation) */}
                {isActive && isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50">
                    <motion.div
                      className="h-full w-full bg-white/50"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}