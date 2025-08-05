'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, Play, Heart, Clock } from 'lucide-react';

const musicRecommendations = {
  happy: {
    playlist: "Feel Good Vibes",
    description: "Uplifting songs to amplify your joy",
    songs: [
      { title: "Good as Hell", artist: "Lizzo", duration: "3:28" },
      { title: "Walking on Sunshine", artist: "Katrina & The Waves", duration: "3:58" },
      { title: "Happy", artist: "Pharrell Williams", duration: "3:52" },
      { title: "Can't Stop the Feeling", artist: "Justin Timberlake", duration: "3:56" }
    ],
    color: "#FFD93D"
  },
  sad: {
    playlist: "Gentle Healing",
    description: "Soothing melodies for emotional processing",
    songs: [
      { title: "Mad World", artist: "Tears for Fears", duration: "3:34" },
      { title: "Hurt", artist: "Johnny Cash", duration: "3:38" },
      { title: "Black", artist: "Pearl Jam", duration: "5:43" },
      { title: "The Night We Met", artist: "Lord Huron", duration: "3:28" }
    ],
    color: "#42A5F5"
  },
  anxious: {
    playlist: "Calm & Center",
    description: "Peaceful tracks to ease anxiety",
    songs: [
      { title: "Weightless", artist: "Marconi Union", duration: "8:08" },
      { title: "Claire de Lune", artist: "Claude Debussy", duration: "5:23" },
      { title: "Aqueous Transmission", artist: "Incubus", duration: "7:49" },
      { title: "Mad World", artist: "Gary Jules", duration: "3:07" }
    ],
    color: "#FF7043"
  },
  excited: {
    playlist: "High Energy",
    description: "Electric beats matching your excitement",
    songs: [
      { title: "Electricity", artist: "Dua Lipa", duration: "3:35" },
      { title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", duration: "4:30" },
      { title: "I Gotta Feeling", artist: "Black Eyed Peas", duration: "4:05" }
    ],
    color: "#AB47BC"
  },
  calm: {
    playlist: "Peaceful Mind",
    description: "Serene sounds for mindful moments",
    songs: [
      { title: "River", artist: "Eminem ft. Ed Sheeran", duration: "3:40" },
      { title: "Holocene", artist: "Bon Iver", duration: "5:36" },
      { title: "To Build a Home", artist: "The Cinematic Orchestra", duration: "6:24" },
      { title: "Mad About You", artist: "Gabrielle Aplin", duration: "3:37" }
    ],
    color: "#66BB6A"
  }
};

export default function MusicPage() {
  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const currentPlaylist = musicRecommendations[selectedMood as keyof typeof musicRecommendations];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 p-2 rounded-lg bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Back</span>
            </motion.button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Music
            </h1>
          </div>
          
          <div className="w-20" /> {/* Spacer */}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Music for Every Emotion
            </h2>
            <p className="text-gray-600">
              Discover playlists curated to match and enhance your current mood
            </p>
          </motion.div>

          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {Object.keys(musicRecommendations).map((mood) => (
              <motion.button
                key={mood}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedMood === mood
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90'
                }`}
              >
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Playlist */}
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50"
          >
            {/* Playlist Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {currentPlaylist.playlist}
                </h3>
                <p className="text-gray-600">{currentPlaylist.description}</p>
              </div>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: currentPlaylist.color }}
              >
                <Music className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Songs List */}
            <div className="space-y-3">
              {currentPlaylist.songs.map((song, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/50 backdrop-blur hover:bg-white/70 transition-all group cursor-pointer"
                  onClick={() => setIsPlaying(isPlaying === `${selectedMood}-${index}` ? null : `${selectedMood}-${index}`)}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isPlaying === `${selectedMood}-${index}`
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 group-hover:bg-purple-100 text-gray-600'
                      }`}
                    >
                      <Play className="w-4 h-4 ml-0.5" />
                    </motion.div>
                    <div>
                      <div className="font-medium text-gray-800">{song.title}</div>
                      <div className="text-sm text-gray-500">{song.artist}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-pink-100 transition-all group"
                    >
                      <Heart className="w-4 h-4 text-gray-400 group-hover:text-pink-500" />
                    </motion.button>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {song.duration}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Spotify Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Open in Spotify
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
