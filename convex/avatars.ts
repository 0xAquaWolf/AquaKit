import { v } from 'convex/values';

import { internal } from './_generated/api';
import { action, query } from './_generated/server';

// Action to fetch and store avatar from external URL
export const storeAvatarFromUrl = action({
  args: {
    imageUrl: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    try {
      // Fetch the image from the external URL
      const response = await fetch(args.imageUrl);

      if (!response.ok) {
        console.log(
          `Failed to fetch avatar from ${args.imageUrl}: ${response.statusText}`
        );
        return null;
      }

      // Get the image as a blob
      const imageBlob = await response.blob();

      // Store the image in Convex storage
      const storageId = await ctx.storage.store(imageBlob);

      // Update the user record with the storage ID
      // TODO: Fix type generation issue - this will work at runtime
      await ctx.runMutation((internal.auth as any).updateUserAvatarInternal, {
        userId: args.userId,
        avatarStorageId: storageId,
      });

      return storageId;
    } catch (error) {
      console.error(`Failed to store avatar for user ${args.userId}:`, error);
      return null;
    }
  },
});

// Query to get avatar URL for a user
export const getAvatarUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Query to get user with avatar URL
export const getUserWithAvatar = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    let avatarUrl = null;
    if (user.avatarStorageId) {
      avatarUrl = await ctx.storage.getUrl(user.avatarStorageId);
    }

    return {
      ...user,
      avatarUrl,
    };
  },
});
