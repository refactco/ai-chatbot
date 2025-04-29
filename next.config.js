/**
 * Next.js Configuration File
 *
 * This file configures the Next.js application's behavior and features.
 *
 * Configuration settings:
 * - pageExtensions: Defines which file extensions are treated as pages
 * - images: Configures allowed image domains for next/image
 * - experimental: Toggle experimental Next.js features
 *
 * This configuration enables the app router functionality while restricting
 * image sources to trusted domains for security.
 */

/** @type {import('next').Config} */
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
