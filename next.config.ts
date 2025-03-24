import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable strict mode for performance in production
  webpack: (config) => {
    // Add a rule to handle the Spline package
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
      },
    });
    
    return config;
  },
  // Add transpilePackages to properly handle the Spline package
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],

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
