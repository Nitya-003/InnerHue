'use client';

import { useState } from 'react';
import { Bot, X, Send, Sparkles, Heart, Sparkle } from 'lucide-react';

interface SimpleLangFlowChatbotProps {
  onEmotionDetected?: (emotions: string[]) => void;
  onAutoNavigate?: () => void;
}

export default function SimpleLangFlowChatbot({ onEmotionDetected, onAutoNavigate }: SimpleLangFlowChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botResponse, setBotResponse] = useState('');

  // 🔬 PASTE YOUR LANGFLOW DETAILS HERE:
  // For now, we'll use local detection (no API needed)
  const USE_LOCAL_DETECTION = true; // Set to false once you deploy to cloud

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setBotResponse('Analyzing your emotions...');

    // Use simple local detection (works without API)
    const emotions = detectEmotionsLocally(message);

    if (emotions.length === 1) {
      setBotResponse(`I sense you're feeling ${emotions[0]}! Let me help you explore this emotion. 🌟`);
    } else if (emotions.length > 1) {
      setBotResponse(`I've detected multiple emotions: ${emotions.slice(0, 2).join(' and ')}. Let's explore them together! ✨`);
    } else {
      setBotResponse(`I'm here to help you explore your emotions! ❤️`);
    }

    // Auto-select emotions on the page
    if (onEmotionDetected && emotions.length > 0) {
      onEmotionDetected(emotions.slice(0, 3));
    }

    // Auto-navigate after showing message
    setTimeout(() => {
      setBotResponse(prev => prev + '\n\nTaking you to explore your emotions now! 🚀');
      setTimeout(() => {
        if (onAutoNavigate) {
          onAutoNavigate();
        }
      }, 1500);
    }, 2000);

    setIsLoading(false);
  };

  // Local emotion detection (works without API)
  const detectEmotionsLocally = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const emotions: string[] = [];

    const keywords = {
      happy: ['happy', 'joy', 'joyful', 'great', 'amazing', 'wonderful', 'excited', 'love', 'glad', 'pleased', 'delighted', 'cheerful', 'thrilled'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'crying', 'hurt', 'heartbroken', 'disappointed', 'devastated'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'anxiety', 'panic', 'fear', 'scared', 'afraid', 'tense', 'uneasy'],
      angry: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'rage', 'pissed'],
      excited: ['excited', 'thrilled', 'enthusiastic', 'pumped', 'energized', 'hyped', 'eager'],
      calm: ['calm', 'peaceful', 'relaxed', 'chill', 'tranquil', 'serene', 'okay', 'fine', 'alright'],
      confused: ['confused', 'puzzled', 'uncertain', 'unsure', 'lost', 'bewildered'],
      grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'appreciative'],
      lonely: ['lonely', 'alone', 'isolated', 'solitary', 'abandoned'],
      hopeful: ['hopeful', 'optimistic', 'positive', 'confident', 'encouraged'],
      stressed: ['stressed', 'overwhelmed', 'pressure', 'busy', 'swamped', 'burden'],
      content: ['content', 'satisfied', 'comfortable', 'settled'],
      frustrated: ['frustrated', 'stuck', 'blocked', 'hindered'],
      inspired: ['inspired', 'motivated', 'driven', 'creative', 'imaginative'],
      melancholy: ['melancholy', 'nostalgic', 'wistful', 'pensive', 'reflective']
    };

    // Check for emotion keywords
    for (const [emotion, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (lowerText.includes(word)) {
          if (!emotions.includes(emotion)) {
            emotions.push(emotion);
          }
        }
      }
    }

    // If no emotions detected, default to calm
    if (emotions.length === 0) {
      emotions.push('calm');
    }

    return emotions;
  };

  const handleReset = () => {
    setMessage('');
    setBotResponse('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110"
        >
          <div className="relative w-6 h-6">
            <Heart className="w-6 h-6" />
            <Sparkle className="w-3.5 h-3.5 absolute -top-0.5 -right-0.5 text-yellow-200 animate-ping" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Emotion Companion</h3>
                <p className="text-xs text-white/80">Here to help you explore 💜</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="p-6 min-h-[280px]">
            {!botResponse ? (
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  Hey there! 👋 I'm your emotion companion.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tell me how you're feeling and I'll help you explore your emotions!
                </p>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-line">{botResponse}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="I'm feeling..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm dark:bg-gray-800 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {botResponse && (
              <button
                onClick={handleReset}
                className="mt-3 w-full text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Start New Conversation
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}