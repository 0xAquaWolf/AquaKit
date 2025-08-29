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
  onCreateSession: async (ctx, session) => {
    // Check if user is banned before creating session
    const user = await ctx.db.get(session.userId as Id<'users'>);
    // If user doesn't exist yet, allow session creation (they're in the process of being created)
    if (!user) {
      return session;
    }

    // Check if user is banned
    if (user.banned) {
      // Check if ban has expired
      if (user.banExpires && user.banExpires < Date.now()) {
        // Ban has expired, automatically unban the user
        await ctx.db.patch(user._id, {
          banned: false,
          banReason: undefined,
          banExpires: undefined,
        });
      } else {
        // User is still banned
        const banMessage = user.banReason || 'Your account has been banned.';
        const expiryMessage = user.banExpires
          ? ` Ban expires on ${new Date(user.banExpires).toLocaleDateString()}.`
          : ' This ban is permanent.';

        throw new Error(
          `${banMessage}${expiryMessage} Please contact support if you believe this is an error.`
        );
      }
    }

    return session;
  },
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

// Get current user with avatar URL (read-only version)
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

    // Check if user is banned (for existing sessions)
    if (user.banned) {
      // Check if ban has expired
      if (user.banExpires && user.banExpires < Date.now()) {
        // Ban has expired, but we can't modify in a query
        // The user will need to re-authenticate to be unbanned
        return null;
      } else {
        // User is still banned, return null to force logout
        return null;
      }
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

// Check if current user is banned and return ban info
export const checkCurrentUserBanStatus = query({
  args: {},
  returns: v.union(
    v.object({
      isBanned: v.literal(true),
      banReason: v.optional(v.string()),
      banExpires: v.optional(v.number()),
    }),
    v.object({
      isBanned: v.literal(false),
    }),
    v.null()
  ),
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

    // Check if user is banned
    if (user.banned) {
      // Check if ban has expired
      if (user.banExpires && user.banExpires < Date.now()) {
        // Ban has expired, but we can't modify in a query - return as not banned
        return { isBanned: false as const };
      } else {
        // User is still banned
        return {
          isBanned: true as const,
          banReason: user.banReason,
          banExpires: user.banExpires,
        };
      }
    }

    return { isBanned: false as const };
  },
});

// Mutation to check and unban expired users
export const checkAndUnbanExpiredUser = mutation({
  args: {},
  returns: v.null(),
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

    // Check if user is banned and if ban has expired
    if (user.banned && user.banExpires && user.banExpires < Date.now()) {
      // Ban has expired, automatically unban the user
      await ctx.db.patch(user._id, {
        banned: false,
        banReason: undefined,
        banExpires: undefined,
      });
    }

    return null;
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
    try {
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
    } catch (err) {
      console.error('isCurrentUserAdmin error:', err);
      // Never surface server errors to the client for this check
      return false;
    }
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

// Admin: List all users with pagination and filtering
export const adminListUsers = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    searchValue: v.optional(v.string()),
    searchField: v.optional(v.union(v.literal('email'), v.literal('name'))),
    sortBy: v.optional(v.string()),
    sortDirection: v.optional(v.union(v.literal('asc'), v.literal('desc'))),
  },
  returns: v.object({
    users: v.array(
      v.object({
        _id: v.id('users'),
        _creationTime: v.number(),
        email: v.string(),
        name: v.optional(v.string()),
        role: v.optional(v.union(v.literal('admin'), v.literal('user'))),
        banned: v.optional(v.boolean()),
        banReason: v.optional(v.string()),
        banExpires: v.optional(v.number()),
        lastAuthMethod: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        avatarColor: v.optional(v.string()),
        avatarStorageId: v.optional(v.id('_storage')),
      })
    ),
    total: v.number(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  }),
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

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      currentUser.role === 'admin' || adminEmails.includes(currentUser.email);

    if (!isAdmin) {
      throw new Error('Only admins can list users');
    }

    const limit = args.limit || 100;
    const offset = args.offset || 0;

    // Get all users (we'll implement proper filtering client-side for now)
    const allUsers = await ctx.db.query('users').collect();

    // Filter by search if provided
    let filteredUsers = allUsers;
    if (args.searchValue && args.searchField) {
      const searchValue = args.searchValue.toLowerCase();
      filteredUsers = allUsers.filter((user) => {
        if (args.searchField === 'email') {
          return user.email.toLowerCase().includes(searchValue);
        } else if (args.searchField === 'name' && user.name) {
          return user.name.toLowerCase().includes(searchValue);
        }
        return false;
      });
    }

    // Sort users
    if (args.sortBy) {
      filteredUsers.sort((a, b) => {
        let aValue: unknown = a[args.sortBy as keyof typeof a];
        let bValue: unknown = b[args.sortBy as keyof typeof b];

        if (aValue === undefined) aValue = '';
        if (bValue === undefined) bValue = '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (args.sortDirection === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    // Get avatar URLs for users
    const usersWithAvatars = await Promise.all(
      paginatedUsers.map(async (user) => {
        let avatarUrl: string | undefined = undefined;
        if (user.avatarStorageId) {
          const url = await ctx.storage.getUrl(user.avatarStorageId);
          avatarUrl = url || undefined;
        }
        return {
          ...user,
          avatarUrl,
        };
      })
    );

    return {
      users: usersWithAvatars,
      total,
      limit,
      offset,
    };
  },
});

// Admin: Create a new user
export const adminCreateUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal('admin'), v.literal('user'))),
  },
  returns: v.id('users'),
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

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      currentUser.role === 'admin' || adminEmails.includes(currentUser.email);

    if (!isAdmin) {
      throw new Error('Only admins can create users');
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Generate a random color for the user
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
      email: args.email,
      name: args.name,
      role: args.role || 'user',
      avatarColor: randomColor,
    });

    return userId;
  },
});

// Admin: Ban a user
export const adminBanUser = mutation({
  args: {
    userId: v.id('users'),
    banReason: v.optional(v.string()),
    banExpiresIn: v.optional(v.number()), // seconds
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

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      currentUser.role === 'admin' || adminEmails.includes(currentUser.email);

    if (!isAdmin) {
      throw new Error('Only admins can ban users');
    }

    // Don't allow banning yourself
    if (args.userId === currentUser._id) {
      throw new Error('You cannot ban yourself');
    }

    const banExpires = args.banExpiresIn
      ? Date.now() + args.banExpiresIn * 1000
      : undefined;

    await ctx.db.patch(args.userId, {
      banned: true,
      banReason: args.banReason || 'No reason provided',
      banExpires,
    });

    return null;
  },
});

// Admin: Unban a user
export const adminUnbanUser = mutation({
  args: {
    userId: v.id('users'),
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

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      currentUser.role === 'admin' || adminEmails.includes(currentUser.email);

    if (!isAdmin) {
      throw new Error('Only admins can unban users');
    }

    await ctx.db.patch(args.userId, {
      banned: false,
      banReason: undefined,
      banExpires: undefined,
    });

    return null;
  },
});

// Admin: Delete a user
export const adminDeleteUser = mutation({
  args: {
    userId: v.id('users'),
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

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      currentUser.role === 'admin' || adminEmails.includes(currentUser.email);

    if (!isAdmin) {
      throw new Error('Only admins can delete users');
    }

    // Don't allow deleting yourself
    if (args.userId === currentUser._id) {
      throw new Error('You cannot delete yourself');
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Delete user's avatar if it exists
    if (targetUser.avatarStorageId) {
      await ctx.storage.delete(targetUser.avatarStorageId);
    }

    await ctx.db.delete(args.userId);

    return null;
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
