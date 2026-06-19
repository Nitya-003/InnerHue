# InnerHue Setup Guide

Complete environment configuration and development setup for InnerHue.

---

## 📁 Project Structure

InnerHue is a **monorepo** with two main applications:

- **Frontend** (`/frontend`): Next.js React application
- **Backend** (`/backend`): Node.js API server

---

## Prerequisites

- **Node.js**: 18.x or higher (LTS recommended)
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: 2.x or higher

### Verify Prerequisites

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show 2.x.x or higher
```

---

## Quick Start

### Clone & Setup

```bash
git clone https://github.com/Nitya-003/innerhue.git
cd innerhue
npm install
```

### Run Frontend

```bash
npm run dev
# or
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Backend (Optional)

```bash
cd backend
npm install
npm run dev
```

Backend will run on [http://localhost:3001](http://localhost:3001)

---

## Detailed Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nitya-003/innerhue.git
cd innerhue
```

### 2. Install Dependencies

Install root dependencies (for monorepo scripts):
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

Install backend dependencies (optional):
```bash
cd backend
npm install
cd ..
```

### Frontend Dependencies

- Next.js 14 with App Router
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- Lucide React icons
- shadcn/ui components
- Recharts for analytics

### Backend Dependencies

To be configured based on your backend needs (Express, Fastify, etc.)

### 3. Environment Configuration

#### Frontend `.env.local` (in `/frontend`)

Create a `.env.local` file in the frontend directory:

```bash
# Optional: Add any API keys here
# NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
```

> **Note**: InnerHue currently runs without external API keys. All data is stored locally in the browser.

#### Backend `.env` (in `/backend`)

Create a `.env` file in the backend directory:

```bash
PORT=3001
NODE_ENV=development
# Add your backend API keys here
```

### 4. Start Development

#### Frontend Development Server

```bash
npm run dev
# or
cd frontend && npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

#### Backend Development Server (Optional)

```bash
cd backend && npm run dev
```

Backend runs on [http://localhost:3001](http://localhost:3001)

---

## Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run build` | Build frontend for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint frontend code |

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint for code quality |

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with watch mode |
| `npm run build` | Build backend (if applicable) |
| `npm run start` | Start production server |

---

## Docker Setup (Optional)

If you prefer containerized development:

### Build and Run

```bash
# Build the Docker image
docker build -t innerhue .

# Run the container
docker run -p 3000:3000 innerhue
```

### Docker Compose

```bash
# Using docker-compose
docker-compose up
```

---

## Troubleshooting

### Common Issues

#### Port 3000 Already in Use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

#### npm install Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Windows PowerShell Execution Policy

If you get execution policy errors:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Module Not Found Errors

```bash
# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Build Errors

If `npm run build` fails:

1. Check for TypeScript errors: `npx tsc --noEmit`
2. Check for ESLint errors: `npm run lint`
3. Clear Next.js cache: `rm -rf .next`

---

## Project Structure

```
innerhue/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard page
│   ├── mood/[id]/         # Dynamic mood detail pages
│   ├── music/             # Music player page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (mood selection)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── MoodCard.tsx      # Mood selection card
│   ├── OrbVisualizer.tsx # 3D mood visualization
│   ├── SuggestionPanel.tsx
│   └── ...
├── data/                  # Static data
│   └── fallbackQuotes.ts
├── hooks/                 # Custom React hooks
│   ├── use-toast.ts
│   └── useLocalStorage.ts
├── lib/                   # Utility functions
│   ├── getQuote.ts
│   ├── moodData.ts
│   └── utils.ts
├── public/               # Static assets
├── .env.local            # Environment variables (create this)
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # TailwindCSS configuration
└── tsconfig.json         # TypeScript configuration
```

---

## IDE Setup

### VS Code Extensions (Recommended)

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind
- **TypeScript Importer**: Auto-imports
- **GitLens**: Git visualization

### VS Code Settings

Add to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

---

## Browser Support

InnerHue supports:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing Setup

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## Need Help?

- Check the [README.md](./README.md) for project overview
- Review [Design.md](./Design.md) for design guidelines
- Open an issue on GitHub
- Join our community discussions

---

**Happy coding!** 
