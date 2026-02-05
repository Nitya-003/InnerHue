# 🌈 InnerHue - Emotional Reflection Web App

A beautifully animated emotional wellness platform that helps users explore, visualize, and understand their feelings through interactive mood tracking, 3D visualizations, and personalized insights.

<div align="center">

![Apertre 3.0](https://img.shields.io/badge/Apertre_3.0-Contributor_Favorite-FF4B2B?style=for-the-badge&logo=opensourceinitiative&logoColor=white)
![Open Source Love](https://img.shields.io/badge/Open_Source-❤️-pink?style=for-the-badge)

</div>

---

## ✨ Features

### 🎨 Mood Selection
- **20+ Emotional States**: From happiness to melancholy, each with unique colors and personalities
- **Floating Card Interface**: Disney-inspired 3D animations with shimmer and hover effects
- **Intuitive Design**: Beautiful gradient backgrounds and smooth transitions

### 🔮 3D Orb Visualizer
- **Dynamic Visualization**: Interactive orbs that change color, glow, and animation based on selected mood
- **Particle Effects**: Floating particles and ripple rings for immersive experience
- **Responsive Animations**: Smooth Framer Motion animations with customizable states

### 💬 AI-Powered Suggestions
- **Journal Prompts**: Thoughtful questions tailored to your emotional state
- **Inspirational Quotes**: Curated quotes from renowned authors and thinkers
- **Keyword Clouds**: Emotion-related words to expand emotional vocabulary
- **Music Recommendations**: Spotify-style playlists matching your mood

### 📊 Analytics Dashboard
- **Mood Tracking**: Visual charts showing emotional patterns over time
- **Statistics**: Daily, weekly, and overall mood insights
- **Recent Activity**: Timeline of your emotional journey
- **Progress Visualization**: Beautiful bar and pie charts

### 🎵 Music Integration
- **Curated Playlists**: Genre-specific music recommendations for each mood
- **Interactive Player**: Play/pause functionality with beautiful UI
- **Mood-Based Organization**: Easy switching between emotional soundscapes

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 13 with App Router
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion for smooth, professional animations
- **Icons**: Lucide React for consistent iconography
- **Data Storage**: Local Storage for client-side persistence
- **TypeScript**: Full type safety throughout the application
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions with automated testing and security scanning

---

## 🗺️ System Architecture
To understand how InnerHue processes your emotional data, here is the high-level logic flow:
```mermaid
graph TD
    A[User Selection] -->|Select Mood| B(Mood Engine)
    B --> C{Dynamic Mapping}
    C -->|Update| D[3D Orb Visualizer]
    C -->|Fetch| E[AI Suggestions & Quotes]
    C -->|Filter| F[Curated Music Playlists]
    D --> G[Local Storage Persistence]
    E --> G
    F --> G
    G --> H[Analytics Dashboard]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#6272a4,stroke:#333,stroke-width:2px,color:#fff
    style H fill:#50fa7b,stroke:#333,stroke-width:2px
```

---

## 🎯 Design Philosophy

InnerHue follows **Apple-level design aesthetics** with:
- **Glassmorphism**: Backdrop blur effects and translucent cards
- **Micro-interactions**: Subtle hover states and tap feedback
- **Color Psychology**: Carefully chosen colors that match emotional states
- **Responsive Design**: Mobile-first approach with perfect cross-device experience
- **Accessibility**: High contrast ratios and intuitive navigation

---

## 🚀 Getting Started

### 📦 Traditional Setup

1. **Clone the repository**
```bash
git clone https://github.com/Nitya-003/innerhue.git
cd innerhue
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

### 🐋 Docker Setup (Recommended)

#### Option 1: Using Docker Compose (Easiest)

```bash
# Production build
docker-compose up

# Development with hot reload
docker-compose --profile dev up app-dev
```

#### Option 2: Using Docker Directly

```bash
# Build the Docker image
docker build -t innerhue .

# Run the container
docker run -p 3000:3000 innerhue
```

#### 🛠️ Development with Docker

For development with hot reload and volume mounting:

```bash
# Build development image
docker build -f Dockerfile.dev -t innerhue-dev .

# Run with volume mounting for hot reload
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules innerhue-dev
```

### 📊 Docker Image Details

- **Base Image**: Node.js 18 Alpine Linux
- **Multi-stage Build**: Optimized for production
- **Image Size**: < 300MB (typically ~150-200MB)
- **Security**: Runs as non-root user (`nextjs`)
- **Architecture**: Supports both AMD64 and ARM64

### 🔧 Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: Analytics and tracking
NEXT_TELEMETRY_DISABLED=1

# Add other environment variables as needed
```

---

## 🎨 Color System

InnerHue uses a comprehensive emotional color palette:
- **Happy**: Golden yellows (#FFD93D)
- **Calm**: Peaceful greens (#66BB6A)
- **Sad**: Soothing blues (#42A5F5)
- **Excited**: Vibrant purples (#AB47BC)
- **Anxious**: Warm oranges (#FF7043)

---

## 🔄 Future Enhancements

- [x] **Containerization**: Docker setup with multi-stage builds ✅
- [x] **CI/CD Pipeline**: GitHub Actions with automated testing ✅
- [ ] **Backend Integration**: Express.js API with MongoDB
- [ ] **Real NLP**: OpenAI or Cohere integration for dynamic suggestions
- [ ] **Social Features**: Share insights with friends and family
- [ ] **Voice Journaling**: Audio recordings with sentiment analysis
- [ ] **Meditation Timer**: Guided meditation based on current mood
- [ ] **Wearable Integration**: Apple Watch and Fitbit mood tracking

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for incredible animation capabilities
- **TailwindCSS** for the flexible design system
- **Next.js** for the amazing developer experience
- **Inspiration** from emotional wellness platforms and modern design trends

---

**InnerHue** - *Discover the colors of your emotions* 🌈✨
