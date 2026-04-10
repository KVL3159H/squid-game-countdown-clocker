import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,    // prevent double render/effect in dev
  output: 'standalone',      // changed from 'export' for Cloudflare OpenNext compatibility
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
