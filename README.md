# Squid Game CTF Countdown

A cinematic, full-screen countdown experience built with Next.js and React for CTF/event environments. The interface combines a two-hour timer, rotating backgrounds, full-screen controls, warning states, progress tracking, and dramatic end-game effects.

> This is an unofficial fan-made interface inspired by the visual style of *Squid Game*. It is not affiliated with or endorsed by Netflix.

## Features

- Two-hour countdown timer
- Full-screen mode with an explicit enter/exit control
- Automatic background rotation
- Smooth image cross-fades
- Final 10-minute danger mode
- Warning messages and visual effects
- Progress tracking
- Responsive React UI
- Accessible labels for full-screen controls

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm, pnpm, yarn, or Bun

### Install

```bash
git clone https://github.com/KVL3159H/squid-game-countdown-clocker.git
cd squid-game-countdown-clocker
npm install
```

### Run

```bash
npm run dev
```

Open the local URL printed by Next.js, normally:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```text
app/
├── page.tsx        main countdown experience
└── ...             Next.js application files

public/
└── image assets used by the rotating background
```

## Main Timing Constants

The primary timing values are defined in `app/page.tsx`:

```ts
const TOTAL = 7200;      // two hours
const IMG_EVERY = 120;   // image rotation interval
const DANGER_AT = 600;   // final ten minutes
```

Change these values to adapt the experience for a different event length.

## Customization

You can customize:

- timer duration;
- warning text;
- image rotation interval;
- background assets;
- danger-mode threshold;
- typography and visual effects.

The background files are referenced from the public directory.

## Accessibility Notes

The full-screen toggle includes an ARIA label and title. When extending the project, preserve keyboard access, readable contrast, and reduced-motion support where practical.

## Deployment

### Vercel

This repository is ready for Vercel deployment. The Next.js configuration uses static export with unoptimized images, so the project can be served as a static site after the production build.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KVL3159H/squid-game-countdown-clocker)

Recommended Vercel settings:

- **Framework Preset:** Next.js
- **Root Directory:** repository root
- **Install Command:** `npm install` (default)
- **Build Command:** `npm run build`
- **Output:** handled by the Next.js static export configuration
- **Node.js:** 22

Every push to the connected production branch can trigger a fresh deployment automatically.

The project can also be deployed on any platform capable of serving the generated static export.

## Contributing

Focused contributions are welcome. Good areas include accessibility, reduced-motion support, configuration options, tests, and documentation.

---

Built as an event-focused countdown interface for CTF and timed challenge environments.
