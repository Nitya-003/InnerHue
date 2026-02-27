'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, CloudRain, Trees, Waves, Wind, Sun, TreePine, Leaf, Wheat, Droplets, CloudLightning } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const soundscapes = [
  {
    id: 'rain',
    title: 'Heavy Rain',
    description: 'Continuous heavy rain falling on pavement.',
    icon: CloudRain,
    bgColor: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    primaryColor: '#3b82f6',
    primaryRgb: '59, 130, 246',
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
    src: 'https://actions.google.com/sounds/v1/ambiences/summer_beach_parking_lot.ogg'
  },
  {
    id: 'spring-forest',
    title: 'Spring Forest',
    description: 'Fresh spring morning with birdsong and rustling leaves.',
    icon: Leaf,
    bgColor: 'linear-gradient(135deg, #a3e635, #65a30d)',
    primaryColor: '#a3e635',
    primaryRgb: '163, 230, 53',
    src: 'https://actions.google.com/sounds/v1/ambiences/spring_day_forest.ogg'
  },
  {
    id: 'outdoor-farm',
    title: 'Outdoor Farm',
    description: 'Peaceful farm sounds with roosters and gentle wind.',
    icon: Wheat,
    bgColor: 'linear-gradient(135deg, #fb923c, #ea580c)',
    primaryColor: '#fb923c',
    primaryRgb: '251, 146, 60',
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
    src: 'https://actions.google.com/sounds/v1/weather/summer_thunder_and_rain.ogg'
  }
];

export default function MusicPage() {

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('rain');
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  const Icon = currentSoundscape.icon;

  return (
    <div className="min-h-screen bg-[#0f0720] relative overflow-hidden text-white">
      {/* Ambient Glow Background */}
      {currentTrack && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${currentSoundscape.primaryColor}, transparent)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      <main id="main" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Main Player */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
            NOW PLAYING
          </p>

          <h1 className="text-6xl font-bold mb-4">
            {currentSoundscape.title}
          </h1>

          <p className="text-white/60 mb-8">
            {currentSoundscape.description}
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => togglePlay(currentTrack, currentSoundscape.src)}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
          >
            {isPlaying ?
              <Pause className="w-8 h-8 text-black" /> :
              <Play className="w-8 h-8 text-black ml-1" />
            }
          </motion.button>
        </div>

        {/* Track List */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white mb-6 px-2">
            {currentTrack ? 'Switch Soundscape' : 'Available Soundscapes'}
          </h2>

          {soundscapes.map((track, index) => {
            const isActive = currentTrack === track.id;
            const Icon = track.icon;

            return (
              <motion.button
                key={track.id}
                onClick={() => togglePlay(track.id, track.src)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 4 }}
                aria-pressed={isActive}
                aria-label={
                  isActive && isPlaying
                    ? `Pause ${track.title} soundscape`
                    : `Play ${track.title} soundscape`
                }
                className={`
                  w-full group relative overflow-hidden rounded-xl transition-all duration-300
                  ${isActive ? 'bg-white/10' : 'bg-white/5 hover:bg-white/8'}
                `}
                style={{
                  boxShadow: isActive
                    ? `0 0 0 2px rgba(${track.primaryRgb}, 0.5), 0 4px 24px rgba(${track.primaryRgb}, 0.2)`
                    : 'none'
                }}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Icon with Glow */}
                  <div
                    className="relative flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center"
                    style={{
                      background: track.bgColor,
                      boxShadow: isActive
                        ? `0 4px 16px rgba(${track.primaryRgb}, 0.4)`
                        : 'none',
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-base font-semibold text-white truncate">
                      {track.title}
                    </h3>
                    <p className="text-sm text-white/50 truncate">
                      {track.description}
                    </p>
                  </div>

                  {/* Playing Indicator or Play Icon */}
                  {isActive && isPlaying ? (
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 rounded-full"
                          style={{
                            background: track.primaryColor,
                          }}
                          animate={{
                            height: ['16px', '8px', '20px', '12px'],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
}