import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',          // static export for Vercel / any CDN
  trailingSlash: true,
  images: {
    unoptimized: true,       // needed for static export
  },
};

export default nextConfig;
