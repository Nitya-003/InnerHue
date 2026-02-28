'use client';

import { motion } from 'framer-motion';
import { BookOpen, Wind, Music, X } from 'lucide-react';
import { useState } from 'react';

interface MoodReflectionCardProps {
  mood: {
    id: string;
    name: string;
    emoji: string;
    color: string;
    glow: string;
  };
  suggestion: {
    prompt: string;
    quote: string;
    author: string;
    keywords: string[];
    music: string;
  };
  onClose?: () => void;
}

export function MoodReflectionCard({ mood, suggestion, onClose }: MoodReflectionCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  // Generate contextual insight based on mood
  const getContextualInsight = (moodId: string): string => {
    const insights: Record<string, string> = {
      happy: "Your joy is a gift to yourself and those around you. Embrace this moment.",
      sad: "Sadness is a natural part of healing. It's okay to feel this way.",
      anxious: "Your feelings are valid. Take a deep breath and ground yourself in the present.",
      excited: "This energy can fuel amazing things. Channel it into something meaningful.",
      calm: "You've found your center. Rest in this peaceful moment.",
      angry: "Your anger carries important information. Listen to what it's trying to tell you.",
      confused: "Uncertainty is where growth begins. Be patient with yourself.",
      grateful: "Gratitude opens the door to abundance. Notice the beauty around you.",
      lonely: "Connection starts from within. You are worthy of companionship.",
      hopeful: "Hope is the light that guides you forward. Trust in your journey.",
      stressed: "This feeling will pass. Focus on one breath, one moment at a time.",
      peaceful: "You've created space for tranquility. Honor this stillness.",
      energized: "Your vitality is powerful. Use it to create and explore.",
      overwhelmed: "You're handling more than you think. Break it down into smaller steps.",
      content: "This satisfaction is well-deserved. Savor this feeling of completeness.",
      frustrated: "Frustration signals that you care. Transform this energy constructively.",
      inspired: "Your creativity is awakening. Let it guide you to new possibilities.",
      melancholy: "There's beauty in the bittersweet. Allow yourself to feel deeply.",
      motivated: "Your drive is your superpower. Take action while the fire burns bright.",
      vulnerable: "Vulnerability is courage, not weakness. You are brave for feeling this.",
      empowered: "Your strength is undeniable. You have everything you need within you.",
      nostalgic: "The past holds treasures and lessons. Honor what was while embracing what is.",
      jealous: "This feeling reveals what matters to you. Use it as a compass for growth.",
      proud: "Celebrate your achievements. You've worked hard to reach this moment.",
      curious: "Your wonder is the gateway to discovery. Follow where it leads.",
      bored: "Stillness invites creativity. What new adventure calls to you?",
      surprised: "Life's unexpected moments keep you present. Stay open to wonder.",
      disgusted: "Your boundaries matter. It's okay to reject what doesn't serve you.",
      embarrassed: "Everyone makes mistakes. Self-compassion is the path forward.",
      determined: "Your resolve is unshakable. Keep pushing toward your vision.",
      playful: "Joy and lightness are essential. Give yourself permission to play.",
      dreamy: "Your imagination is vast. Let your mind wander to beautiful places.",
      adventurous: "The world is full of possibilities. Step boldly into the unknown.",
      romantic: "Love and connection make life meaningful. Nurture what matters most.",
      creative: "Your unique vision deserves expression. Create without judgment.",
      philosophical: "Deep questions lead to profound understanding. Explore your thoughts.",
      rebellious: "Questioning the status quo can spark change. Channel this energy wisely.",
      silly: "Laughter is medicine. Don't take everything so seriously."
    };

    return insights[moodId] || "Take a moment to honor whatever you're feeling right now.";
  };

  // Suggest actions based on mood
  const getSuggestedActions = (moodId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionMap: Record<string, Array<{ icon: any; label: string; action: string }>> = {
      happy: [
        { icon: BookOpen, label: 'Journal', action: 'Capture this joyful moment in writing' },
        { icon: Music, label: 'Music', action: 'Dance to uplifting tunes' }
      ],
      sad: [
        { icon: Wind, label: 'Breathe', action: 'Try 4-7-8 breathing technique' },
        { icon: Music, label: 'Music', action: 'Listen to soothing melodies' }
      ],
      anxious: [
        { icon: Wind, label: 'Breathe', action: 'Practice box breathing (4-4-4-4)' },
        { icon: BookOpen, label: 'Journal', action: 'Write down your worries' }
      ],
      stressed: [
        { icon: Wind, label: 'Breathe', action: 'Take 5 deep belly breaths' },
        { icon: Music, label: 'Music', action: 'Play calming ambient sounds' }
      ],
      calm: [
        { icon: BookOpen, label: 'Reflect', action: 'Note what brings you peace' },
        { icon: Wind, label: 'Meditate', action: 'Extend this calm with meditation' }
      ],
      angry: [
        { icon: BookOpen, label: 'Journal', action: 'Write out your frustrations' },
        { icon: Wind, label: 'Breathe', action: 'Release tension with deep breaths' }
      ]
    };

    return actionMap[moodId] || [
      { icon: Wind, label: 'Breathe', action: 'Take three deep breaths' },
      { icon: BookOpen, label: 'Journal', action: 'Reflect on this feeling' }
    ];
  };

  const insight = getContextualInsight(mood.id);
  const actions = getSuggestedActions(mood.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="relative w-full max-w-2xl mx-auto my-8"
    >
      {/* Frosted Glass Card */}
      <div
        className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
        style={{
          borderImage: `linear-gradient(135deg, ${mood.color}40, ${mood.glow}20) 1`,
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px ${mood.color}20`
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${mood.color}, ${mood.glow})`
          }}
        />

        {/* Close button */}
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors z-10"
            aria-label="Close reflection card"
          >
            <X className="w-5 h-5 text-white/80" />
          </motion.button>
        )}

        <div className="relative p-8 space-y-6">
          {/* Emoji and Mood Name */}
          <div className="flex items-center space-x-3">
            <span className="text-5xl" role="img" aria-label={mood.name}>
              {mood.emoji}
            </span>
            <div>
              <h3 className="text-2xl font-semibold light:text-black ">
                Feeling {mood.name}
              </h3>
              <p className="text-sm mt-1">Reflection time</p>
            </div>
          </div>

          {/* Contextual Insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h4 className="text-sm uppercase tracking-wider font-medium">
              Insight
            </h4>
            <p className="text-lg leading-relaxed font-light">
              {insight}
            </p>
          </motion.div>

          {/* Reflective Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h4 className="text-sm uppercase tracking-wider font-medium">
              Reflection Prompt
            </h4>
            <p className="text-base leading-relaxed italic">
              "{suggestion.prompt}"
            </p>
          </motion.div>

          {/* Quote */}
          {suggestion.quote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pl-4 border-l-2 border-white/20"
            >
              <p className="text-sm italic">
                "{suggestion.quote}"
              </p>
              {suggestion.author && (
                <p className="text-xs mt-1">
                  — {suggestion.author}
                </p>
              )}
            </motion.div>
          )}

          {/* Suggested Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <h4 className="text-sm uppercase tracking-wide font-medium">
              Suggested Actions
            </h4>
            <div className="flex flex-wrap gap-3">
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-black/40 hover:border-white/30 transition-all"
                  aria-label={action.action}
                  title={action.action}
                >
                  <action.icon className="w-4 h-4 group-hover:text-white/90 transition-colors" />
                  <span className="text-sm group-hover:text-white/100 transition-colors">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Keywords Tags */}
          {suggestion.keywords && suggestion.keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {suggestion.keywords.slice(0, 6).map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full bg-white/5 border border-black/40"
                >
                  {keyword}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
