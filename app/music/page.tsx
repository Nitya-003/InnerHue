'use client';
export const dynamic = "force-dynamic";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Pause,
  CloudRain, Trees, Waves, Wind, Sun, Leaf, Wheat, Droplets, CloudLightning,
  Music2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';

const soundscapes = [
  {
    id: 'rain',
    title: 'Heavy Rain',
    description: 'Continuous heavy rain falling on pavement.',
    icon: CloudRain,
    bgColor: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    primaryColor: '#3b82f6',
    primaryRgb: '59, 130, 246',
    tag: 'Focus',
    src: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg'
  },
  {
    id: 'forest',
    title: 'Forest Morning',
    description: 'Birds chirping and wind rustling in the trees.',
    icon: Trees,
    bgColor: 'linear-gradient(135deg, #10b981, #047857)',
    primaryColor: '#10b981',
    primaryRgb: '16, 185, 129',
    tag: 'Calm',
    src: 'https://actions.google.com/sounds/v1/animals/june_songbirds.ogg'
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    description: 'Rhythmic waves crashing on the shore.',
    icon: Waves,
    bgColor: 'linear-gradient(135deg, #06b6d4, #0369a1)',
    primaryColor: '#06b6d4',
    primaryRgb: '6, 182, 212',
    tag: 'Relax',
    src: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg'
  },
  {
    id: 'wind',
    title: 'Strong Wind',
    description: 'Howling wind to block out distractions.',
    icon: Wind,
    bgColor: 'linear-gradient(135deg, #6b7280, #374151)',
    primaryColor: '#6b7280',
    primaryRgb: '107, 114, 128',
    tag: 'Focus',
    src: 'https://actions.google.com/sounds/v1/weather/strong_wind.ogg'
  },
  {
    id: 'summer-forest',
    title: 'Summer Forest',
    description: 'Warm summer ambience with insects and gentle breeze.',
    icon: Sun,
    bgColor: 'linear-gradient(135deg, #f59e0b, #d97706)',
    primaryColor: '#f59e0b',
    primaryRgb: '245, 158, 11',
    tag: 'Energise',
    src: 'https://actions.google.com/sounds/v1/ambiences/summer_forest.ogg'
  },
  {
    id: 'summer-beach',
    title: 'Summer Beach',
    description: 'Relaxing seaside vibes with distant waves and seagulls.',
    icon: Waves,
    bgColor: 'linear-gradient(135deg, #f472b6, #db2777)',
    primaryColor: '#f472b6',
    primaryRgb: '244, 114, 182',
    tag: 'Relax',
    src: 'https://actions.google.com/sounds/v1/ambiences/summer_beach_parking_lot.ogg'
  },
  {
    id: 'spring-forest',
    title: 'Spring Forest',
    description: 'Fresh spring morning with birdsong and rustling leaves.',
    icon: Leaf,
    bgColor: 'linear-gradient(135deg, #a3e635, #65a30d)',
    primaryColor: '#84cc16',
    primaryRgb: '163, 230, 53',
    tag: 'Calm',
    src: 'https://actions.google.com/sounds/v1/ambiences/spring_day_forest.ogg'
  },
  {
    id: 'outdoor-farm',
    title: 'Outdoor Farm',
    description: 'Peaceful farm sounds with roosters and gentle wind.',
    icon: Wheat,
    bgColor: 'linear-gradient(135deg, #fb923c, #ea580c)',
    primaryColor: '#f97316',
    primaryRgb: '251, 146, 60',
    tag: 'Calm',
    src: 'https://actions.google.com/sounds/v1/ambiences/outdoor_farm_sounds.ogg'
  },
  {
    id: 'soft-rain',
    title: 'Soft Rain Drips',
    description: 'Gentle rain dripping softly, perfect for focus.',
    icon: Droplets,
    bgColor: 'linear-gradient(135deg, #818cf8, #4f46e5)',
    primaryColor: '#818cf8',
    primaryRgb: '129, 140, 248',
    tag: 'Focus',
    src: 'https://actions.google.com/sounds/v1/weather/rain_water_dripping_softly.ogg'
  },
  {
    id: 'thunder-rain',
    title: 'Thunder & Rain',
    description: 'Dramatic thunderstorm with heavy summer rain.',
    icon: CloudLightning,
    bgColor: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    primaryColor: '#a78bfa',
    primaryRgb: '167, 139, 250',
    tag: 'Intense',
    src: 'https://actions.google.com/sounds/v1/weather/summer_thunder_and_rain.ogg'
  }
];

