import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,    // prevent double render/effect in dev
  output: 'export',          // static export for Vercel / any CDN
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
