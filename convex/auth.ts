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

// Debug query to inspect user accounts and linked providers
export const debugUserAccounts = query({
  args: {},
  handler: async (ctx) => {
    // Get all users from our database
    const users = await ctx.db.query('users').collect();

    // Get current auth user if available
    const currentAuthUser = await betterAuthComponent.getAuthUser(ctx);

    return {
      totalUsers: users.length,
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        lastAuthMethod: user.lastAuthMethod,
      })),
      currentUser: currentAuthUser
        ? {
            userId: currentAuthUser.userId,
            email: currentAuthUser.email,
          }
        : null,
    };
  },
});

// Debug query to find users by email (to check for duplicates)
export const debugFindUsersByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .collect();

    return {
      email: args.email,
      userCount: users.length,
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        lastAuthMethod: user.lastAuthMethod,
      })),
    };
  },
});

// Check if current user is an admin
export const isCurrentUserAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    // Get user data from Better Auth
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return false;
    }

    // Get user data from database
    const user = await ctx.db.get(userMetadata.userId as Id<'users'>);
    if (!user) {
      return false;
    }

    // Check if user is admin or if their email is in the admin list
    if (user.role === 'admin') {
      return true;
    }

    // Check environment variable for admin emails
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    return adminEmails.includes(user.email);
  },
});

// Set user role (admin only)
export const setUserRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('admin'), v.literal('user')),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if current user is admin
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      throw new Error('Not authenticated');
    }

    const currentUser = await ctx.db.get(userMetadata.userId as Id<'users'>);
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    // Check if current user is admin
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      currentUser.role === 'admin' || adminEmails.includes(currentUser.email);

    if (!isAdmin) {
      throw new Error('Only admins can set user roles');
    }

    // Update the target user's role
    await ctx.db.patch(args.userId, {
      role: args.role,
    });

    return null;
  },
});

// Initialize admin users based on environment variable
export const initializeAdmins = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];

    if (adminEmails.length === 0) {
      console.log(
        'No admin emails configured in ADMIN_EMAILS environment variable'
      );
      return null;
    }

    let updatedCount = 0;

    for (const email of adminEmails) {
      const users = await ctx.db
        .query('users')
        .withIndex('email', (q) => q.eq('email', email))
        .collect();

      for (const user of users) {
        if (user.role !== 'admin') {
          await ctx.db.patch(user._id, {
            role: 'admin',
          });
          updatedCount++;
          console.log(`✅ Set admin role for ${email}`);
        }
      }
    }

    if (updatedCount > 0) {
      console.log(`🔧 Initialized ${updatedCount} admin users`);
    }

    return null;
  },
});

// Get all admin users
export const getAdminUsers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('users'),
      email: v.string(),
      name: v.optional(v.string()),
      role: v.optional(v.union(v.literal('admin'), v.literal('user'))),
    })
  ),
  handler: async (ctx) => {
    // Check if current user is admin
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      throw new Error('Not authenticated');
    }

    const currentUser = await ctx.db.get(userMetadata.userId as Id<'users'>);
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      currentUser.role === 'admin' || adminEmails.includes(currentUser.email);

    if (!isAdmin) {
      throw new Error('Only admins can view admin users');
    }

    // Get all admin users
    const adminUsers = await ctx.db
      .query('users')
      .withIndex('role', (q) => q.eq('role', 'admin'))
      .collect();

    return adminUsers.map((user) => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    }));
  },
});

// DEVELOPMENT ONLY: Clear all users from the database
export const devClearAllUsers = mutation({
  args: {
    confirmDeletion: v.string(),
    environment: v.string(),
  },
  handler: async (ctx, args) => {
    // Safety checks to prevent accidental production deletion
    if (args.confirmDeletion !== 'DELETE_ALL_USERS_CONFIRM') {
      throw new Error('Invalid confirmation string');
    }

    if (args.environment !== 'development') {
      throw new Error(
        'This operation is only allowed in development environment'
      );
    }

    // Additional safety check for Convex URL
    const convexUrl = process.env.CONVEX_SITE_URL || '';
    if (convexUrl.includes('prod') || convexUrl.includes('production')) {
      throw new Error('This operation cannot be run on production deployment');
    }

    // Get all users
    const users = await ctx.db.query('users').collect();
    const userCount = users.length;

    // Delete all users
    const deletePromises = users.map((user) => ctx.db.delete(user._id));
    await Promise.all(deletePromises);

    console.log(`🗑️ Deleted ${userCount} users from development database`);

    return {
      deletedCount: userCount,
      message: `Successfully deleted ${userCount} users from development database`,
    };
  },
});
