'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Heart, Sparkle, Loader2, WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AITherapistProps {
    onEmotionDetected?: (emotions: string[]) => void;
    onAutoNavigate?: () => void;
    activeEmotion?: string;
}

// Local keyword detection (still used for onEmotionDetected callback)
function detectEmotionsLocally(text: string): string[] {
    const lowerText = text.toLowerCase();
    const keywords: Record<string, string[]> = {
        happy: ['happy', 'joy', 'great', 'amazing', 'wonderful', 'excited', 'love', 'glad', 'delighted'],
        sad: ['sad', 'depressed', 'down', 'unhappy', 'crying', 'hurt', 'heartbroken', 'devastated'],
        anxious: ['anxious', 'worried', 'nervous', 'stressed', 'anxiety', 'panic', 'fear', 'scared', 'tense'],
        angry: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'rage'],
        calm: ['calm', 'peaceful', 'relaxed', 'chill', 'tranquil', 'serene', 'okay', 'fine'],
        excited: ['excited', 'thrilled', 'enthusiastic', 'pumped', 'energized', 'hyped'],
        lonely: ['lonely', 'alone', 'isolated', 'abandoned'],
        hopeful: ['hopeful', 'optimistic', 'positive', 'confident'],
        overwhelmed: ['overwhelmed', 'swamped', 'too much', 'burden', 'pressure'],
        grateful: ['grateful', 'thankful', 'blessed', 'appreciate'],
    };
    const found: string[] = [];
    for (const [emotion, words] of Object.entries(keywords)) {
        if (words.some(w => lowerText.includes(w)) && !found.includes(emotion)) {
            found.push(emotion);
        }
    }
    return found.length > 0 ? found : ['calm'];
}

export default function AITherapist({ onEmotionDetected, onAutoNavigate, activeEmotion }: AITherapistProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorType, setErrorType] = useState<'network' | 'timeout' | 'parse' | 'server' | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Cancel any in-flight request when the component unmounts
    useEffect(() => {
        return () => { abortControllerRef.current?.abort(); };
    }, []);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMessage: Message = { role: 'user', content: text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);
        setErrorType(null);

        // Detect emotions for the callback
        const detected = detectEmotionsLocally(text);
        if (onEmotionDetected && detected.length > 0) {
            onEmotionDetected(detected.slice(0, 3));
        }

        // ── Abort any previous in-flight request ────────────────────────────
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                    emotion: activeEmotion ?? detected[0],
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            // ── Check HTTP status before parsing ─────────────────────────────
            if (!res.ok) {
                console.error('[AITherapist] API responded with status:', res.status);
                setErrorType('server');
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "I'm having a little trouble connecting right now. Please try again in a moment. 💜",
                }]);
                return;
            }

            // ── Safely parse JSON ─────────────────────────────────────────────
            let data: { reply?: unknown };
            try {
                data = await res.json();
            } catch (parseError) {
                console.error('[AITherapist] Failed to parse response JSON:', parseError);
                setErrorType('parse');
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "Something unexpected happened. I'm still here — please try again. 💜",
                }]);
                return;
            }

            // ── Validate response structure ───────────────────────────────────
            const reply = typeof data?.reply === 'string' && data.reply.trim() !== ''
                ? data.reply
                : "I'm here for you. Could you tell me more about how you're feeling?";

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (networkError) {
            clearTimeout(timeoutId);
            if ((networkError as Error).name === 'AbortError') {
                console.error('[AITherapist] Request timed out or was cancelled');
                setErrorType('timeout');
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "The response is taking too long. Please try again. 💜",
                }]);
            } else {
                console.error('[AITherapist] Network error:', networkError);
                setErrorType('network');
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "It seems like you're offline. Check your connection and try again. 💜",
                }]);
            }
        } finally {
            setIsLoading(false);
        }

        // Auto-navigate after first exchange
        if (messages.length === 0 && onAutoNavigate) {
            setTimeout(onAutoNavigate, 3500);
        }
    };

    const handleReset = () => {
        abortControllerRef.current?.abort();   // cancel any in-flight request
        abortControllerRef.current = null;
        setMessages([]);
        setInput('');
        setErrorType(null);                    // clear stale error banner
        setIsLoading(false);                   // ensure loading state is reset
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="fab"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-violet-600 to-pink-600 text-white p-4 rounded-full shadow-2xl shadow-violet-500/40"
                        aria-label="Open AI Therapist"
                    >
                        <div className="relative w-6 h-6">
                            <Heart className="w-6 h-6" />
                            <Sparkle className="w-3.5 h-3.5 absolute -top-1 -right-1 text-yellow-200 animate-ping" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-sm flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
                        style={{
                            background: 'rgba(15, 10, 30, 0.85)',
                            backdropFilter: 'blur(32px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            maxHeight: '80vh',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600/80 to-pink-600/80 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">Hue — AI Companion</h3>
                                    <p className="text-xs text-white/70">Here to listen & support 💜</p>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 200, maxHeight: 340 }}>
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2"
                                >
                                    <div className="flex gap-2 items-start">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/90 max-w-[85%]">
                                            Hey there 👋 I&apos;m Hue, your emotional wellness companion. How are you feeling right now?
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className={`flex gap-2 items-end ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] leading-relaxed ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-violet-600 to-pink-600 text-white rounded-br-sm'
                                                : 'bg-white/10 text-white/90 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2 items-center"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                        <span className="text-white/60 text-xs">Hue is thinking…</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* Error Banner */}
                        <AnimatePresence>
                            {errorType && (
                                <motion.div
                                    key="error-banner"
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className={`mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                                        errorType === 'network'
                                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            : errorType === 'timeout'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                    }`}
                                >
                                    {errorType === 'network' && <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />}
                                    {errorType === 'timeout' && <Clock className="w-3.5 h-3.5 flex-shrink-0" />}
                                    {(errorType === 'parse' || errorType === 'server') && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
                                    <span>
                                        {errorType === 'network' && 'No connection — check your network'}
                                        {errorType === 'timeout' && 'Response timed out — try again'}
                                        {errorType === 'parse' && 'Unexpected response — try again'}
                                        {errorType === 'server' && 'Service issue — try again shortly'}
                                    </span>
                                    <button
                                        onClick={() => setErrorType(null)}
                                        className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
                                        aria-label="Dismiss error"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="px-4 pb-4 pt-2 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="I'm feeling…"
                                    disabled={isLoading}
                                    className="flex-1 bg-white/10 border border-white/15 text-white placeholder-white/40 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 disabled:opacity-50"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="bg-gradient-to-br from-violet-600 to-pink-600 text-white p-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    aria-label="Send"
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </div>
                            {messages.length > 0 && (
                                <button
                                    onClick={() => setMessages([])}
                                    className="mt-2 w-full text-xs text-white/40 hover:text-white/70 transition-colors"
                                >
                                    Start new conversation
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
