import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable strict mode for performance in production
  // swcMinify: true, // Use SWC for minification

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console in production
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true, // Optimize CSS
    scrollRestoration: true, // Improve scroll performance
  },
};

export default nextConfig;
