# InnerHue Frontend

A beautifully animated emotional wellness platform built with Next.js, React, and Three.js.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── (various pages)  # Feature pages
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── landing/        # Landing page components
│   ├── emotion/        # Emotion-related components
│   └── personalization/# Personalization components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript types
├── public/             # Static assets
├── data/               # Static data files
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Features

- 🎨 Beautiful UI with Tailwind CSS and Shadcn UI
- 🎭 Emotional mood tracking and visualization
- 🎵 Music integration for emotional wellness
- 📊 Analytics and insights
- 🌈 Personalized experience
- 🚀 Progressive Web App (PWA) support
- ♿ Accessibility focused

## Environment Variables

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
```

## Technologies Used

- **Framework**: Next.js 14
- **UI Library**: React
- **Styling**: Tailwind CSS, Shadcn UI
- **3D Graphics**: Three.js
- **Animations**: Framer Motion
- **Database**: Firebase
- **Charts**: Chart.js, Recharts

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

ISC - See [LICENSE](../LICENSE) for details.
