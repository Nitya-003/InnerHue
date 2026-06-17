export interface Quote {
  content: string;
  author: string;
  tags?: string[];
}

export const fallbackQuotes: Quote[] = [
  // Happiness / Joy
  { content: "Happiness depends upon ourselves.", author: "Aristotle", tags: ["happiness"] },
  { content: "The most wasted of all days is one without laughter.", author: "E. E. Cummings", tags: ["happiness", "humor"] },
  { content: "Count your age by friends, not years. Count your life by smiles, not tears.", author: "John Lennon", tags: ["happiness", "friendship"] },

  // Sadness / Melancholy
  { content: "Tears come from the heart and not from the brain.", author: "Leonardo da Vinci", tags: ["sadness"] },
  { content: "The soul would have no rainbow had the eyes no tears.", author: "John Vance Cheney", tags: ["sadness", "hope"] },

  // Anxiety / Fear / Courage
  { content: "Courage is resistance to fear, mastery of fear, not absence of fear.", author: "Mark Twain", tags: ["courage"] },
  { content: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie", tags: ["courage", "wisdom"] },
  { content: "You’ve got this.", author: "InnerHue", tags: ["courage", "support"] },
  { content: "Breathe. Reset. Continue.", author: "InnerHue", tags: ["patience", "calm"] },

  // Inspiration / Motivation / Success
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["inspirational", "success"] },
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", tags: ["success", "perseverance"] },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", tags: ["inspirational", "faith"] },

  // Peace / Calm / Patience
  { content: "Peace comes from within. Do not seek it without.", author: "Buddha", tags: ["peace", "wisdom"] },
  { content: "Patience is bitter, but its fruit is sweet.", author: "Aristotle", tags: ["patience", "wisdom"] },
  { content: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson", tags: ["patience", "nature"] },

  // Anger / Forgiveness
  { content: "To err is human; to forgive, divine.", author: "Alexander Pope", tags: ["forgiveness"] },
  { content: "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.", author: "Mark Twain", tags: ["forgiveness", "wisdom"] },

  // Wisdom / Knowledge / Philosophy
  { content: "The only true wisdom is in knowing you know nothing.", author: "Socrates", tags: ["wisdom", "philosophy"] },
  { content: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", tags: ["wisdom", "knowledge"] },
  { content: "The unexamined life is not worth living.", author: "Socrates", tags: ["philosophy"] },

  // Gratitude
  { content: "Gratitude is not only the greatest of virtues, but the parent of all others.", author: "Cicero", tags: ["gratitude"] },
  { content: "When you arise in the morning think of what a privilege it is to be alive.", author: "Marcus Aurelius", tags: ["gratitude", "life"] },

  // Friendship / Love
  { content: "A friend is someone who knows all about you and still loves you.", author: "Elbert Hubbard", tags: ["friendship", "love"] },
  { content: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", tags: ["love"] },
  { content: "Where there is love there is life.", author: "Mahatma Gandhi", tags: ["love", "life"] },

  // Creativity / Imagination
  { content: "Creativity is intelligence having fun.", author: "Albert Einstein", tags: ["creativity", "humor"] },
  { content: "Imagination is more important than knowledge.", author: "Albert Einstein", tags: ["imagination", "knowledge"] },

  // Change / Adventure
  { content: "Life is either a daring adventure or nothing at all.", author: "Helen Keller", tags: ["adventure", "life"] },
  { content: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", tags: ["change", "inspirational"] },

  // Humor
  { content: "A day without laughter is a day wasted.", author: "Charlie Chaplin", tags: ["humor", "happiness"] },
  { content: "Life is too important to be taken seriously.", author: "Oscar Wilde", tags: ["humor", "philosophy"] }
];
