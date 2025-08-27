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
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID as string,
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: 'offline',
        prompt: 'select_account+consent',
      },
    },
    // Simple non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      // sendResetPassword: async ({ user, url }) => {
      //   await sendResetPassword(requireMutationCtx(ctx), {
      //     to: user.email,
      //     url,
      //   });
      // },
    },
    plugins: [
      // The Convex plugin is required
      convex(),
    ],
  });
