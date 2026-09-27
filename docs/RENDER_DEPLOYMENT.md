# Render Production Deployment

The live production deployment of **Squid Game CTF Countdown** is hosted on Render:

**https://squid-game-countdown-clocker.onrender.com/**

## Service configuration

- **Service type:** Web Service
- **Runtime:** Node
- **Branch:** `master`
- **Root directory:** repository root
- **Build command:** `npm ci && npm run build`
- **Start command:** `npm start`
- **Node.js:** 22
- **Environment variables:** none required by the application

Render provides the `PORT` environment variable automatically. Next.js reads it when the production server starts, so a hard-coded port is not required.

## Automatic deployment

The production service is connected to the GitHub repository. New commits pushed to `master` can trigger a fresh Render build and deployment.

Before merging changes, the repository's GitHub Actions workflow verifies that dependencies install and the Next.js production build succeeds.

## Local production verification

```bash
npm ci
npm run build
npm start
```

Then open the local address printed by Next.js.

## Troubleshooting

If a Render deployment fails:

1. Open the service in the Render dashboard.
2. Open the latest deploy.
3. Inspect the build or runtime logs.
4. Compare the failing commit with the GitHub Actions build for the same revision.
5. Fix the underlying dependency, build, or runtime issue and push a new commit.

## Branding notice

This is an unofficial fan-made interface inspired by the visual style of *Squid Game*. It is not affiliated with or endorsed by Netflix.