const tagColors: Record<string, string> = {
  Focus: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Calm: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Relax: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  Energise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Intense: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('rain');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const togglePlay = async (trackId: string, src: string) => {
    if (!audioRef.current) return;
    try {
      if (currentTrack === trackId) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(false);
        audioRef.current.pause();
        audioRef.current.src = src;
        audioRef.current.load();
        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
            resolve();
          };
          const onError = () => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
            reject(new Error('Audio failed to load'));
          };
          audioRef.current!.addEventListener('canplay', onCanPlay);
          audioRef.current!.addEventListener('error', onError);
        });
        await audioRef.current.play();
        setCurrentTrack(trackId);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Audio Playback Error:', err);
    }
  };

  const currentSoundscape = soundscapes.find(s => s.id === currentTrack)!;
  const HeroIcon = currentSoundscape.icon;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] relative overflow-hidden transition-colors duration-500">

      {/* Ambient glow — visible in dark, subtle in light */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(${currentSoundscape.primaryRgb}, 0.18), transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], opacity: isDark ? [0.5, 0.7, 0.5] : [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(${currentSoundscape.primaryRgb}, 0.1), transparent 70%)` }}
          animate={{ scale: [1.1, 1, 1.1], opacity: isDark ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <main id="main" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Work Sans, sans-serif' }}>Back</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* ── Hero Player ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-14"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Album art */}
            <motion.div
              key={currentTrack}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-shrink-0 w-44 h-44 sm:w-52 sm:h-52 rounded-2xl shadow-2xl flex items-center justify-center"
              style={{
                background: currentSoundscape.bgColor,
                boxShadow: `0 20px 60px rgba(${currentSoundscape.primaryRgb}, ${isDark ? '0.45' : '0.3'})`
              }}
            >
              <HeroIcon className="w-20 h-20 text-white drop-shadow-lg" />
            </motion.div>

            {/* Info + controls */}
            <div className="flex flex-col justify-end sm:pb-2 text-center sm:text-left">
              <p
                className="text-xs uppercase tracking-[0.2em] mb-2 font-semibold"
                style={{ color: currentSoundscape.primaryColor, fontFamily: 'Work Sans, sans-serif' }}
              >
                Now Playing
              </p>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentSoundscape.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 leading-tight"
                  style={{ fontFamily: 'Fraunces, serif' }}
                >
                  {currentSoundscape.title}
                </motion.h1>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSoundscape.description}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] mb-6 max-w-xs"
                  style={{ fontFamily: 'Source Serif 4, serif' }}
                >
                  {currentSoundscape.description}
                </motion.p>
              </AnimatePresence>

              {/* Play/Pause button */}
              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => togglePlay(currentTrack, currentSoundscape.src)}
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-white transition-all"
                  style={{
                    background: currentSoundscape.bgColor,
                    boxShadow: `0 8px 24px rgba(${currentSoundscape.primaryRgb}, 0.45)`
                  }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </motion.button>

                {/* Animated waveform when playing */}
                {isPlaying && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full"
                        style={{ background: currentSoundscape.primaryColor }}
                        animate={{ height: ['10px', '24px', '10px', '18px', '10px'] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <Music2
            className="w-5 h-5"
            style={{ color: currentSoundscape.primaryColor }}
          />
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
            Soundscapes
          </h2>
        </div>

        {/* ── Spotify-style Grid ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
          }}
        >
          {soundscapes.map((track) => {
            const isActive = currentTrack === track.id;
            const TrackIcon = track.icon;

            return (
              <motion.button
                key={track.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => togglePlay(track.id, track.src)}
                aria-pressed={isActive}
                aria-label={isActive && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                className={`
                  group relative text-left rounded-2xl p-4 transition-all duration-300 overflow-hidden
                  border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  ${isActive
                    ? 'bg-[hsl(var(--card))] border-transparent'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] hover:border-transparent hover:bg-[hsl(var(--surface-elevated))]'
                  }
                `}
                style={{
                  boxShadow: isActive
                    ? `0 0 0 2px rgba(${track.primaryRgb}, 0.6), 0 8px 32px rgba(${track.primaryRgb}, ${isDark ? '0.25' : '0.15'})`
                    : undefined,
                  focusVisibleRingColor: track.primaryColor
                } as React.CSSProperties}
              >
                {/* Card art (top square) */}
                <div
                  className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: track.bgColor,
                    boxShadow: isActive ? `0 4px 20px rgba(${track.primaryRgb}, 0.4)` : '0 2px 8px rgba(0,0,0,0.12)'
                  }}
                >
                  <TrackIcon
                    className="w-12 h-12 text-white drop-shadow-lg transition-transform group-hover:scale-110 duration-300"
                  />

                  {/* Play overlay */}
                  <div
                    className={`
                      absolute inset-0 flex items-center justify-center
                      rounded-xl transition-opacity duration-200
                      ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                      bg-black/30 backdrop-blur-[1px]
                    `}
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 text-black ml-0.5" />
                    </div>
                  </div>

                  {/* Now-playing badge */}
                  {isActive && isPlaying && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-[3px] bg-black/40 backdrop-blur-md rounded-full px-2 py-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-[3px] rounded-full bg-white"
                          animate={{ height: ['6px', '14px', '6px'] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pause overlay when active */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/25 backdrop-blur-[1px]">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                        {isPlaying
                          ? <Pause className="w-4 h-4 text-black" />
                          : <Play className="w-4 h-4 text-black ml-0.5" />
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Track info */}
                <div className="space-y-1 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-sm font-bold leading-snug truncate text-[hsl(var(--card-foreground))]"
                      style={{ fontFamily: 'Fraunces, serif' }}
                    >
                      {track.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tagColors[track.tag]}`}
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                    >
                      {track.tag}
                    </span>
                  </div>
                  <p
                    className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed"
                    style={{ fontFamily: 'Source Serif 4, serif' }}
                  >
                    {track.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}