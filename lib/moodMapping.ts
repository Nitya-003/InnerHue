/**
 * Maps reflective moods to traditional emotional categories
 * for retrieving reflection data, suggestions, and quotes
 */

export const reflectiveToTraditionalMapping: Record<string, string> = {
  // Peaceful -> Calm
  'quiet-contentment': 'calm',
  'gentle-ease': 'calm',
  'soft-presence': 'calm',
  'grounded-stability': 'calm',
  
  // Positive -> Happy
  'muted-optimism': 'hopeful',
  'anticipatory-excitement': 'excited',
  'tender-gratitude': 'grateful',
  'emerging-clarity': 'hopeful',
  'renewed-determination': 'hopeful',
  
  // Energetic -> Energized/Excited
  'purposeful-energy': 'energized',
  'focused-drive': 'energized',
  
  // Anxiety -> Anxious/Stressed
  'lingering-restlessness': 'anxious',
  'social-fatigue': 'stressed',
  'quiet-overwhelm': 'stressed',
  'building-tension': 'anxious',
  'scattered-thoughts': 'confused',
  'emotional-fog': 'confused',
  
  // Contemplative -> Reflective moods
  'thoughtful-distance': 'peaceful',
  'observant-stillness': 'calm',
  'curious-awareness': 'curious',
  'reflective-pause': 'peaceful',
  
  // Sensitivity -> Vulnerable
  'tender-vulnerability': 'vulnerable',
  
  // Sadness -> Sad/Lonely
  'gentle-melancholy': 'sad',
  'aching-loneliness': 'lonely',
  
  // Intensity -> Strong emotions
  'raw-emotion': 'overwhelmed',
  
  // Inspiration -> Creative
  'creative-spark': 'inspired',
  'lighthearted-joy': 'happy',
  'inspired-momentum': 'inspired',
  
  // Complex -> Mixed emotions
  'bittersweet-nostalgia': 'nostalgic',
  'cautious-hope': 'hopeful',
  'restrained-frustration': 'frustrated',
  'peaceful-resignation': 'peaceful',
};

/**
 * Get the traditional mood ID for a reflective mood
 */
export function getTraditionalMoodId(reflectiveMoodId: string): string {
  return reflectiveToTraditionalMapping[reflectiveMoodId] || 'calm';
}
