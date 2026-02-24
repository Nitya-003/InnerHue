import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a compassionate AI emotional wellness companion named Hue. 
Your role is to provide empathetic, supportive responses to help users explore and understand their emotions.
Guidelines:
- Be warm, non-judgmental, and supportive
- Ask thoughtful follow-up questions to help users reflect deeper
- Offer gentle coping strategies when appropriate
- Keep responses concise (2-4 sentences) unless the user needs more
- Never diagnose or replace professional therapy
- Use a calm, caring tone`;

// Emotion-aware fallback responses (used when no API key is set)
const fallbackResponses: Record<string, string[]> = {
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

function getFallbackResponse(emotion: string, messageCount: number): string {
    const key = emotion in fallbackResponses ? emotion : 'default';
    const responses = fallbackResponses[key];
    return responses[messageCount % responses.length];
}

export async function POST(req: NextRequest) {
    // ── Parse request body ────────────────────────────────────────────────────
    let messages: { role: string; content: string }[];
    let emotion: string | undefined;

    try {
        const body = await req.json() as {
            messages: { role: string; content: string }[];
            emotion?: string;
        };
        messages = body.messages;
        emotion = body.emotion;
    } catch (parseError) {
        console.error('[Chat API] Failed to parse request body:', parseError);
        return NextResponse.json(
            { error: 'Invalid request body. Expected valid JSON.' },
            { status: 400 }
        );
    }

    // ── Validate messages field ───────────────────────────────────────────────
    if (!Array.isArray(messages) || messages.length === 0) {
        console.error('[Chat API] Invalid or missing messages array:', messages);
        return NextResponse.json(
            { error: 'Invalid request: "messages" must be a non-empty array.' },
            { status: 400 }
        );
    }

    try {
        const apiKey = process.env.OPENAI_API_KEY;

        // ── Fallback mode (no API key) ────────────────────────────────────────────
        if (!apiKey) {
            const reply = getFallbackResponse(emotion ?? 'default', messages.length);
            return NextResponse.json({ reply });
        }

        // ── OpenAI mode ───────────────────────────────────────────────────────────
        const systemMessage = {
            role: 'system',
            content: emotion
                ? `${SYSTEM_PROMPT}\n\nThe user is currently feeling: ${emotion}. Tailor your response to this emotional state.`
                : SYSTEM_PROMPT,
        };

        // ── Timeout protection (5 seconds) ────────────────────────────────────
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        let response: Response;
        try {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [systemMessage, ...messages],
                    max_tokens: 200,
                    temperature: 0.8,
                }),
                signal: controller.signal,
            });
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if ((fetchError as Error).name === 'AbortError') {
                console.error('[Chat API] OpenAI request timed out after 5s');
            } else {
                console.error('[Chat API] OpenAI fetch failed:', fetchError);
            }
            const reply = getFallbackResponse(emotion ?? 'default', messages.length);
            return NextResponse.json({ reply });
        }
        clearTimeout(timeoutId);

        if (!response.ok) {
            const err = await response.text();
            console.error('[Chat API] OpenAI HTTP error:', response.status, err);
            const reply = getFallbackResponse(emotion ?? 'default', messages.length);
            return NextResponse.json({ reply });
        }

        // ── Parse OpenAI response ─────────────────────────────────────────────
        let data: { choices?: { message?: { content?: string } }[] };
        try {
            data = await response.json();
        } catch (parseError) {
            console.error('[Chat API] Failed to parse OpenAI response JSON:', parseError);
            const reply = getFallbackResponse(emotion ?? 'default', messages.length);
            return NextResponse.json({ reply });
        }

        // ── Validate response structure ───────────────────────────────────────
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || content.trim() === '') {
            console.error('[Chat API] Unexpected OpenAI response structure:', JSON.stringify(data));
            const reply = getFallbackResponse(emotion ?? 'default', messages.length);
            return NextResponse.json({ reply });
        }

        return NextResponse.json({ reply: content });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { reply: "I'm here to listen. Can you tell me more about how you're feeling?" },
            { status: 200 }
        );
    }
}
