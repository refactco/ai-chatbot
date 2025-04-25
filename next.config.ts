import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  devIndicators: false,
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
