# 🎨 InnerHue Design System

This document outlines the design standards and specifications for InnerHue, ensuring consistency across all components and features.

## 🌈 Emotional Color Palette

InnerHue uses a carefully curated color palette that corresponds to emotional states. Each emotion has a primary color and a glow variant for visual effects.

| Emotion   | Primary Color | Glow Color   | Description |
|-----------|---------------|--------------|-------------|
| **Happy** | `#FFD93D`    | `#FFF176`   | Golden yellows representing joy and positivity |
| **Calm**   | `#66BB6A`    | `#81C784`   | Peaceful greens for tranquility and balance |
| **Sad**    | `#42A5F5`    | `#64B5F6`   | Soothing blues for melancholy and reflection |
| **Excited**| `#AB47BC`    | `#BA68C8`   | Vibrant purples for energy and enthusiasm |
| **Anxious**| `#FF7043`    | `#FF8A65`   | Warm oranges for tension and alertness |

**Note:** These colors are custom and not mapped to standard Tailwind classes. Use the HEX values directly in styles or define custom CSS variables if needed.

## 🔮 Glassmorphism Specifications

InnerHue employs glassmorphism effects to create depth and modern aesthetics. Use these standard values for consistent visual hierarchy.

### Backdrop Blur
- **Standard:** `backdrop-blur-md` (16px blur)
- **Heavy:** `backdrop-blur-xl` (24px blur)

### Background Opacity
- **Subtle:** `bg-white/10` or `bg-black/10`
- **Medium:** `bg-white/30` or `bg-black/20`
- **Strong:** `bg-white/50` to `bg-white/90`

### Border Styles
- **Thin:** `border-white/20`
- **Medium:** `border-white/40`
- **Accent:** `border-purple-300` (for selected states)

## 🎭 Animation Presets

All animations use Framer Motion for smooth, professional transitions. Stick to these presets for consistency.

### Spring Transitions
- **Gentle:** `type: "spring", stiffness: 120, damping: 12`
- **Responsive:** `type: "spring", stiffness: 300, damping: 20`
- **Snappy:** `type: "spring", stiffness: 400, damping: 25`

### Tween Transitions
- **Slow Float:** `duration: 4, ease: "easeInOut", repeat: Infinity`
- **Quick Pulse:** `duration: 2, ease: "easeInOut", repeat: Infinity`
- **Fade In:** `duration: 0.3, ease: "easeOut"`

## 📝 Typography

InnerHue uses the Inter font family for clean, modern typography.

### Font Family
- **Primary:** Inter (Google Fonts)

### Headings
- **Large:** `text-3xl` (30px), `font-medium`
- **Medium:** `text-xl` (20px), `font-semibold`
- **Small:** `text-lg` (18px), `font-medium`

### Body Text
- **Primary:** `text-base` (16px), `font-normal`
- **Secondary:** `text-sm` (14px), `font-medium`
- **Caption:** `text-xs` (12px), `font-normal`

### Color Usage
- **Primary Text:** `text-gray-800` or `text-gray-900`
- **Secondary Text:** `text-gray-600`
- **Muted:** `text-gray-400`

---

*These guidelines ensure InnerHue maintains its high-aesthetic, emotional design language. Always reference this document when adding new components or features.*