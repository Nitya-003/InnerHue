export interface ReflectionData {
    insight: string;
    question: string;
    actions: { label: string; icon: 'journal' | 'breathe' | 'music'; description: string }[];
}

const reflections: Record<string, ReflectionData> = {
    happy: {
        insight: "Happiness is a signal that your needs are being met — savor this moment fully.",
        question: "What sparked this joy, and how can you create more of it?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write about this moment" },
            { label: "Music", icon: "music", description: "Amplify with upbeat tunes" },
        ],
    },
    sad: {
        insight: "Sadness is your inner compass telling you something matters deeply to you.",
        question: "What is your sadness trying to protect or honor?",
        actions: [
            { label: "Journal", icon: "journal", description: "Let your feelings flow on paper" },
            { label: "Breathe", icon: "breathe", description: "Gentle release breathing" },
            { label: "Music", icon: "music", description: "Soothing melodies" },
        ],
    },
    anxious: {
        insight: "Anxiety often means you care deeply — your mind is trying to prepare you.",
        question: "What would you tell a dear friend feeling exactly this way?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "4-7-8 calming technique" },
            { label: "Journal", icon: "journal", description: "Write down your worries" },
        ],
    },
    excited: {
        insight: "Excitement is creativity and possibility knocking at your door.",
        question: "How can you channel this energy into something meaningful today?",
        actions: [
            { label: "Journal", icon: "journal", description: "Capture your ideas" },
            { label: "Music", icon: "music", description: "Ride the energy wave" },
        ],
    },
    calm: {
        insight: "Calmness is not emptiness — it's the fullness of inner peace.",
        question: "What brought you to this peaceful state, and how can you return here?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "Deepen this serenity" },
            { label: "Journal", icon: "journal", description: "Reflect on gratitude" },
        ],
    },
    angry: {
        insight: "Anger is a messenger — it reveals your boundaries and values.",
        question: "What boundary needs to be honored right now?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "Transform fiery energy" },
            { label: "Journal", icon: "journal", description: "Write a letter to your anger" },
        ],
    },
    confused: {
        insight: "Confusion is clarity waiting to emerge — you're on the edge of understanding.",
        question: "What question, if answered, would bring the most clarity?",
        actions: [
            { label: "Journal", icon: "journal", description: "Map out your thoughts" },
            { label: "Breathe", icon: "breathe", description: "Clear your mind" },
        ],
    },
    grateful: {
        insight: "Gratitude transforms what you have into more than enough.",
        question: "Who or what are you most thankful for right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write a gratitude list" },
            { label: "Music", icon: "music", description: "Uplifting soul music" },
        ],
    },
    lonely: {
        insight: "Loneliness is a reminder of your deep capacity for connection.",
        question: "How can you extend kindness to yourself right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write to your future self" },
            { label: "Music", icon: "music", description: "Warm comforting melodies" },
            { label: "Breathe", icon: "breathe", description: "Self-compassion breathing" },
        ],
    },
    hopeful: {
        insight: "Hope is the light you carry within — it guides even in darkness.",
        question: "What possibility are you most drawn to right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Envision your future" },
            { label: "Music", icon: "music", description: "Inspiring melodies" },
        ],
    },
    stressed: {
        insight: "Stress is energy that hasn't found its direction yet.",
        question: "What is the one thing you can release control of today?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "Box breathing technique" },
            { label: "Journal", icon: "journal", description: "Brain dump your thoughts" },
        ],
    },
    peaceful: {
        insight: "Peace is not the absence of noise — it's harmony within.",
        question: "What does true relaxation feel like in your body right now?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "Body scan breathing" },
            { label: "Music", icon: "music", description: "Nature sounds" },
        ],
    },
    energized: {
        insight: "This vibrant energy is fuel — use it before it fades.",
        question: "What positive action could you take right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Set an intention" },
            { label: "Music", icon: "music", description: "Power playlist" },
        ],
    },
    overwhelmed: {
        insight: "Feeling overwhelmed means you're carrying too much — it's okay to set things down.",
        question: "What is one small thing you can do right now to lighten the load?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "Grounding technique" },
            { label: "Journal", icon: "journal", description: "Prioritize & release" },
        ],
    },
    content: {
        insight: "Contentment is the quiet celebration of a life well-lived in this moment.",
        question: "What simple pleasure are you enjoying most right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Capture this feeling" },
            { label: "Music", icon: "music", description: "Gentle acoustic vibes" },
        ],
    },
    frustrated: {
        insight: "Frustration is passion blocked — there's something you deeply want to achieve.",
        question: "What's the real obstacle, and what's one way around it?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "Release tension" },
            { label: "Journal", icon: "journal", description: "Problem-solve on paper" },
        ],
    },
    inspired: {
        insight: "Inspiration is a spark — act on it before it becomes just a memory.",
        question: "What creative idea is calling to you right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Sketch your vision" },
            { label: "Music", icon: "music", description: "Creative flow playlist" },
        ],
    },
    melancholy: {
        insight: "Melancholy holds beauty in its depth — it's the art of feeling deeply.",
        question: "What bittersweet memory is visiting you today?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write a poem or letter" },
            { label: "Music", icon: "music", description: "Reflective instrumentals" },
        ],
    },
    motivated: {
        insight: "Motivation is the bridge between dreaming and doing.",
        question: "What's the first step you can take right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write your action plan" },
            { label: "Music", icon: "music", description: "High-energy beats" },
        ],
    },
    vulnerable: {
        insight: "Vulnerability is not weakness — it's the birthplace of courage and connection.",
        question: "What would it feel like to let someone see the real you?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write honestly" },
            { label: "Breathe", icon: "breathe", description: "Self-compassion breathing" },
        ],
    },
    empowered: {
        insight: "You are the author of your story — this chapter is yours to write.",
        question: "What bold step have you been waiting to take?",
        actions: [
            { label: "Journal", icon: "journal", description: "Declare your intentions" },
            { label: "Music", icon: "music", description: "Empowerment anthems" },
        ],
    },
    nostalgic: {
        insight: "Nostalgia is love for a moment that shaped who you are today.",
        question: "What memory is calling you back, and what does it teach you?",
        actions: [
            { label: "Journal", icon: "journal", description: "Revisit a cherished memory" },
            { label: "Music", icon: "music", description: "Songs from the past" },
        ],
    },
    jealous: {
        insight: "Jealousy is a mirror — it reveals what you truly value and desire.",
        question: "What does this feeling tell you about your own unmet needs?",
        actions: [
            { label: "Journal", icon: "journal", description: "Explore your values" },
            { label: "Breathe", icon: "breathe", description: "Release comparison" },
        ],
    },
    proud: {
        insight: "Pride is the applause your soul gives you — you earned this.",
        question: "What challenge did you overcome to reach this moment?",
        actions: [
            { label: "Journal", icon: "journal", description: "Document your win" },
            { label: "Music", icon: "music", description: "Triumphant soundtrack" },
        ],
    },
    curious: {
        insight: "Curiosity is the engine of growth — every great discovery started with a question.",
        question: "What mystery are you most drawn to explore right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write your questions" },
            { label: "Music", icon: "music", description: "Intriguing soundscapes" },
        ],
    },
    bored: {
        insight: "Boredom is creativity's quiet invitation — something new wants to be born.",
        question: "If you could do anything right now without limits, what would it be?",
        actions: [
            { label: "Journal", icon: "journal", description: "Brainstorm freely" },
            { label: "Music", icon: "music", description: "Discover new genres" },
        ],
    },
    surprised: {
        insight: "Surprise breaks your patterns — it's life reminding you to stay open.",
        question: "What assumption was just challenged, and what can you learn from it?",
        actions: [
            { label: "Journal", icon: "journal", description: "Capture the unexpected" },
            { label: "Breathe", icon: "breathe", description: "Ground yourself" },
        ],
    },
    disgusted: {
        insight: "Disgust protects your values — it shows what you refuse to accept.",
        question: "What standard or boundary is being highlighted right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Clarify your values" },
            { label: "Breathe", icon: "breathe", description: "Release and reset" },
        ],
    },
    embarrassed: {
        insight: "Embarrassment means you care — and that vulnerability takes courage.",
        question: "Will this moment matter a year from now? What can you learn?",
        actions: [
            { label: "Breathe", icon: "breathe", description: "Self-compassion pause" },
            { label: "Journal", icon: "journal", description: "Reframe the narrative" },
        ],
    },
    determined: {
        insight: "Determination is your inner fire refusing to be extinguished.",
        question: "What's driving this resolve, and what's your next move?",
        actions: [
            { label: "Journal", icon: "journal", description: "Map your strategy" },
            { label: "Music", icon: "music", description: "Fuel your focus" },
        ],
    },
    playful: {
        insight: "Playfulness is wisdom in disguise — it keeps your spirit young.",
        question: "When did you last laugh so hard you forgot everything else?",
        actions: [
            { label: "Music", icon: "music", description: "Fun upbeat playlist" },
            { label: "Journal", icon: "journal", description: "Sketch or brainstorm freely" },
        ],
    },
    dreamy: {
        insight: "Dreams are the blueprints of tomorrow — let your imagination wander.",
        question: "What vision keeps returning to your mind?",
        actions: [
            { label: "Journal", icon: "journal", description: "Capture your daydreams" },
            { label: "Music", icon: "music", description: "Ethereal ambient sounds" },
        ],
    },
    adventurous: {
        insight: "The adventurous spirit knows that growth lives outside comfort zones.",
        question: "What new experience has been calling your name?",
        actions: [
            { label: "Journal", icon: "journal", description: "Plan your next adventure" },
            { label: "Music", icon: "music", description: "Epic exploration playlist" },
        ],
    },
    romantic: {
        insight: "Romance is seeing the extraordinary in the ordinary — in others and yourself.",
        question: "What makes your heart feel most alive right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Write a love letter" },
            { label: "Music", icon: "music", description: "Tender love songs" },
        ],
    },
    creative: {
        insight: "Creativity is intelligence having fun — let it play without judgment.",
        question: "What artistic vision is calling to you right now?",
        actions: [
            { label: "Journal", icon: "journal", description: "Sketch or brainstorm freely" },
            { label: "Music", icon: "music", description: "Creative flow sounds" },
        ],
    },
    philosophical: {
        insight: "The examined life is the only one worth living — keep questioning.",
        question: "What big question has been occupying your mind lately?",
        actions: [
            { label: "Journal", icon: "journal", description: "Explore deep thoughts" },
            { label: "Music", icon: "music", description: "Contemplative compositions" },
        ],
    },
    rebellious: {
        insight: "Rebellion is the soul's way of demanding authenticity.",
        question: "What rule or expectation no longer serves who you're becoming?",
        actions: [
            { label: "Journal", icon: "journal", description: "Define your own path" },
            { label: "Music", icon: "music", description: "Bold rebel anthems" },
        ],
    },
    silly: {
        insight: "Silliness is a gift — it reminds you not to take life too seriously.",
        question: "What made you laugh today, and can you share it with someone?",
        actions: [
            { label: "Music", icon: "music", description: "Feel-good party mix" },
            { label: "Journal", icon: "journal", description: "Write something ridiculous" },
        ],
    },
};

const fallback: ReflectionData = {
    insight: "Every emotion has its place in your journey — honor this feeling.",
    question: "What is this feeling trying to teach you right now?",
    actions: [
        { label: "Journal", icon: "journal", description: "Reflect on this moment" },
        { label: "Breathe", icon: "breathe", description: "Mindful breathing" },
    ],
};

export function getReflection(moodId: string): ReflectionData {
    return reflections[moodId] || fallback;
}
