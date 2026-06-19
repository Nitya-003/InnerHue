# Contributing to InnerHue

First off, thank you for considering contributing! InnerHue is built at the intersection of technology and emotional wellness, and your help is what makes this vision grow. By contributing, you’re helping build a more emotionally aware digital world.

---

## How Can I Contribute?

### 1. Reporting Bugs
- **Use the Template:** All bugs must be reported using our **[Bug Report Template]**. This ensures we have the technical details needed to fix the issue quickly.
- **Precision:** Describe the exact steps to reproduce the glitch, including your browser and device.
- **Visuals:** Since InnerHue is a highly visual platform, screenshots or screen recordings are greatly appreciated to help us "see" the problem.

### 2. Suggesting Enhancements
- **Aesthetic First:** We love "Apple-level" design ideas! Use the **[Feature Request Template]** for all new proposals.
- **Design Philosophy:** Explain how your feature fits into our glassmorphism-based design system and how it improves the user's emotional reflection journey.

### 3. Pull Requests (PRs)
1. **Fork & Branch:** Fork the repository and create your feature branch from `main`.
2. **Follow the Template:** Your PR **must** be submitted using our **[Pull Request Template]**. PRs without a completed checklist will be marked as "Incomplete."
3. **Design Check:** Ensure your UI changes follow our **Glassmorphism & Design System** (blur, shadows, and Framer Motion).
4. **Link Issues:** Always link your PR to the specific issue it solves (e.g., `Closes #12`).

---

## Design Guidelines
InnerHue is a high-aesthetic project. To maintain our standard:
* **Animations:** Use `framer-motion` for smooth, professional transitions. Avoid "instant" or "jittery" state changes.
* **Glassmorphism:** Utilize `backdrop-blur`, translucent backgrounds, and subtle borders to create depth.
* **Typography:** Maintain a clear visual hierarchy using clean, sans-serif fonts.
* **Color Strategy:** Stick strictly to the defined **Emotional Color Palette** mentioned in the Main README.

---

## Commit Message Guidelines

InnerHue enforces **Conventional Commits** via `commitlint` + `husky`. Every commit is validated automatically on `commit-msg`. Non-conforming commits are rejected.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system, dependencies |
| `ci` | CI/CD configuration |
| `chore` | Maintenance tasks |
| `revert` | Revert a previous commit |

### Good Commits

```bash
# Simple feature
feat: add mood streak tracker to dashboard

# Feature with scope
feat(auth): add Google OAuth login

# Bug fix with issue reference
fix(ui): correct color contrast on dark mode toggle

Fixes #102

# Breaking change
feat(api)!: rename /mood-log endpoint to /mood-entries

BREAKING CHANGE: All clients must update API paths.

# Docs update
docs: add environment variable setup to SETUP.md

# Dependency upgrade
build: upgrade framer-motion to v12
```

### Bad Commits

```bash
# No type prefix
update readme

# Vague description
fix: fixed it

# Wrong tense (use imperative mood)
feat: added new feature

# Too long (keep under 72 chars)
feat: add a new feature that allows users to export their mood data in multiple formats

# Mixed concerns (split into separate commits)
feat: add dark mode and fix login bug and update docs

# WIP commits (squash before merging)
WIP

# Generic/meaningless
misc changes
```

### Rules Enforced

- Type must be one of the valid types above
- Scope must be `kebab-case`
- Description must be `lower-case`
- Description must be ≤ 72 characters
- Body lines must be ≤ 100 characters

---

## Development Workflow
- **Setup:** Run `npm install` to install the necessary dependencies.
- **Development:** Use `npm run dev` to launch the local development server.
- **Next.js Docs:** Run `npm run install-nextjs-docs` to download the latest Next.js documentation locally. This creates a `.next-docs/` directory indexed in `AGENTS.md` for offline reference during development.
- **Type Safety:** We use **TypeScript** for a robust codebase. Please ensure your code is fully typed and avoid using `any`.

---

### Contribution Standard
> **Please Note:** To maintain project organization, any Issue or Pull Request that does not follow the provided templates may be closed. We appreciate your cooperation in keeping InnerHue professional!

*Need guidance? Let's connect on [LinkedIn](https://www.linkedin.com/in/nitya-gosain1103)!*
