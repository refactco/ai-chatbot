/**
 * Next.js Configuration
 *
 * This file configures Next.js framework settings for the application.
 * Features:
 * - Parallel Route Rendering (PPR) experimental flag
 * - Remote image pattern allowlist
 * - Development indicators configuration
 * - Webpack configuration for MSW (Mock Service Worker)
 * - CORS configuration for real API access
 *
 * The configuration enables proper functioning of the application
 * with necessary optimizations and integrations.
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        hostname: 'localhost',
        protocol: 'http',
      },
    ],
  },
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/chat/stream',
        destination: 'http://localhost:3333/api/chat/stream',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle MSW import path issues
    if (isServer) {
      // Server build: ignore msw/browser imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'msw/browser': false,
      };
    } else {
      // Browser build: ignore msw/node imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'msw/node': false,
      };
    }

    return config;
  },
};

export default nextConfig;
