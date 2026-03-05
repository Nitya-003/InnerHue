/**
 * Reflective Mood Data for Emotional Logging
 * Transforms emoji-based mood selection into reflective language
 * that encourages emotional nuance and self-awareness
 */

export interface ReflectiveMood {
  id: string;
  label: string;
  tone: 'calm' | 'stress' | 'hopeful' | 'neutral';
  category: string;
  color: string;
  glow: string;
}

export const reflectiveMoods: ReflectiveMood[] = [
  // Calm & Content States
  { 
    id: 'quiet-contentment', 
    label: 'Quiet Contentment', 
    tone: 'calm',
    category: 'peaceful',
    color: '#A3B18A',
    glow: '#B8C5A0'
  },
  { 
    id: 'gentle-ease', 
    label: 'Gentle Ease', 
    tone: 'calm',
    category: 'peaceful',
    color: '#A3B18A',
    glow: '#B8C5A0'
  },
  { 
    id: 'soft-presence', 
    label: 'Soft Presence', 
    tone: 'calm',
    category: 'peaceful',
    color: '#A3B18A',
    glow: '#B8C5A0'
  },
  { 
    id: 'grounded-stability', 
    label: 'Grounded Stability', 
    tone: 'calm',
    category: 'peaceful',
    color: '#A3B18A',
    glow: '#B8C5A0'
  },

  // Hopeful & Positive States
  { 
    id: 'muted-optimism', 
    label: 'Muted Optimism', 
    tone: 'hopeful',
    category: 'positive',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'anticipatory-excitement', 
    label: 'Anticipatory Excitement', 
    tone: 'hopeful',
    category: 'energetic',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'tender-gratitude', 
    label: 'Tender Gratitude', 
    tone: 'hopeful',
    category: 'positive',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'emerging-clarity', 
    label: 'Emerging Clarity', 
    tone: 'hopeful',
    category: 'positive',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'renewed-determination', 
    label: 'Renewed Determination', 
    tone: 'hopeful',
    category: 'energetic',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },

  // Stress & Tension States
  { 
    id: 'lingering-restlessness', 
    label: 'Lingering Restlessness', 
    tone: 'stress',
    category: 'anxiety',
    color: '#D4A373',
    glow: '#DDB589'
  },
  { 
    id: 'social-fatigue', 
    label: 'Social Fatigue', 
    tone: 'stress',
    category: 'exhaustion',
    color: '#D4A373',
    glow: '#DDB589'
  },
  { 
    id: 'quiet-overwhelm', 
    label: 'Quiet Overwhelm', 
    tone: 'stress',
    category: 'anxiety',
    color: '#D4A373',
    glow: '#DDB589'
  },
  { 
    id: 'building-tension', 
    label: 'Building Tension', 
    tone: 'stress',
    category: 'anxiety',
    color: '#D4A373',
    glow: '#DDB589'
  },
  { 
    id: 'scattered-thoughts', 
    label: 'Scattered Thoughts', 
    tone: 'stress',
    category: 'confusion',
    color: '#D4A373',
    glow: '#DDB589'
  },
  { 
    id: 'emotional-fog', 
    label: 'Emotional Fog', 
    tone: 'stress',
    category: 'confusion',
    color: '#D4A373',
    glow: '#DDB589'
  },

  // Neutral & Contemplative States
  { 
    id: 'thoughtful-distance', 
    label: 'Thoughtful Distance', 
    tone: 'neutral',
    category: 'contemplative',
    color: '#EAE3DA',
    glow: '#F2EDE6'
  },
  { 
    id: 'observant-stillness', 
    label: 'Observant Stillness', 
    tone: 'neutral',
    category: 'contemplative',
    color: '#EAE3DA',
    glow: '#F2EDE6'
  },
  { 
    id: 'curious-awareness', 
    label: 'Curious Awareness', 
    tone: 'neutral',
    category: 'contemplative',
    color: '#EAE3DA',
    glow: '#F2EDE6'
  },
  { 
    id: 'reflective-pause', 
    label: 'Reflective Pause', 
    tone: 'neutral',
    category: 'contemplative',
    color: '#EAE3DA',
    glow: '#F2EDE6'
  },

  // Vulnerable States
  { 
    id: 'tender-vulnerability', 
    label: 'Tender Vulnerability', 
    tone: 'calm',
    category: 'sensitivity',
    color: '#A3B18A',
    glow: '#B8C5A0'
  },
  { 
    id: 'gentle-melancholy', 
    label: 'Gentle Melancholy', 
    tone: 'calm',
    category: 'sadness',
    color: '#A3B18A',
    glow: '#B8C5A0'
  },
  { 
    id: 'aching-loneliness', 
    label: 'Aching Loneliness', 
    tone: 'stress',
    category: 'sadness',
    color: '#D4A373',
    glow: '#DDB589'
  },
  { 
    id: 'raw-emotion', 
    label: 'Raw Emotion', 
    tone: 'stress',
    category: 'intensity',
    color: '#D4A373',
    glow: '#DDB589'
  },

  // Creative & Playful States
  { 
    id: 'creative-spark', 
    label: 'Creative Spark', 
    tone: 'hopeful',
    category: 'inspiration',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'lighthearted-joy', 
    label: 'Lighthearted Joy', 
    tone: 'hopeful',
    category: 'playful',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'inspired-momentum', 
    label: 'Inspired Momentum', 
    tone: 'hopeful',
    category: 'energetic',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },

  // Complex Emotional States
  { 
    id: 'bittersweet-nostalgia', 
    label: 'Bittersweet Nostalgia', 
    tone: 'neutral',
    category: 'complex',
    color: '#EAE3DA',
    glow: '#F2EDE6'
  },
  { 
    id: 'cautious-hope', 
    label: 'Cautious Hope', 
    tone: 'hopeful',
    category: 'complex',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'restrained-frustration', 
    label: 'Restrained Frustration', 
    tone: 'stress',
    category: 'complex',
    color: '#D4A373',
    glow: '#DDB589'
  },
  { 
    id: 'peaceful-resignation', 
    label: 'Peaceful Resignation', 
    tone: 'calm',
    category: 'complex',
    color: '#A3B18A',
    glow: '#B8C5A0'
  },

  // Energized States
  { 
    id: 'purposeful-energy', 
    label: 'Purposeful Energy', 
    tone: 'hopeful',
    category: 'energetic',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
  { 
    id: 'focused-drive', 
    label: 'Focused Drive', 
    tone: 'hopeful',
    category: 'energetic',
    color: '#C8A2C8',
    glow: '#D5B4D5'
  },
];

export default reflectiveMoods;
