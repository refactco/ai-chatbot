/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable pages directory since we're using App Router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Configure allowed image domains
  images: {
    domains: ['avatar.vercel.sh', 'placehold.co'],
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

module.exports = nextConfig;
