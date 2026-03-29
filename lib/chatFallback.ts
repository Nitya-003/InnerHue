/** Client-safe fallback replies when /api/chat is unavailable (e.g. static export). */
export const fallbackResponses: Record<string, string[]> = {
  anxious: [
    "I can hear that you're feeling anxious right now. That's a really uncomfortable feeling. Try taking three slow, deep breaths — in for 4 counts, hold for 4, out for 4. What's the main thing weighing on your mind?",
    "Anxiety can feel so overwhelming. You're not alone in this. Can you tell me more about what's triggering these feelings today?",
  ],
  sad: [
    "I'm sorry you're feeling sad. It's okay to sit with that feeling — sadness is a valid and important emotion. Would you like to talk about what's brought this on?",
    "Sadness can feel heavy, but you don't have to carry it alone. I'm here to listen. What's been happening for you lately?",
  ],
  angry: [
    "It sounds like something has really frustrated or upset you. Your feelings are completely valid. Would it help to talk through what happened?",
    "Anger often signals that something important to us has been threatened or crossed. What's at the heart of what you're feeling?",
  ],
  happy: [
    "That's wonderful! I love hearing that you're feeling happy. What's been bringing you joy today? Let's celebrate it! 🌟",
    "Happiness is such a beautiful feeling. What's been the highlight of your day?",
  ],
  calm: [
    "It's lovely that you're feeling calm. This is a great state to reflect from. Is there anything you'd like to explore or appreciate about this moment?",
    "Calm is such a grounding feeling. How are you nurturing this sense of peace?",
  ],
  default: [
    "Thank you for sharing how you're feeling with me. Emotions can be complex and layered. Can you tell me more about what's going on for you right now?",
    "I'm here to listen and support you. What's been on your mind lately?",
    "Your feelings matter. I'd love to understand more about what you're experiencing. What would feel most helpful to explore right now?",
  ],
};

export function getFallbackResponse(emotion: string, messageCount: number): string {
  const key = emotion in fallbackResponses ? emotion : 'default';
  const responses = fallbackResponses[key];
  return responses[messageCount % responses.length];
}
