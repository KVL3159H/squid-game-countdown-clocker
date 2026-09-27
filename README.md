# Squid Game CTF Countdown

[![Live Website](https://img.shields.io/badge/Live_Website-Open_Project-111111?style=for-the-badge)](https://squid-game-countdown-clocker.onrender.com/)

**Live deployment:** https://squid-game-countdown-clocker.onrender.com/

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

- Node.js 22 recommended
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

### Production — Render

The live production deployment is hosted on Render:

**https://squid-game-countdown-clocker.onrender.com/**

Recommended Render configuration:

- **Service type:** Web Service
- **Runtime:** Node
- **Branch:** `master`
- **Root Directory:** repository root
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`
- **Node.js:** 22

Render automatically redeploys the production service when new commits are pushed to `master`.

See [`docs/RENDER_DEPLOYMENT.md`](docs/RENDER_DEPLOYMENT.md) for deployment and troubleshooting notes.

## Contributing

Focused contributions are welcome. Good areas include accessibility, reduced-motion support, configuration options, tests, and documentation.

---

Built as an event-focused countdown interface for CTF and timed challenge environments.
