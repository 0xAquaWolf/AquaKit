import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          process.env.NEXT_PUBLIC_CONVEX_URL?.replace('https://', '') || '',
        port: '',
        pathname: '/api/storage/**',
      },
    ],
  },
};

export default nextConfig;
