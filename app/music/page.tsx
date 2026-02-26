'use client';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, CloudRain, Trees, Waves, Wind } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const soundscapes = [
  {
    id: 'rain',
    title: 'Heavy Rain',
    description: 'Continuous heavy rain falling on pavement.',
    icon: CloudRain,
    bgColor: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    src: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg'
  },
  {
    id: 'forest',
    title: 'Forest Morning',
    description: 'Birds chirping and wind rustling in the trees.',
    icon: Trees,
    bgColor: 'linear-gradient(135deg, #10b981, #047857)',
    src: 'https://actions.google.com/sounds/v1/animals/june_songbirds.ogg'
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    description: 'Rhythmic waves crashing on the shore.',
    icon: Waves,
    bgColor: 'linear-gradient(135deg, #06b6d4, #0369a1)',
    src: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg'
  },
  {
    id: 'wind',
    title: 'Strong Wind',
    description: 'Howling wind to block out distractions.',
    icon: Wind,
    bgColor: 'linear-gradient(135deg, #6b7280, #374151)',
    src: 'https://actions.google.com/sounds/v1/weather/strong_wind.ogg'
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
    <div className="min-h-screen bg-[#0f0720] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex justify-between mb-12">
          <Link href="/" className="flex items-center text-white/70 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2"/>
            Back
          </Link>
          <ThemeToggle/>
        </div>

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
            whileTap={{scale:0.95}}
            onClick={() => togglePlay(currentTrack,currentSoundscape.src)}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
          >
            {isPlaying ?
              <Pause className="w-8 h-8 text-black"/> :
              <Play className="w-8 h-8 text-black ml-1"/>
            }
          </motion.button>

        </div>

      </div>
    </div>
  );
}