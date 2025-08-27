/**
 * Environment Configuration for AquaKit
 *
 * This file helps manage environment-specific settings.
 * Environment variables should be set in Convex for backend
 * and in .env.local for frontend.
 */

export const environments = {
  development: {
    convexUrl: 'https://quaint-rabbit-453.convex.cloud',
    siteUrl: 'http://localhost:3000',
    redirectUrls: {
      github: 'http://localhost:3000/api/auth/callback/github',
      discord: 'http://localhost:3000/api/auth/callback/discord',
      google: 'http://localhost:3000/api/auth/callback/google',
    },
  },
  production: {
    convexUrl: 'https://oceanic-cormorant-345.convex.cloud',
    siteUrl: 'https://your-production-domain.com', // Update this!
    redirectUrls: {
      github: 'https://your-production-domain.com/api/auth/callback/github',
      discord: 'https://your-production-domain.com/api/auth/callback/discord',
      google: 'https://your-production-domain.com/api/auth/callback/google',
    },
  },
} as const;

export type Environment = keyof typeof environments;

export function getEnvironment(): Environment {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

export function getConfig(env?: Environment) {
  const currentEnv = env || getEnvironment();
  return environments[currentEnv];
}

// Helper to get current environment URLs
export function getCurrentUrls() {
  const config = getConfig();
  return {
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL || config.convexUrl,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || config.siteUrl,
    redirectUrls: config.redirectUrls,
  };
}
