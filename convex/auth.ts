import {
  AuthFunctions,
  BetterAuth,
  PublicAuthFunctions,
} from '@convex-dev/better-auth';
import { v } from 'convex/values';

import { api, components, internal } from './_generated/api';
import { DataModel, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
  publicAuthFunctions,
  verbose: false,
});

export const {
  createUser,
  deleteUser,
  updateUser,
  createSession,
  isAuthenticated,
} = betterAuthComponent.createAuthFunctions<DataModel>({
  onCreateUser: async (ctx, user) => {
    // Generate a random color for users without an image
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E9',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const userId = await ctx.db.insert('users', {
      email: user.email,
      name: user.name || undefined,
      avatarColor: user.image ? undefined : randomColor,
    });

    // If user has an image from social provider, store it asynchronously
    if (user.image) {
      ctx.scheduler.runAfter(0, api.avatars.storeAvatarFromUrl, {
        imageUrl: user.image,
        userId,
      });
    }

    return userId;
  },
  onDeleteUser: async (ctx, userId) => {
    // Delete the user's data if the user is being deleted
    await ctx.db.delete(userId as Id<'users'>);
  },
  onUpdateUser: async (ctx, user) => {
    // Keep the user's data synced
    const userId = user.userId as Id<'users'>;
    const currentUser = await ctx.db.get(userId);

    await ctx.db.patch(userId, {
      email: user.email,
      name: user.name || undefined,
    });

    // If user has a new image from social provider, store it asynchronously
    if (user.image && !currentUser?.avatarStorageId) {
      ctx.scheduler.runAfter(0, api.avatars.storeAvatarFromUrl, {
        imageUrl: user.image,
        userId,
      });
    }
  },
});

// Get current user with avatar URL
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get user data from Better Auth
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }

    // Get user data from database
    const user = await ctx.db.get(userMetadata.userId as Id<'users'>);
    if (!user) {
      return null;
    }

    // Get avatar URL if storage ID exists
    let avatarUrl = null;
    if (user.avatarStorageId) {
      avatarUrl = await ctx.storage.getUrl(user.avatarStorageId);
    }

    return {
      ...user,
      ...userMetadata,
      avatarUrl,
    };
  },
});

// Internal mutation to update user avatar storage ID
export const updateUserAvatarInternal = mutation({
  args: {
    userId: v.id('users'),
    avatarStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      avatarStorageId: args.avatarStorageId,
    });
  },
});

// Mutation to update user's last authentication method
export const updateLastAuthMethod = mutation({
  args: {
    authMethod: v.union(
      v.literal('email'),
      v.literal('google'),
      v.literal('github'),
      v.literal('discord')
    ),
  },
  handler: async (ctx, args) => {
    // Get current authenticated user
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      // Return silently instead of throwing - this can happen during auth transitions
      console.warn('updateLastAuthMethod: User not authenticated yet');
      return;
    }

    // Verify the user exists in our database
    const user = await ctx.db.get(userMetadata.userId as Id<'users'>);
    if (!user) {
      console.warn('updateLastAuthMethod: User not found in database');
      return;
    }

    // Update the user's last auth method
    await ctx.db.patch(userMetadata.userId as Id<'users'>, {
      lastAuthMethod: args.authMethod,
    });
  },
});
