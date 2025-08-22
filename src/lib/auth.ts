import { convexAdapter } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { requireEnv } from '@convex-dev/better-auth/utils';
import { betterAuth } from 'better-auth';

import { type GenericCtx } from '@/convex/_generated/server';
import { betterAuthComponent } from '@/convex/auth';

const siteUrl = requireEnv('SITE_URL');

export const createAuth = (ctx: GenericCtx) =>
  // Configure your Better Auth instance here
  betterAuth({
    // All auth requests will be proxied through your next.js server
    baseURL: siteUrl,
    database: convexAdapter(ctx, betterAuthComponent),

    // Simple non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required
      convex(),
    ],
  });
