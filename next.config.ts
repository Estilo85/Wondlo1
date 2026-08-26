import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tell Next.js / Vercel to bundle server-side admin packages properly
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;