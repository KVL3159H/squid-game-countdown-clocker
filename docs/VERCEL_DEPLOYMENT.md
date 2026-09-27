# Vercel Deployment

The Squid Game CTF Countdown is a Next.js application configured for static export.

## Deployment path

1. Connect the GitHub repository `KVL3159H/squid-game-countdown-clocker` to Vercel.
2. Keep the framework preset as **Next.js**.
3. Use the repository root as the root directory.
4. Use Node.js 22.
5. Build with `npm run build`.
6. Deploy.

No environment variables are currently required by the application.

## Automatic deployments

After the GitHub repository is connected to Vercel:

- pushes to the production branch create production deployments;
- pull requests can receive preview deployments;
- failed builds are visible before production promotion.

## Local production verification

```bash
npm ci
npm run build
```

The repository also has GitHub Actions build verification, so changes are checked before merge.

## Static-export note

`next.config.ts` currently contains:

```ts
output: 'export'
```

and images are configured with `unoptimized: true`. This keeps the countdown experience deployable as static assets without requiring a long-running Node.js server.

## Branding notice

This is an unofficial fan-made interface inspired by the visual style of *Squid Game*. It is not affiliated with or endorsed by Netflix.
